import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentStandingsPage } from "./TournamentStandingsPage";

let tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: tournamentId }),
}));

function renderTournamentStandings(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentStandingsPage />);
}

describe("public tournament standings", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected tournament context and standings rows", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStandings(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain("Tabla de posiciones");
    for (const label of ["#", "Equipo", "PJ", "PG", "PP", "SETS", "PTS"]) {
      expect(html).toContain(label);
    }
    for (const team of tournament.standings) {
      expect(html).toContain(team.teamName);
    }
  });

  it("links only standings entries with canonical team identities", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStandings(tournament.id);

    for (const standing of tournament.standings) {
      if ("teamId" in standing && standing.teamId) {
        expect(html).toContain(`href="/teams/${standing.teamId}"`);
      } else {
        expect(html).not.toContain(`href="/teams/${standing.teamName}"`);
      }
    }
    for (const team of PUBLIC_TEAMS) {
      expect(html).not.toContain(`href="/teams/${team.id}"`);
    }
  });

  it("renders the active standings tab and local tournament navigation", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStandings(tournament.id);

    expect(html).toContain(`href="/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain('aria-current="page"');
  });

  it("renders the selected status for a finished tournament", () => {
    const tournament = PUBLIC_TOURNAMENTS.finished[0];
    const html = renderTournamentStandings(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.dateLabel);
  });

  it("renders a not-found state without standings data for an unknown tournament", () => {
    const html = renderTournamentStandings("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/tournaments"');
    expect(html).not.toContain("River Plate");
  });
});
