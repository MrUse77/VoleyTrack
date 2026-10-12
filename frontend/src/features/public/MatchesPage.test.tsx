// @vitest-environment jsdom

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_MATCHES, PUBLIC_TOURNAMENTS, type MatchFixture } from "../../fixtures";
import { MatchesPage } from "./MatchesPage";

let search: Record<string, string> = {};
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a {...props} href={to}>{children}</a>;
  },
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

function renderMatches(status?: string) {
  search = status ? { status } : {};
  return renderToStaticMarkup(<MatchesPage />);
}

function findCard(container: HTMLElement, match: MatchFixture) {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('[data-testid="public-match-card"]'))
    .find((card) => card.textContent?.includes(match.homeTeamName)
      && card.textContent.includes(match.awayTeamName));
}

describe("public matches", () => {
  let container: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    search = {};
    navigate.mockReset();
    container = document.createElement("div");
    document.body.appendChild(container);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    if (root) {
      act(() => root?.unmount());
      root = undefined;
    }
    container.remove();
  });

  function renderInteractive(status?: string) {
    search = status ? { status } : {};
    act(() => {
      root = createRoot(container);
      root.render(<MatchesPage />);
    });
  }

  /**
   * The previous version of this screen was an app-only master-detail browser with a status
   * summary block of four KPI cards, a scrollable calendar list of selectable rows and a
   * side detail panel. The design has none of those three regions
   * (frontend/design/html/voleytrack-partidos.html): it is a page head, a pill filter group
   * and a card grid of matches, so those structural assertions were replaced rather than
   * relaxed, and the selection/`aria-pressed` assertions below moved onto the filter pills
   * and the card links the design actually defines.
   */
  it("renders the design's page head, filter group and one card per fixture match", () => {
    renderInteractive();

    expect(container.querySelector("h1")?.textContent).toBe("Partidos");
    expect(container.textContent).toContain("Filtros, estados y acceso a detalle en vivo.");
    expect(container.querySelector('[role="group"][aria-label="Filtrar partidos por estado"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="matches-master-detail"]')).toBeNull();
    expect(container.querySelector('[data-testid="matches-status-summary"]')).toBeNull();
    expect(container.querySelectorAll('[data-testid="public-match-card"]')).toHaveLength(
      Object.values(PUBLIC_MATCHES).flat().length,
    );
    expect(container.querySelector('[data-testid="matches-grid"]')?.tagName.toLowerCase()).toBe("ul");
  });

  it("locks the design's responsive grid behind its own column counts and gap", () => {
    renderInteractive();

    const page = container.querySelector<HTMLElement>('[data-testid="matches-page-content"]');
    const grid = container.querySelector<HTMLElement>('[data-testid="matches-grid"]');

    expect(page?.className).toContain("max-w-[1104px]");
    expect(grid?.className).toContain("grid-cols-1");
    expect(grid?.className).toContain("min-[721px]:grid-cols-2");
    expect(grid?.className).toContain("min-[1201px]:grid-cols-3");
    expect(grid?.className).toContain("gap-4");
    expect(page?.innerHTML).not.toMatch(/\bxl:/);
  });

  it("keeps the filter group's pills as real buttons that publish their state", () => {
    renderInteractive("live");
    const group = container.querySelector<HTMLElement>('[aria-label="Filtrar partidos por estado"]');
    const pills = Array.from(group?.querySelectorAll<HTMLButtonElement>("button") ?? []);

    expect(pills.map((pill) => pill.textContent)).toEqual([
      "Todos",
      "En vivo",
      "Hoy",
      "Próximos",
      "Finalizados",
    ]);
    pills.forEach((pill) => expect(pill.getAttribute("aria-pressed")).toBeDefined());
    const active = pills.filter((pill) => pill.getAttribute("aria-pressed") === "true");
    expect(active).toHaveLength(1);
    expect(active[0]?.textContent).toBe("En vivo");
  });

  it("keeps the all/default result set reachable through the design's Todos pill", () => {
    renderInteractive("live");
    const group = container.querySelector<HTMLElement>('[aria-label="Filtrar partidos por estado"]');
    const pills = Array.from(group?.querySelectorAll<HTMLButtonElement>("button") ?? []);

    // The design's `.filter` pills are a single-choice window (voleytrack-partidos.html,
    // `selectMatchTime`), so the active pill stays selected and the reset is the first pill,
    // rather than the old summary cards' toggle-back-to-all behaviour.
    act(() => pills[0]?.click());

    expect(navigate).toHaveBeenCalledOnce();
    const navigation = navigate.mock.calls[0]?.[0] as {
      search: (current: Record<string, string>) => Record<string, string>;
      to: string;
    };

    expect(navigation.to).toBe(".");
    expect(navigation.search({ status: "live" })).toEqual({ status: "all" });
  });

  it("carries teams, competition, venue, time and a state pill on every card", () => {
    renderInteractive("live");
    const match = PUBLIC_MATCHES.live[0];
    const card = findCard(container, match);

    expect(card?.textContent).toContain(match.homeTeamName);
    expect(card?.textContent).toContain(match.awayTeamName);
    expect(card?.textContent).toContain(match.venue);
    expect(card?.textContent).toContain(match.scheduledLabel);
    expect(card?.textContent).toContain(
      PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === match.tournamentId)?.name ?? "",
    );
    expect(card?.querySelector("[data-status]")?.getAttribute("data-status")).toBe("envivo");
    expect(card?.textContent).toContain("Local");
    expect(card?.textContent).toContain("Visitante");
  });

  it("renders the design's state pill vocabulary for every fixture status", () => {
    renderInteractive();
    const pills = Array.from(container.querySelectorAll("[data-status]"))
      .map((pill) => pill.getAttribute("data-status"));

    // The design's set is programado / en vivo / finalizado, so the fixture's four statuses
    // collapse onto it: both scheduled states are "programado".
    expect(new Set(pills)).toEqual(new Set(["programado", "envivo", "finalizado"]));
    expect(pills).toHaveLength(Object.values(PUBLIC_MATCHES).flat().length);
  });

  it("links every card to its own live detail", () => {
    const html = renderMatches("upcoming");

    for (const match of PUBLIC_MATCHES.upcoming) {
      expect(html).toContain(`href="/matches/${match.id}/live"`);
    }
  });

  it("reports the design's result count for the active filter", () => {
    renderInteractive("upcoming");
    expect(container.querySelector('[data-testid="matches-results-count"]')?.textContent)
      .toBe(`${PUBLIC_MATCHES.upcoming.length} partidos`);

    act(() => root?.unmount());
    root = undefined;
    renderInteractive("finished");
    expect(container.querySelector('[data-testid="matches-results-count"]')?.textContent)
      .toBe(`${PUBLIC_MATCHES.finished.length} partido`);
  });

  it("shows the design's honest no-score em dash instead of a 0-0", () => {
    const html = renderMatches("upcoming");

    expect(html).toContain("—");
    expect(html).not.toContain("0 - 0");
    expect(html).not.toContain(">0:0<");
  });

  it.each([
    ["live", PUBLIC_MATCHES.live[0]],
    ["today", PUBLIC_MATCHES.today[0]],
    ["upcoming", PUBLIC_MATCHES.upcoming[0]],
    ["finished", PUBLIC_MATCHES.finished[0]],
  ] as const)("initializes the %s deep link with its own card and route", (status, match) => {
    const html = renderMatches(status);

    expect(html).toContain(match.homeTeamName);
    expect(html).toContain(match.awayTeamName);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain(`href="/matches/${match.id}/live"`);
  });

  // The design's `.match-empty` region ("No hay partidos que coincidan") is rendered by this
  // screen but is not reachable through the fixture set: every filter value resolves to at
  // least one match, and the app-wide `state=empty` override replaces the whole screen
  // before that branch runs. It stays implemented for the fixtures the screen will grow,
  // and the override is asserted below.
  it("renders the explicit empty state override without match content", () => {
    search = { state: "empty" };
    const html = renderToStaticMarkup(<MatchesPage />);

    expect(html).toContain("No hay resultados");
    expect(html).not.toContain('data-testid="matches-grid"');
  });
});
