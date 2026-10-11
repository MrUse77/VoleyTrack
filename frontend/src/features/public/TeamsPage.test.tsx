import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamsPage } from "./TeamsPage";

let search: Record<string, unknown> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ search }),
  useNavigate: () => () => {},
}));

function renderTeams(next: Record<string, unknown> = {}) {
  search = next;
  return renderToStaticMarkup(<TeamsPage />);
}

describe("public teams list", () => {
  it("renders the design's table with column-header semantics and a linked team cell", () => {
    const html = renderTeams();

    expect(html).toContain('data-testid="teams-page-content"');
    expect(html).toContain("<table");
    expect(html.match(/scope="col"/g)).toHaveLength(4);
    for (const heading of ["Equipo", "Torneo", "Jugadores", "PG / PP"]) {
      expect(html).toContain(heading);
    }
    // Design: voleytrack-equipos.html marks the `PG / PP` column `.num`.
    expect(html).toContain("font-mono tabular-nums text-right");

    for (const team of PUBLIC_TEAMS) {
      expect(html).toContain(team.name);
      expect(html).toContain(`href="/teams/${team.id}"`);
    }

    // A team's own detail projection wins; the league standings supply the rest.
    expect(html).toContain("Liga A1 Masculina");
    expect(html).toContain("5 / 1");
    expect(html).toContain("4 / 2");
  });

  it("reports the filtered result count with the design's own footer copy", () => {
    expect(renderTeams()).toMatch(
      /data-testid="teams-results-count"><strong[^>]*>8<\/strong> equipos/,
    );
    expect(renderTeams({ torneo: "Liga A1 Masculina" })).toMatch(
      /data-testid="teams-results-count"><strong[^>]*>1<\/strong> equipo</,
    );
  });

  it("filters by the tournament a team's detail projection records", () => {
    const html = renderTeams({ torneo: "Liga A1 Masculina" });

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("River Plate");
    expect(html).not.toContain("Ciudad Voley");
  });

  it("renders the design's empty state when a filter matches no team", () => {
    const html = renderTeams({ torneo: "Copa Nacional" });

    expect(html).toContain("No hay equipos que coincidan");
    expect(html).toContain("Prueba a reducir los filtros o límpialos para ver todos los equipos.");
    expect(html).toContain('role="status"');
    expect(html).not.toContain("<table");
  });
});
