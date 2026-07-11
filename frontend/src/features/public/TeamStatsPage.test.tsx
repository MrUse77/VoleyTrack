import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamStatsPage } from "./TeamStatsPage";

let teamId = PUBLIC_TEAMS[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: teamId }),
}));

function renderStats(id = PUBLIC_TEAMS[0].id) {
  teamId = id;
  return renderToStaticMarkup(<TeamStatsPage />);
}

describe("public team stats", () => {
  beforeEach(() => {
    teamId = PUBLIC_TEAMS[0].id;
  });

  it("renders selected team context and statistics", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderStats(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain(team.city);
    expect(html).toContain(team.category);
    expect(html).toContain("Estadísticas del equipo");
    for (const label of ["Partidos jugados", "Victorias", "Derrotas", "Sets ganados", "Sets perdidos", "Puntos a favor"]) {
      expect(html).toContain(label);
    }
  });

  it("renders local tabs with Estadísticas active and links", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderStats(team.id);
    expect(html).toContain(`href="/teams/${team.id}"`);
    expect(html).toContain(`href="/teams/${team.id}/roster"`);
    expect(html).toContain(`href="/teams/${team.id}/matches"`);
    expect(html).toContain(`href="/teams/${team.id}/stats"`);
    expect(html).toContain(`href="/teams/${team.id}/stats" aria-current="page"`);
  });

  it("handles an unknown team", () => {
    const html = renderStats("missing-team");
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });

  it("renders an alternate team without the first team context", () => {
    const team = PUBLIC_TEAMS[1];
    const html = renderStats(team.id);
    expect(html).toContain(team.name);
    expect(html).not.toContain(PUBLIC_TEAMS[0].name);
  });
});
