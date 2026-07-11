import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentDetailPage } from "./TournamentDetailPage";

let tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useParams: () => ({ id: tournamentId }),
}));

function renderTournamentDetail(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentDetailPage />);
}

describe("public tournament detail", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected immutable tournament fixture with overview content", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentDetail(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.dateLabel);
    expect(html).toContain(tournament.location);
    expect(html).toContain(tournament.category);
    expect(html).toContain("Resumen del torneo");
    expect(html).toContain("Información general");
  });

  it("renders local entry points for every tournament tab", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentDetail(tournament.id);

    expect(html).toContain(`href="/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain("Partidos");
    expect(html).toContain("Tabla");
    expect(html).toContain("Estadísticas");
    expect(html).toContain("Cuadro");
  });

  it("selects a different fixture when the route id changes", () => {
    const tournament = PUBLIC_TOURNAMENTS.finished[0];
    const html = renderTournamentDetail(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.location);
    expect(html).not.toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);
  });
});
