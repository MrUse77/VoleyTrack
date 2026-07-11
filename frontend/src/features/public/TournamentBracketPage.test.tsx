import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentBracketPage } from "./TournamentBracketPage";

let tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: tournamentId }),
}));

function renderTournamentBracket(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentBracketPage />);
}

describe("public tournament bracket", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected tournament context and bracket rounds", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentBracket(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain("Cuadro");
    for (const round of ["Cuartos de final", "Semifinal", "Final"]) {
      expect(html).toContain(round);
    }
  });

  it("renders the active bracket tab and local tournament navigation", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentBracket(tournament.id);

    expect(html).toContain(`href="/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain('aria-current="page"');
  });

  it("renders the selected status for an upcoming tournament bracket", () => {
    const tournament = PUBLIC_TOURNAMENTS.upcoming[0];
    const html = renderTournamentBracket(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.dateLabel);
  });

  it("renders a not-found state without bracket data for an unknown tournament", () => {
    const html = renderTournamentBracket("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/tournaments"');
    expect(html).not.toContain("Cuartos de final");
  });
});
