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
  Link: ({ children, to, ...props }: { children: ReactNode; to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} href={to}>{children}</a>
  ),
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

function renderMatches(status?: string) {
  search = status ? { status } : {};
  return renderToStaticMarkup(<MatchesPage />);
}

function findRow(container: HTMLElement, match: MatchFixture) {
  return Array.from(container.querySelectorAll<HTMLButtonElement>('[data-testid="public-match-row"]'))
    .find((button) => button.textContent?.includes(match.homeTeamName)
      && button.textContent.includes(match.awayTeamName));
}

function selectedDetail(container: HTMLElement) {
  return container.querySelector<HTMLElement>('[aria-label="Detalle del partido seleccionado"]');
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

  function rerenderInteractive(status?: string) {
    search = status ? { status } : {};
    act(() => root?.render(<MatchesPage />));
  }

  it("renders only the canonical status controls and master-detail hierarchy", () => {
    renderInteractive();

    expect(container.querySelector("h1")).toBeNull();
    expect(container.querySelector('[aria-label="Filtrar partidos por estado"]')).toBeNull();
    expect(container.textContent).not.toContain("Explorá partidos en vivo, próximos encuentros y resultados finalizados.");
    expect(container.querySelector('[data-testid="matches-master-detail"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Calendario de partidos"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Detalle del partido seleccionado"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-testid="public-match-row"]')).toHaveLength(
      Object.values(PUBLIC_MATCHES).flat().length,
    );
  });

  it("locks canonical desktop geometry behind the safe 1416px breakpoint", () => {
    renderInteractive();

    const page = container.querySelector<HTMLElement>('[data-testid="matches-page-content"]');
    const summary = container.querySelector<HTMLElement>('[data-testid="matches-status-summary"]');
    const summaryCards = summary?.querySelectorAll<HTMLElement>("button");
    const masterDetail = container.querySelector<HTMLElement>('[data-testid="matches-master-detail"]');
    const matchList = container.querySelector<HTMLElement>('[data-testid="matches-list"]');

    expect(page?.className).toContain("max-w-[1104px]");
    expect(page?.className).toContain("min-[1416px]:ml-1");
    expect(page?.className).toContain("min-[1416px]:mt-2");
    expect(summary?.className).toContain("sm:grid-cols-2");
    expect(summary?.className).toContain("min-[1416px]:grid-cols-[repeat(4,258px)]");
    expect(summary?.className).toContain("gap-6");
    expect(summaryCards).toHaveLength(4);
    summaryCards?.forEach((card) => expect(card.className).toContain("h-[86px]"));
    expect(masterDetail?.className).toContain("mt-10");
    expect(masterDetail?.className).toContain("min-[1416px]:grid-cols-[736px_340px]");
    expect(masterDetail?.className).toContain("min-[1416px]:gap-7");
    expect(matchList?.className).toContain("min-[1416px]:max-h-[482px]");
    expect(page?.innerHTML).not.toMatch(/\bxl:/);
  });

  it("keeps the all/default result set reachable through the active summary control", () => {
    renderInteractive("live");
    const activeFilter = container.querySelector<HTMLButtonElement>(
      '[data-testid="matches-status-summary"] button[aria-pressed="true"]',
    );

    act(() => activeFilter?.click());

    expect(navigate).toHaveBeenCalledOnce();
    const navigation = navigate.mock.calls[0]?.[0] as {
      search: (current: Record<string, string>) => Record<string, string>;
      to: string;
    };
    expect(navigation.to).toBe(".");
    expect(navigation.search({ status: "live" })).toEqual({ status: "all" });
  });

  it("exposes complete scannable rows and updates selected state and detail from native buttons", () => {
    renderInteractive("live");
    const firstMatch = PUBLIC_MATCHES.live[0];
    const nextMatch = PUBLIC_MATCHES.live[1];
    const firstRow = findRow(container, firstMatch);
    const nextRow = findRow(container, nextMatch);

    expect(firstRow?.getAttribute("aria-pressed")).toBe("true");
    expect(nextRow?.getAttribute("aria-pressed")).toBe("false");
    expect(firstRow?.textContent).toContain(firstMatch.badgeLabel);
    expect(firstRow?.textContent).toContain(firstMatch.scheduledLabel);
    expect(firstRow?.textContent).toContain(`${firstMatch.score?.home} - ${firstMatch.score?.away}`);

    act(() => nextRow?.click());

    expect(firstRow?.getAttribute("aria-pressed")).toBe("false");
    expect(nextRow?.getAttribute("aria-pressed")).toBe("true");
    expect(selectedDetail(container)?.textContent).toContain(nextMatch.homeTeamName);
    expect(selectedDetail(container)?.textContent).toContain(nextMatch.awayTeamName);
  });

  it("resets selection to the first valid row whenever the status filter changes", () => {
    renderInteractive("live");
    const secondLiveMatch = PUBLIC_MATCHES.live[1];
    const secondLiveRow = findRow(container, secondLiveMatch);

    act(() => secondLiveRow?.click());
    expect(secondLiveRow?.getAttribute("aria-pressed")).toBe("true");

    rerenderInteractive("upcoming");
    const firstUpcomingMatch = PUBLIC_MATCHES.upcoming[0];
    expect(findRow(container, firstUpcomingMatch)?.getAttribute("aria-pressed")).toBe("true");
    expect(selectedDetail(container)?.textContent).toContain(firstUpcomingMatch.homeTeamName);

    rerenderInteractive("live");
    expect(findRow(container, PUBLIC_MATCHES.live[0])?.getAttribute("aria-pressed")).toBe("true");
    expect(findRow(container, secondLiveMatch)?.getAttribute("aria-pressed")).toBe("false");
  });

  it("shows selected metadata and honest no-score copy for upcoming matches", () => {
    const match = PUBLIC_MATCHES.upcoming[0];
    const tournament = PUBLIC_TOURNAMENTS.all.find((item) => item.id === match.tournamentId);
    const html = renderMatches("upcoming");

    expect(html).toContain(tournament?.name);
    expect(html).toContain(match.venue);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain(match.badgeLabel);
    expect(html).toContain("Marcador aún no disponible");
    expect(html).not.toContain("0 - 0");
  });

  it.each([
    ["live", PUBLIC_MATCHES.live[0]],
    ["today", PUBLIC_MATCHES.today[0]],
    ["upcoming", PUBLIC_MATCHES.upcoming[0]],
    ["finished", PUBLIC_MATCHES.finished[0]],
  ] as const)("initializes the %s deep link with a valid detail route", (status, match) => {
    const html = renderMatches(status);

    expect(html).toContain(match.homeTeamName);
    expect(html).toContain(match.awayTeamName);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain(`href="/matches/${match.id}/live"`);
  });

  it("updates the canonical live-detail action with the selected fixture", () => {
    renderInteractive("live");
    const match = PUBLIC_MATCHES.live[1];

    act(() => findRow(container, match)?.click());

    expect(selectedDetail(container)?.querySelector("a")?.getAttribute("href"))
      .toBe(`/matches/${match.id}/live`);
  });

  it("renders the explicit empty state override without match content", () => {
    search = { state: "empty" };
    const html = renderToStaticMarkup(<MatchesPage />);

    expect(html).toContain("No hay resultados");
    expect(html).not.toContain("Calendario de partidos");
  });
});
