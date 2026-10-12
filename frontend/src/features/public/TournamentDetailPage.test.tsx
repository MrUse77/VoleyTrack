import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_TOURNAMENTS } from "../../fixtures";
import { TournamentDetailPage } from "./TournamentDetailPage";

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

function renderTournamentDetail(id = PUBLIC_TOURNAMENTS.inProgress[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<TournamentDetailPage />);
}

describe("public tournament detail", () => {
  beforeEach(() => {
    tournamentId = PUBLIC_TOURNAMENTS.inProgress[0].id;
  });

  it("renders the selected immutable tournament fixture with the design's detail regions", () => {
    const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
    const html = renderTournamentDetail(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.statusLabel);
    expect(html).toContain(tournament.dateLabel);
    expect(html).toContain(tournament.location);
    expect(html).toContain(tournament.category);
    // The design renders the KPI grid and the `Información` card above its `.tor-tabs`
    // (frontend/design/html/voleytrack-torneos.html), and a league detail opens on the
    // `Clasificación <small>TOP 5</small>` panel, so the landing route carries both.
    expect(html).toContain("Información");
    expect(html).toContain("DATOS GENERALES");
    expect(html).toContain("Clasificación");
    expect(html).toContain("TOP 5");
    expect(html).toContain("Equipos");
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
    // The design's own tab labels: `Clasificación` for the standings panel and `Llaves` for
    // the knockout panel (frontend/design/html/voleytrack-torneos.html). The app's former
    // labels were `Tabla` and `Cuadro`.
    expect(html).toContain("Clasificación");
    expect(html).toContain("Estadísticas");
    expect(html).toContain("Llaves");
    expect(html).not.toContain("Cuadro");
    expect(html).toContain('aria-current="page"');
  });

  it("opens a cup detail on the design's participants panel", () => {
    const tournament = PUBLIC_TOURNAMENTS.upcoming[0];
    const html = renderTournamentDetail(tournament.id);

    // The design's `copa-nacional` detail marks `Participantes` as its first active tab and
    // the league detail marks `Clasificación`, so the landing panel branches on the fixture's
    // tournament type.
    expect(tournament.typeLabel).toBe("Copa");
    expect(html).toContain("Equipos participantes");
    expect(html).toContain("CONFIRMADOS");
    expect(html).not.toContain("TOP 5");
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
