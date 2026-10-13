// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../fixtures";
import { PlanilleroPage } from "./PlanilleroPage";

/**
 * The store the screen filters. It is read through a getter so a single test can present an empty
 * admin store without re-importing the fixtures module, which is the same shape
 * `AdminTournamentMatchesPage.test.tsx` uses for its empty tournament.
 */
const store = vi.hoisted(() => ({ empty: false }));
const location = vi.hoisted(() => ({ search: {} as Record<string, unknown> }));

vi.mock("../fixtures", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../fixtures")>();

  return {
    ...actual,
    ADMIN: {
      ...actual.ADMIN,
      get matches() {
        return store.empty ? [] : actual.ADMIN.matches;
      },
    },
  };
});

vi.mock("@tanstack/react-router", () => ({
  // The page's match rows are links, so the mock has to answer the `search` object the
  // reconciliation puts in the URL. The default click is cancelled so jsdom does not attempt a real
  // navigation for the href; the page drives the view through the location it reads.
  Link: ({
    activeOptions: _exactMarking,
    children,
    search,
    to,
    ...props
  }: {
    activeOptions?: unknown;
    children?: ReactNode;
    search?: Record<string, unknown>;
    to: string;
  } & ComponentPropsWithoutRef<"a">) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    const query = new URLSearchParams(
      Object.entries(search ?? {}).map(([key, value]) => [key, String(value)]),
    ).toString();

    return (
      <a {...props} href={query ? `${to}?${query}` : to} onClick={(event) => event.preventDefault()}>
        {children}
      </a>
    );
  },
  useLocation: () => ({ search: location.search }),
}));

const assignedMatches = ADMIN.matches.filter((match) => match.status === "upcoming");

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<PlanilleroPage />));
  return { container, root };
}

