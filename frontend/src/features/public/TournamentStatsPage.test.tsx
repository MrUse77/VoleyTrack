import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentStatsPage } from "./TournamentStatsPage";

let tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;

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

function renderTournamentStats(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentStatsPage />);
}

describe("public tournament stats", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected tournament context and stats leaders", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStats(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain("Estadísticas");
    for (const leader of tournament.statLeaders) {
      expect(html).toContain(leader.category);
      expect(html).toContain(leader.playerName);
    }
  });

  it("links leaders to their canonical player and team records", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStats(tournament.id);

    for (const leader of tournament.statLeaders) {
      if (leader.playerId) {
        expect(html).toContain(`href="/players/${leader.playerId}"`);
      }
      if (leader.teamId) {
        expect(html).toContain(`href="/teams/${leader.teamId}"`);
      }
    }
    for (const player of PUBLIC_PLAYERS) {
      expect(html).toContain(`href="/players/${player.id}"`);
    }
    for (const team of PUBLIC_TEAMS) {
      expect(html).toContain(`href="/teams/${team.id}"`);
    }
  });

  it("renders the active stats tab and local tournament navigation", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentStats(tournament.id);

    expect(html).toContain(`href="/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain('aria-current="page"');
  });

  it("renders the selected status for a finished tournament", () => {
    const tournament = PUBLIC_TOURNAMENTS.finished[0];
    const html = renderTournamentStats(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.dateLabel);
  });

  it("renders a not-found state without stats data for an unknown tournament", () => {
    const html = renderTournamentStats("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/tournaments"');
    expect(html).not.toContain("Valentina Ruiz");
  });
});
