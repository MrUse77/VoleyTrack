import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentsPage } from "./TournamentsPage";

let search: Record<string, string> = {};
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-label"?: string }) => (
    <a aria-label={props["aria-label"]} href={to}>{children}</a>
  ),
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

function renderTournaments(filters: { status?: string; type?: string } = {}) {
  search = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined),
  ) as Record<string, string>;
  return renderToStaticMarkup(<TournamentsPage />);
}

describe("public tournaments", () => {
  beforeEach(() => {
    search = {};
    navigate.mockReset();
  });

  /**
   * The previous version of this screen opened with four status KPI cards, a `TabBar` of
   * controlled status tabs and a flat list of cards. The design has none of the first two:
   * it is a page head, a filter panel whose two dimensions are "Tipo" and "Etapa", and a
   * `.cards-grid` of clickable tournament cards carrying a mono eyebrow, a title, a muted
   * detail line and badges (frontend/design/html/voleytrack-torneos.html). Those assertions
   * were replaced rather than relaxed.
   */
  it("renders the design's page head, both filter dimensions and the card grid", () => {
    const html = renderTournaments();

    expect(html).toContain("Torneos");
    expect(html).toContain("Explorá torneos activos, posiciones, próximos partidos y resultados recientes.");
    expect(html).toContain('aria-label="Filtrar torneos por tipo"');
    expect(html).toContain('aria-label="Filtrar torneos por etapa"');
    expect(html.match(/role="group"/g)).toHaveLength(2);
    expect(html).toContain('data-testid="tournaments-grid"');
    expect(html).toContain('aria-pressed="true"');
    for (const tournament of PUBLIC_TOURNAMENTS.all) {
      expect(html).toContain(tournament.name);
      expect(html).toContain(tournament.dateLabel);
      expect(html).toContain(tournament.typeLabel);
      expect(html).toContain(tournament.location);
    }
  });

  it("locks the design's responsive grid behind its own column counts and gap", () => {
    const html = renderTournaments();

    expect(html).toContain("min-[721px]:grid-cols-2");
    expect(html).toContain("min-[1201px]:grid-cols-3");
    expect(html).toContain("gap-4");
    expect(html).toContain("max-w-[1104px]");
  });

  it("keeps both filter groups as real buttons that publish their state", () => {
    const html = renderTournaments({ status: "en-curso", type: "copa" });
    const typeGroup = html.slice(
      html.indexOf('aria-label="Filtrar torneos por tipo"'),
      html.indexOf('aria-label="Filtrar torneos por etapa"'),
    );
    const stageGroup = html.slice(html.indexOf('aria-label="Filtrar torneos por etapa"'));

    for (const label of ["Todos", "Liga", "Copa"]) {
      expect(typeGroup).toContain(label);
    }
    for (const label of ["Todas", "En curso", "Próximos", "Finalizados"]) {
      expect(stageGroup).toContain(label);
    }
    expect(typeGroup.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(stageGroup.match(/aria-pressed="true"/g)).toHaveLength(1);
  });

  it("renders the explicit loading state override without tournament content", () => {
    search = { state: "loading" };
    const html = renderToStaticMarkup(<TournamentsPage />);

    expect(html).toContain("Cargando contenido");
    expect(html).not.toContain('data-testid="tournaments-grid"');
  });

  it("links fixture-driven tournament cards to their canonical detail routes", () => {
    const html = renderTournaments();

    expect(html).toContain(`href="/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}"`);
    expect(html).toContain(`href="/tournaments/${PUBLIC_TOURNAMENTS.finished[0].id}"`);
    expect(html).toContain(`aria-label="Ver detalle de ${PUBLIC_TOURNAMENTS.all[0].name}"`);
  });

  it.each([
    ["todos", PUBLIC_TOURNAMENTS.all],
    ["en-curso", PUBLIC_TOURNAMENTS.inProgress],
    ["proximos", PUBLIC_TOURNAMENTS.upcoming],
    ["finalizados", PUBLIC_TOURNAMENTS.finished],
  ] as const)("initializes the %s stage from its status query", (status, tournaments) => {
    const html = renderTournaments({ status });

    for (const tournament of tournaments) {
      expect(html).toContain(tournament.name);
      expect(html).toContain(tournament.statusLabel);
    }
    expect(html).toContain(
      `<strong class="text-vt-text">${tournaments.length}</strong>`,
    );
  });

  it("filters the grid by the design's type dimension", () => {
    const ligas = renderTournaments({ type: "liga" });

    expect(ligas).toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);
    expect(ligas).not.toContain(PUBLIC_TOURNAMENTS.upcoming[0].name);

    const copas = renderTournaments({ type: "copa" });

    expect(copas).toContain(PUBLIC_TOURNAMENTS.upcoming[0].name);
    expect(copas).not.toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);
  });

  it("returns to the main artboard on a fresh render without a status query", () => {
    renderTournaments({ status: "en-curso" });
    const html = renderTournaments();

    expect(html).toContain(PUBLIC_TOURNAMENTS.upcoming[0].name);
    expect(html).toContain(PUBLIC_TOURNAMENTS.finished[0].name);
  });
});
