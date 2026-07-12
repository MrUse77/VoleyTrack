import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentsPage } from "./TournamentsPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useLocation: () => ({ search }),
}));

function renderTournaments(status?: string) {
  search = status ? { status } : {};
  return renderToStaticMarkup(<TournamentsPage />);
}

describe("public tournaments", () => {
  beforeEach(() => {
    search = {};
  });

  it("renders the main artboard with all fixture statuses and controlled status tabs", () => {
    const html = renderTournaments();

    expect(html).toContain("Torneos");
    expect(html).toContain("Explorá torneos activos, posiciones, próximos partidos y resultados recientes.");
    expect(html).toContain("Torneos destacados");
    for (const tournament of PUBLIC_TOURNAMENTS.all) {
      expect(html).toContain(tournament.name);
      expect(html).toContain(tournament.dateLabel);
    }
    expect(html).toContain('aria-label="Filtrar torneos por estado"');
    expect(html).toContain('aria-selected="true"');
  });

  it("renders the explicit loading state override without tournament content", () => {
    search = { state: "loading" };
    const html = renderToStaticMarkup(<TournamentsPage />);

    expect(html).toContain("Cargando contenido");
    expect(html).not.toContain("Lista de torneos");
  });

  it("links fixture-driven tournament cards to their canonical detail routes", () => {
    const html = renderTournaments();

    expect(html).toContain(`href="/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}"`);
    expect(html).toContain(`href="/tournaments/${PUBLIC_TOURNAMENTS.finished[0].id}"`);
  });

  it.each([
    ["todos", PUBLIC_TOURNAMENTS.all],
    ["en-curso", PUBLIC_TOURNAMENTS.inProgress],
    ["proximos", PUBLIC_TOURNAMENTS.upcoming],
    ["finalizados", PUBLIC_TOURNAMENTS.finished],
  ] as const)("initializes the %s artboard from its status query", (status, tournaments) => {
    const html = renderTournaments(status);

    for (const tournament of tournaments) {
      expect(html).toContain(tournament.name);
      expect(html).toContain(tournament.statusLabel);
    }
    expect(html).toContain('aria-selected="true"');
  });

  it("returns to the main artboard on a fresh render without a status query", () => {
    renderTournaments("en-curso");
    const html = renderTournaments();

    expect(html).toContain(PUBLIC_TOURNAMENTS.upcoming[0].name);
    expect(html).toContain(PUBLIC_TOURNAMENTS.finished[0].name);
  });
});
