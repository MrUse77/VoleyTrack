import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentStandingsPage } from "./AdminTournamentStandingsPage";

let tournamentId = ADMIN.tournaments[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
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

  it("renders selected tournament context and its static standings table", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderStandings(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.category);
    // The design's own label for this panel (voleytrack-admin-ver-torneo.html, the league
    // detail's `Clasificación <small>TOP 5</small>`); the screen's former "Tabla de
    // posiciones" heading was the app's own wording.
    expect(html).toContain("Clasificación");
    expect(html).toContain("Equipo");
    expect(html).toContain("PJ");
    expect(html).toContain("PTS");
    const standingsRows = [
      [1, "San Jorge Vóley", 6, 5, 1, "16-7", 15],
      [2, "Rosario Central", 6, 4, 2, "14-9", 12],
      [3, "Provincial", 6, 3, 3, "11-11", 9],
      [4, "Náutico Sportivo Avellaneda", 6, 0, 6, "3-17", 0],
    ];

    const text = visibleText(html);
    for (const row of standingsRows) {
      expect(text).toContain(row.join(" "));
    }
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