describe("PlanilleroPage", () => {
  beforeEach(() => {
    store.empty = false;
    location.search = {};
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("renders the design's assigned matches as a real list of match links", () => {
    const rendered = renderPage();

    try {
      const { container } = rendered;

      // Design: voleytrack-planillero.html:19-20 — the `.page-head` copy.
      expect(container.textContent).toContain("Partidos asignados");
      expect(container.textContent).toContain(
        "Selecciona un partido programado para preparar la planilla.",
      );

      // Design: `#assigned-matches` is a `.match-list` of `.match-card.match-select` entries
      // (voleytrack-admin.css:197-212). The design renders each row's title inside the clickable
      // element; the page keeps that with a link, which is the element that can carry the href.
      const list = container.querySelector('ul[aria-label="Partidos asignados"]');
      expect(list).not.toBeNull();
      expect(list?.querySelectorAll(":scope > li")).toHaveLength(assignedMatches.length);
      expect(assignedMatches.length).toBeGreaterThan(0);

      for (const match of assignedMatches) {
        const link = container.querySelector(`a[data-match-id="${match.id}"]`);
        expect(link).not.toBeNull();
        expect(link?.getAttribute("href")).toBe(`/planillero?partido=${match.id}`);
        expect(link?.querySelector("h2")?.textContent).toBe(
          `${match.homeTeamName} vs ${match.awayTeamName}`,
        );
        expect(link?.textContent).toContain(`${match.tournamentName} · ${match.scheduledLabel}`);
        // Design: `.state-pill.s-programado` — the status word is text, never colour alone.
        expect(link?.querySelector('[data-status="programado"]')).not.toBeNull();
        expect(link?.textContent).toContain("Estado: Programado");
      }

      // The live match is not assigned work, so it is not in the list. Its teams are not a safe
      // marker: the live fixture's home team also plays an assigned match as the away team, so the
      // absence is pinned on its id and its own schedule label.
      expect(container.textContent).not.toContain(ADMIN.matches[0].id);
      expect(container.textContent).not.toContain(ADMIN.matches[0].scheduledLabel);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("swaps the list for the design's empty state when nothing is programmed", () => {
    store.empty = true;
    const html = renderToStaticMarkup(<PlanilleroPage />);

    // Design: `#assigned-empty` is a `.card.empty-state` with `role="status"` and this copy
    // (voleytrack-planillero.html:22).
    expect(html).toContain("No hay partidos creados");
    expect(html).toContain("Los partidos programados por administración aparecerán aquí.");
    expect(html).toContain('role="status"');
    expect(html).not.toContain('aria-label="Partidos asignados"');
    expect(html).not.toContain("<ul");
  });

  it("renders the setup view's regions for the selected match", () => {
    const match = assignedMatches[0];
    location.search = { partido: match.id };
    const rendered = renderPage();

    try {
      const { container } = rendered;

      // Design: `#setup-view`'s `.page-head` (voleytrack-planillero.html:25) — a `.match-source`
      // eyebrow, the "Setup" heading, the `Torneo · fecha` meta and the "Volver a partidos" action.
      expect(container.textContent).toContain("Preparación del partido");
      expect(container.textContent).toContain("Setup");
      expect(container.textContent).toContain(`${match.tournamentName} · ${match.scheduledLabel}`);
      expect(container.querySelector('a[href="/planillero"]')?.textContent).toContain(
        "Volver a partidos",
      );

      // Design: the `.card-h` reads "Partido seleccionado" over the `Estado: Programado` eyebrow,
      // which is how the selected state is exposed in words instead of by colour.
      expect(container.textContent).toContain("Partido seleccionado");
      expect(container.textContent).toContain("Estado: Programado");

      // Design: `.setup-grid` with two `.setup-team` blocks around the `.setup-versus` separator.
      const teams = container.querySelectorAll('[data-testid="planillero-setup-team"]');
      expect(teams).toHaveLength(2);
      expect(teams[0]?.textContent).toBe(match.homeTeamName);
      expect(teams[1]?.textContent).toBe(match.awayTeamName);
      expect(container.querySelector('[data-testid="planillero-setup-versus"]')?.textContent).toBe(
        "contra",
      );

      // Design: the `.form-actions` row's accent control. The design writes the match's status and
      // opens the live screen; the app's store is immutable, so it links to the planillero's live
      // surface for the selected match.
      expect(
        container.querySelector('[data-testid="planillero-start-match"]')?.getAttribute("href"),
      ).toBe(`/admin/matches/${match.id}/scoring`);

      // The list is not also rendered: the design hides `#assigned-view` while `#setup-view` shows.
      expect(container.textContent).not.toContain("Partidos asignados");
      expect(container.querySelector('ul[aria-label="Partidos asignados"]')).toBeNull();
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("moves focus to the setup heading the design declares as its focus target", () => {
    const match = assignedMatches[0];
    location.search = { partido: match.id };
    const rendered = renderPage();

    try {
      const heading = rendered.container.querySelector("h1");

      // Design: voleytrack-planillero.html:25 gives this h1 `tabindex="-1"` and its script calls
      // `.focus()` on it when the setup view opens, so the move is announced rather than silent.
      expect(heading?.textContent).toBe("Setup");
      expect(heading?.getAttribute("tabindex")).toBe("-1");
      expect(document.activeElement).toBe(heading);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("returns focus to the match that was open when going back to the list", () => {
    const match = assignedMatches[1];
    location.search = { partido: match.id };
    const rendered = renderPage();

    try {
      const { container, root } = rendered;
      expect(document.activeElement).toBe(container.querySelector("h1"));

      // Going back is the "Volver a partidos" href, i.e. the same route without the selection.
      location.search = {};
      act(() => root.render(<PlanilleroPage />));

      // The design returns focus to the list; this returns it to the row that was open, so the
      // selection is exposed by focus instead of by a colour-only treatment the design has none of.
      expect(document.activeElement).toBe(
        container.querySelector(`a[data-match-id="${match.id}"]`),
      );
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("keeps the first mount's focus untouched and moves it to the first row only after a return", () => {
    const rendered = renderPage();

    try {
      const { container, root } = rendered;

      // A direct visit never steals focus.
      expect(document.activeElement).not.toBe(container.querySelector("a[data-match-id]"));

      location.search = { partido: assignedMatches[0].id };
      act(() => root.render(<PlanilleroPage />));
      location.search = {};
      act(() => root.render(<PlanilleroPage />));

      expect(document.activeElement).toBe(container.querySelector("a[data-match-id]"));
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("falls back to the list for a match id the assigned set does not hold", () => {
    location.search = { partido: "match-que-no-existe" };
    const rendered = renderPage();

    try {
      expect(rendered.container.textContent).toContain("Partidos asignados");
      expect(rendered.container.querySelector('ul[aria-label="Partidos asignados"]')).not.toBeNull();
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
