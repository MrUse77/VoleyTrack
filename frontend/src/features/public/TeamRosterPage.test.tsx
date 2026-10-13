import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamRosterPage } from "./TeamRosterPage";

const riverPlate = PUBLIC_TEAMS.find((team) => team.id === "river-plate")!;
let teamId = riverPlate.id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string; "aria-current"?: "page" }) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a href={to} {...props}>{children}</a>;
  },
  useLocation: () => ({ search: {} }),
  useParams: () => ({ id: teamId }),
}));

function renderRoster(id = riverPlate.id) {
  teamId = id;
  return renderToStaticMarkup(<TeamRosterPage />);
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
  expect(html).toContain(`href="/teams/${riverPlate.id}/roster" aria-current="page"`);
}

describe("public team roster", () => {
  beforeEach(() => {
    teamId = riverPlate.id;
  });

  it("keeps the shared identity and Plantel route semantics", () => {
    const html = renderRoster();
    expectSharedTeamJourney(html);
  });

  it("renders the canonical roster as an accessible linked table", () => {
    const html = renderRoster();

    expect(html).toContain("Plantel Completo");
    expect(html).toContain("text-lg font-bold leading-6 text-vt-accent");
    expect(html).toContain('data-testid="team-roster-panel"');
    expect(html).toContain("min-[1416px]:h-[520px]");
    expect(html).toContain('data-testid="team-roster-table"');
    expect(html).toContain('data-testid="team-roster-columns"');
    expect(html).toContain("table-fixed");
    expect(html).toContain("min-[1416px]:min-w-[1104px]");
    for (const width of ["w-[242px]", "w-[190px]", "w-[100px]", "w-[150px]", "w-[122px]"]) {
      expect(html).toContain(width);
    }
    expect(html).toContain("<table");
    for (const heading of ["JUGADOR", "POSICIÓN", "#", "PUNTOS", "ATAQUES", "BLOQUEOS", "SAQUES"]) {
      expect(html).toContain(heading);
    }

    const players = [
      ["mateo-silva", "Mateo Silva", "Punta receptor", "12", "128", "76", "18", "16"],
      ["ivan-molina", "Iván Molina", "Central", "7", "74", "38", "24", "12"],
      ["santiago-lopez", "Santiago López", "Armador", "3", "42", "22", "14", "6"],
      ["facundo-rios", "Facundo Ríos", "Opuesto", "9", "39", "28", "8", "3"],
      ["nicolas-vera", "Nicolás Vera", "Líbero", "1", "0", "0", "0", "0"],
    ] as const;

    for (const [id, ...values] of players) {
      expect(html).toContain(`data-player-id="${id}"`);
      expect(html).not.toContain(`href="/players/${id}"`);
      for (const value of values) expect(html).toContain(value);
    }
  });

  it("links a roster player when a standalone public player fixture exists", () => {
    const team = PUBLIC_TEAMS.find((item) => item.id === "club-atletico-san-jorge")!;
    const html = renderRoster(team.id);
    expect(html).toContain('href="/players/jugadora-valentina-ruiz"');
  });

  it("locks the canonical table width behind the safe shell-aware breakpoint", () => {
    const html = renderRoster();
    expect(html).toContain("max-w-[1104px]");
    expect(html).toContain("min-[1428px]:ml-1");
    expect(html).not.toContain("min-[1416px]:ml-1");
    expect(html).toContain("min-[1416px]:h-[520px]");
    expect(html).not.toContain("min-[1416px]:min-h-[520px]");
    expect(html).toContain("overflow-x-auto");
    expect(html).not.toMatch(/\bxl:/);
  });

  it("renders an honest empty roster for a represented team without players", () => {
    const team = PUBLIC_TEAMS.find((item) => item.id === "boca-juniors")!;
    const html = renderRoster(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain("No hay jugadores registrados para este equipo.");
    expect(html).not.toContain("Mateo Silva");
  });

  it("renders the stable unknown-team route fallback", () => {
    const html = renderRoster("missing-team");
    expect(html).toContain('data-testid="team-not-found"');
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });
});
