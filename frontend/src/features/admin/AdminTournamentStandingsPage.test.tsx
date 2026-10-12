import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentStandingsPage } from "./AdminTournamentStandingsPage";

let tournamentId = ADMIN.tournaments[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string; "aria-current"?: "page" }) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a href={to} {...props}>{children}</a>;
  },
  useParams: () => ({ id: tournamentId }),
}));

function renderStandings(id = ADMIN.tournaments[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<AdminTournamentStandingsPage />);
}

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

describe("admin tournament standings", () => {
  beforeEach(() => {
    tournamentId = ADMIN.tournaments[0].id;
  });

  it("renders the fixture's classification through the shared standings columns", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderStandings(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.category);
    expect(html).toContain("Clasificación");
    expect(html).toContain(`${tournament.detail.standings.length} EQUIPOS`);
    // The shared `standingsColumns`, i.e. the same header set the public `Clasificación` panel
    // renders: `# | Equipo | PJ | PG | Pts`. The screen's former own table also carried `PP`
    // and `SETS`, which the design has no counterpart for.
    expect(html).toContain("Equipo");
    expect(html).toContain("PJ");
    expect(html).toContain("PG");
    expect(html).toContain("Pts");
    expect(visibleText(html)).not.toContain("SETS");
    expect(visibleText(html)).not.toContain("PP");

    // Every row comes from the tournament's own fixture projection, so the two sides cannot
    // disagree on the same classification.
    const text = visibleText(html);
    for (const standing of tournament.detail.standings) {
      expect(text).toContain(standing.teamName);
    }
    expect(html).toContain(String(tournament.detail.standings[0].points));
    // The screen's own frozen prototype rows are gone.
    expect(text).not.toContain("Náutico Sportivo Avellaneda");
    expect(text).not.toContain("Provincial");
  });

  it("renders local admin tournament tabs with Standings active", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderStandings(tournament.id);

    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/standings" aria-current="page"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/bracket"`);
    expect(html).not.toContain(`href="/admin/tournaments/${tournament.id}/matches" aria-current="page"`);
    expect(html).not.toContain(`href="/admin/tournaments/${tournament.id}/stats" aria-current="page"`);
  });

  it("renders an explicit fallback without standings for an unknown tournament", () => {
    const html = renderStandings("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/admin/tournaments"');
    expect(html).not.toContain("Clasificación");
  });
});
