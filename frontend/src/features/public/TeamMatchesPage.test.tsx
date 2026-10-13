import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS } from "../../fixtures";
import { TeamMatchesPage } from "./TeamMatchesPage";

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

function renderMatches(id = riverPlate.id) {
  teamId = id;
  return renderToStaticMarkup(<TeamMatchesPage />);
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
  expect(html).toContain(`href="/teams/${riverPlate.id}/matches" aria-current="page"`);
}

describe("public team matches", () => {
  beforeEach(() => {
    teamId = riverPlate.id;
  });

  it("keeps the shared identity and Partidos route semantics", () => {
    const html = renderMatches();
    expectSharedTeamJourney(html);
  });

  it("renders canonical live, recent, and upcoming team context in fixture order", () => {
    const html = renderMatches();
    const expectedOrder = [
      "River Plate vs Boca Juniors",
      "River Plate vs Ciudad Voley",
      "UPCN San Juan vs River Plate",
      "River Plate vs Bolívar",
    ];

    expect((html.match(/data-testid="team-match-row"/g) ?? [])).toHaveLength(4);
    expect(html).toContain('data-testid="team-matches-panel"');
    expect(html).toContain("text-lg font-bold leading-6 text-vt-accent");
    expectedOrder.forEach((label, index) => {
      expect(html).toContain(label);
      if (index > 0) expect(html.indexOf(expectedOrder[index - 1])).toBeLessThan(html.indexOf(label));
    });

    for (const copy of [
      "EN VIVO",
      "VICTORIA",
      "DERROTA",
      "PRÓXIMO",
      "21 - 18",
      "3 - 1",
      "3 - 2",
      "Programado",
      "Set 3 · Estadio Monumental",
      "Finalizado · 4 sets",
      "Finalizado · 5 sets",
      "Jue 11 Jul · 20:00",
      "Sede no informada",
    ]) {
      expect(html).toContain(copy);
    }
  });

  it("reproduces each canonical row height and offset without a uniform minimum", () => {
    const html = renderMatches();

    const rowGeometries = [
      'data-row-index="1" class="min-[1416px]:h-[74px]"',
      'data-row-index="2" class="min-[1416px]:mt-4 min-[1416px]:h-[74px]"',
      'data-row-index="3" class="min-[1416px]:mt-8 min-[1416px]:h-16"',
      'data-row-index="4" class="min-[1416px]:mt-5 min-[1416px]:h-16"',
    ];

    for (const geometry of rowGeometries) expect(html).toContain(geometry);
    expect((html.match(/min-h-\[74px\]/g) ?? [])).toHaveLength(0);
  });

  it("links only the represented live route and does not invent unavailable detail routes", () => {
    const html = renderMatches();
    expect(html).toContain('href="/matches/match-liga-a1-river-boca/live"');
    expect(html).not.toContain('href="/matches/match-liga-a1-river-ciudad-finished/live"');
    expect(html).not.toContain('href="/matches/match-liga-a1-upcn-river-finished/live"');
    expect(html).not.toContain('href="/matches/match-liga-a1-river-bolivar/live"');
  });

  it("locks the canonical list geometry behind the safe shell-aware breakpoint", () => {
    const html = renderMatches();
    expect(html).toContain("max-w-[1104px]");
    expect(html).toContain("min-[1428px]:ml-1");
    expect(html).not.toContain("min-[1416px]:ml-1");
    expect(html).toContain("min-[1416px]:h-[520px]");
    expect(html).not.toContain("min-[1416px]:min-h-[520px]");
    expect(html).not.toMatch(/\bxl:/);
  });

  it("keeps alternate-team match identity separate from the canonical River projection", () => {
    const team = PUBLIC_TEAMS.find((item) => item.id === "monteros")!;
    const html = renderMatches(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain("Bolívar vs Monteros");
    expect(html).not.toContain("River Plate vs Boca Juniors");
  });

  it("renders the stable unknown-team route fallback", () => {
    const html = renderMatches("missing-team");
    expect(html).toContain('data-testid="team-not-found"');
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });
});
