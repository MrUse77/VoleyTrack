import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamDetailPage } from "./TeamDetailPage";

const riverPlate = PUBLIC_TEAMS.find((team) => team.id === "river-plate")!;
let teamId = riverPlate.id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ search: {} }),
  useParams: () => ({ id: teamId }),
}));

function renderTeamDetail(id = riverPlate.id) {
  teamId = id;
  return renderToStaticMarkup(<TeamDetailPage />);
}

function expectSharedTeamJourney(html: string, activeHref: string) {
  expect(html).toContain('data-testid="team-journey-content"');
  expect(html).toContain('data-testid="team-hero"');
  expect(html).toContain('data-testid="team-hero-metrics"');
  expect(html).toContain('data-testid="team-tabs"');
  expect(html).toContain("min-[1416px]:-mt-1");
  expect(html).toContain("min-[1416px]:h-[150px]");
  expect(html).toContain("min-[1416px]:left-[612px]");
  expect(html).toContain("min-[1416px]:grid-cols-[repeat(3,116px)]");
  expect(html).toContain("min-[1416px]:gap-6");
  expect(html).toContain("px-3 py-2");
  expect(html).toContain("gap-3");
  expect(html).toContain("River Plate");
  expect(html).toContain("RP");
  expect(html).toContain("1° PUESTO");
  expect(html).toContain("Liga A1 Masculina · 6 partidos jugados · 16 puntos");
  expect(html).toContain("GANADOS");
  expect(html).toContain("16-6");
  expect(html).toContain('aria-label="Navegación del equipo"');
  for (const suffix of ["", "/roster", "/matches", "/stats"]) {
    expect(html).toContain(`href="/teams/${riverPlate.id}${suffix}"`);
  }
  expect(html.match(/aria-current="page"/g)).toHaveLength(1);
  expect(html).toContain(`href="${activeHref}" aria-current="page"`);
}

describe("public team detail", () => {
  beforeEach(() => {
    teamId = riverPlate.id;
  });

  it("renders the canonical shared identity, summary tab, and safe desktop geometry", () => {
    const html = renderTeamDetail();

    expectSharedTeamJourney(html, `/teams/${riverPlate.id}`);
    expect(html).toContain("max-w-[1104px]");
    expect(html).toContain("min-[1428px]:ml-1");
    expect(html).not.toContain("min-[1416px]:ml-1");
    expect(html).toContain("min-[1416px]:grid-cols-[536px_540px]");
    expect(html).toContain("min-[1416px]:translate-x-2");
    expect(html).toContain("min-[1416px]:gap-7");
    expect(html).not.toMatch(/\bxl:/);
  });

  it("restores the canonical overview hierarchy and represented values", () => {
    const html = renderTeamDetail();

    expect(html).toContain('aria-label="Estadísticas del equipo"');
    expect(html).toContain('data-testid="team-overview-stats"');
    expect(html).toContain("min-[1416px]:h-[246px]");
    expect(html).toContain("min-[1416px]:grid-cols-[232px_232px]");
    expect(html).toContain("min-[1416px]:gap-x-7");
    expect(html).toContain("min-[1416px]:gap-y-5");
    expect(html).not.toContain("Ver desglose");
    expect(html).toContain("PUNTOS A FAVOR");
    expect(html).toContain("482");
    expect(html).toContain("PUNTOS EN CONTRA");
    expect(html).toContain("421");
    expect(html).toContain("ATAQUES PUNTO");
    expect(html).toContain("248");
    expect(html).toContain("BLOQUEOS PUNTO");
    expect(html).toContain("62");

    expect(html).toContain('aria-label="Vista previa del plantel"');
    expect(html).toContain('data-testid="team-overview-roster"');
    expect(html).toContain("min-[1416px]:h-[512px]");
    expect(html).toContain('data-testid="team-overview-roster-columns"');
    for (const width of ["w-[270px]", "w-[60px]", "w-[42px]"]) expect(html).toContain(width);
    expect(html).toContain("Plantel y Estadísticas");
    expect(html).not.toContain("Plantel completo");
    expect(html).toContain("Mateo Silva");
    expect(html).toContain('data-player-id="mateo-silva"');
    expect(html).not.toContain('href="/players/mateo-silva"');
    expect(html).toContain("128");
    expect(html).toContain("76");
    expect(html).toContain("18");
    expect(html).toContain("16");

    expect(html).toContain('aria-label="Últimos partidos"');
    expect(html).toContain('data-testid="team-overview-recent-matches"');
    expect(html).toContain("min-[1416px]:h-[242px]");
    expect(html).not.toContain("Ver todos");
    expect((html.match(/data-testid="team-overview-roster-row"/g) ?? [])).toHaveLength(5);
    expect(html).toContain("River Plate vs Boca Juniors");
    expect(html).toContain("21 - 18");
    expect(html).toContain("River Plate vs Ciudad Voley");
    expect(html).toContain("3 - 1");
    expect(html).toContain('href="/matches/match-liga-a1-river-boca/live"');
  });

  it("keeps an honest overview when a known team has no canonical stats projection", () => {
    const team = PUBLIC_TEAMS.find((item) => item.id === "boca-juniors")!;
    const html = renderTeamDetail(team.id);

    expect(html).toContain(team.name);
    expect(html).toContain("Estadísticas no disponibles para este equipo.");
    expect(html).toContain("No hay jugadores registrados para este equipo.");
    expect(html).toContain("Boca Juniors vs Monteros");
    expect(html).not.toContain("Mateo Silva");
  });

  it("renders the stable unknown-team route fallback", () => {
    const html = renderTeamDetail("missing-team");
    expect(html).toContain('data-testid="team-not-found"');
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });
});
