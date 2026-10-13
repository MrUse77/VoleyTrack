import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamStatsPage } from "./TeamStatsPage";

const riverPlate = PUBLIC_TEAMS.find((team) => team.id === "river-plate")!;
let teamId = riverPlate.id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ search: {} }),
  useParams: () => ({ id: teamId }),
}));

function renderStats(id = riverPlate.id) {
  teamId = id;
  return renderToStaticMarkup(<TeamStatsPage />);
}

function expectSharedTeamJourney(html: string) {
  expect(html).toContain('data-testid="team-hero"');
  expect(html).toContain('data-testid="team-hero-metrics"');
  expect(html).toContain('data-testid="team-tabs"');
  expect(html).toContain("min-[1416px]:-mt-1");
  expect(html).toContain("min-[1416px]:h-[150px]");
  expect(html).toContain("min-[1416px]:grid-cols-[repeat(3,116px)]");
  expect(html).toContain("min-[1416px]:gap-6");
  expect(html).toContain("px-3 py-2");
  expect(html).toContain("gap-3");
  expect(html).toContain("River Plate");
  expect(html).toContain("RP");
  expect(html).toContain("1° PUESTO");
  expect(html).toContain("Liga A1 Masculina · 6 partidos jugados · 16 puntos");
  for (const suffix of ["", "/roster", "/matches", "/stats"]) {
    expect(html).toContain(`href="/teams/${riverPlate.id}${suffix}"`);
  }
  expect(html.match(/aria-current="page"/g)).toHaveLength(1);
  expect(html).toContain(`href="/teams/${riverPlate.id}/stats" aria-current="page"`);
}

describe("public team stats", () => {
  beforeEach(() => {
    teamId = riverPlate.id;
  });

  it("keeps the shared identity and Estadísticas route semantics", () => {
    const html = renderStats();
    expectSharedTeamJourney(html);
  });

  it("renders the canonical category hierarchy and accessible points leaderboard", () => {
    const html = renderStats();

    expect(html).toContain("Estadísticas del Equipo");
    expect(html).toContain('data-testid="team-stats-filter"');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-labelledby="team-stats-filter-label"');
    expect(html).toContain('id="team-stats-filter-label"');
    expect(html).toContain("Filtrar estadística");
    for (const category of ["Puntos", "Ataques", "Bloqueos", "Saques"]) {
      expect(html).toContain(category);
    }
    expect(html).toContain('aria-current="true"');
    expect(html).not.toContain('href="#');
    expect(html).toContain("min-[1416px]:h-[58px]");
    expect(html).toContain("min-[1416px]:w-[178px]");
    expect(html).toContain("min-[1416px]:gap-3");
    expect(html).not.toContain("min-[1416px]:gap-0");
    expect(html).toContain("Ranking de Jugadores · Puntos Totales");
    expect(html).toContain("Total del torneo");
    expect(html).toContain('data-testid="team-stats-leaderboard"');
    expect(html).toContain("<ol");
    expect(html).toContain("space-y-5");
    expect(html).toContain("ml-9 inline-block w-[300px] shrink-0");
    expect((html.match(/min-\[1416px\]:h-\[72px\]/g) ?? [])).toHaveLength(5);
    expect(html.indexOf('data-testid="team-stats-filter"')).toBeLessThan(html.indexOf('data-testid="team-stats-leaderboard"'));

    const leaders = [
      ["mateo-silva", "Mateo Silva", "128 pts"],
      ["ivan-molina", "Iván Molina", "74 pts"],
      ["santiago-lopez", "Santiago López", "42 pts"],
      ["facundo-rios", "Facundo Ríos", "39 pts"],
      ["nicolas-vera", "Nicolás Vera", "0 pts"],
    ] as const;
    leaders.forEach(([id, name, value], index) => {
      expect(html).toContain(`data-player-id="${id}"`);
      expect(html).not.toContain(`href="/players/${id}"`);
      expect(html).toContain(name);
      expect(html).toContain(value);
      expect(html).toContain(`>${index + 1}</`);
    });
  });

  it("omits the noncanonical leader-card breakdown between filters and points ranking", () => {
    const html = renderStats();
    expect(html).not.toContain("Líder en puntos");
    expect(html).not.toContain("Líder en ataques");
    expect(html).not.toContain("Líder en bloqueos");
    expect(html).not.toContain("Líder en saques");
    expect(html).not.toContain('id="team-stat-breakdown-title"');
  });

  it("locks the canonical stats geometry behind the safe shell-aware breakpoint", () => {
    const html = renderStats();
    expect(html).toContain("max-w-[1104px]");
    expect(html).toContain("min-[1428px]:ml-1");
    expect(html).not.toContain("min-[1416px]:ml-1");
    expect(html).toContain("min-[1416px]:h-[534px]");
    expect(html).not.toContain("min-[1416px]:min-h-[534px]");
    expect(html).not.toMatch(/\bxl:/);
  });

  it("renders an honest stats fallback for a known team without a detail projection", () => {
    const team = PUBLIC_TEAMS.find((item) => item.id === "boca-juniors")!;
    const html = renderStats(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain("No hay estadísticas registradas para este equipo.");
    expect(html).not.toContain("Mateo Silva");
  });

  it("renders the stable unknown-team route fallback", () => {
    const html = renderStats("missing-team");
    expect(html).toContain('data-testid="team-not-found"');
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });
});
