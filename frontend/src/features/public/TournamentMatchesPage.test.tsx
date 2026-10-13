import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_MATCHES, PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentMatchesPage } from "./TournamentMatchesPage";

let tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: tournamentId }),
}));

function renderTournamentMatches(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentMatchesPage />);
}

describe("public tournament matches", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected tournament context and tournament-scoped fixture rows", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentMatches(tournament.id);
    const matches = Object.values(PUBLIC_MATCHES).flat();

    expect(html).toContain(tournament.name);
    expect(html).toContain(`Detalle del torneo · ${tournament.category}`);
    // The design's own label for the matches section (frontend/design/html/voleytrack-torneos.html,
    // `card-h` "Próximos partidos"); the app's former heading was "Partidos del Torneo".
    expect(html).toContain("Próximos partidos");
    for (const match of matches.filter(({ tournamentId }) => tournamentId === tournament.id)) {
      expect(html).toContain(match.homeTeamName);
      expect(html).toContain(match.awayTeamName);
      expect(html).toContain(match.scheduledLabel);
      expect(html).toContain(match.badgeLabel);
    }
    for (const match of matches.filter(({ tournamentId }) => tournamentId !== tournament.id)) {
      expect(html).not.toContain(`/matches/${match.id}/live`);
    }
  });

  it("renders the active local tab and links to the other tournament tabs", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentMatches(tournament.id);

    expect(html).toContain(`href="/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Resumen");
    expect(html).toContain("Partidos");
    expect(html).toContain("Clasificación");
    expect(html).toContain("Estadísticas");
    expect(html).toContain("Llaves");
  });

  it("renders a not-found state without match data for an unknown tournament", () => {
    const html = renderTournamentMatches("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/tournaments"');
    expect(html).not.toContain(PUBLIC_MATCHES.live[0].homeTeamName);
  });
});
