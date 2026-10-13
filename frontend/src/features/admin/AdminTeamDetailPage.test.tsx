import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN, PUBLIC_PLAYERS } from "../../fixtures";
import { AdminTeamDetailPage } from "./AdminTeamDetailPage";
import { AdminTeamMatchesPage } from "./AdminTeamMatchesPage";
import { AdminTeamRosterPage } from "./AdminTeamRosterPage";
import { AdminTeamStatsPage } from "./AdminTeamStatsPage";

let teamId = ADMIN.teams[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string; "aria-current"?: "page" }) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a href={to} {...props}>{children}</a>;
  },
  useParams: () => ({ id: teamId }),
}));

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

describe("admin team detail", () => {
  beforeEach(() => {
    teamId = ADMIN.teams[0].id;
  });

  it("renders the design's page head and its four tab destinations", () => {
    const team = ADMIN.teams[0];
    const html = renderToStaticMarkup(<AdminTeamDetailPage />);
    const text = visibleText(html);

    expect(text).toContain(team.name);
    expect(text).toContain(team.city);
    expect(text).toContain(team.coach);
    expect(html).toContain('href="/admin/teams"');
    expect(html).toContain('href="/admin/teams/create"');
    expect(text).toContain("Volver");
    expect(text).toContain("Editar equipo");

    // The design's own tab set (voleytrack-admin-ver-equipo.html) over the shared `teamTabs`,
    // one real route per label, with the current entry marked through `aria-current`.
    expect(html).toContain('href="/admin/teams/' + team.id + '" aria-current="page"');
    expect(html).toContain('href="/admin/teams/' + team.id + '/roster"');
    expect(html).toContain('href="/admin/teams/' + team.id + '/matches"');
    expect(html).toContain('href="/admin/teams/' + team.id + '/stats"');
    expect(text).toContain("Detalle");
    expect(text).toContain(`Plantel (${team.playerCount})`);
    expect(text).toContain("Partidos");
    expect(text).toContain("Estadísticas");
  });

  it("renders the Perfil and Rendimiento regions of the Detalle tab", () => {
    const team = ADMIN.teams[0];
    const html = renderToStaticMarkup(<AdminTeamDetailPage />);
    const text = visibleText(html);

    expect(text).toContain("Perfil");
    expect(text).toContain("Nombre");
    expect(text).toContain("Sede");
    expect(text).toContain("Torneo");
    expect(text).toContain("Entrenador");
    expect(text).toContain("Jugadores");
    expect(text).toContain("Rendimiento");
    expect(text).toContain("ÚLTIMOS 5");
    // The fixture carries no tournament assignment for this team, so the Perfil card prints an
    // em dash. It does carry matches, so the pill strip renders them; the readout needs the
    // team's own detail projection, which this team has none of, so it stays absent.
    expect(text).toContain("Torneo —");
    expect(text).toContain("PRÓXIMO");
    expect(text).not.toContain("/ partido");
    expect(html).toContain(String(team.playerCount));
  });

  it("renders the roster table with scoped headers and the player's public height", () => {
    const player = PUBLIC_PLAYERS[0];
    const html = renderToStaticMarkup(<AdminTeamRosterPage />);
    const text = visibleText(html);

    expect(text).toContain("Jugador");
    expect(text).toContain("Posición");
    expect(text).toContain("Altura");
    expect(text).toContain("Dorsal");
    expect(text).toContain(player.fullName);
    expect(text).toContain(player.position);
    // `Altura` is read from the player's own public profile, and `Dorsal` from the roster.
    expect(text).toContain("1.95m");
    expect(text).toContain(String(player.number));
    expect(html).toContain('scope="col"');
  });

  it("renders the Partidos and Estadísticas tabs with their honest empty states", () => {
    const matches = visibleText(renderToStaticMarkup(<AdminTeamMatchesPage />));
    expect(matches).toContain("Partidos");
    // The shared `teamMatchRows` resolves this team's real fixtures from `PUBLIC_MATCHES` even
    // without a detail projection, so the design's `.mini-match` list renders them.
    expect(matches).toContain("PRÓXIMOS · Primera División");
    expect(matches).toContain("Club Atlético San Jorge vs Rosario Central Vóley");

    const stats = visibleText(renderToStaticMarkup(<AdminTeamStatsPage />));
    expect(stats).toContain("Equipo");
    expect(stats).toContain("Jugadores");
    expect(stats).toContain("TOP 5");
    // The bars and the leaderboard both need the team's own detail projection, which this team
    // has none of, so each card reports its own gap instead of inventing figures.
    expect(stats).toContain("No hay estadísticas registradas para este equipo.");
    expect(stats).toContain("No hay jugadores registrados para este equipo.");
  });

  it("renders the unknown-id fallback for a team the administration does not manage", () => {
    const html = renderToStaticMarkup(<AdminTeamDetailPage />);
    expect(visibleText(html)).toContain(ADMIN.teams[0].name);

    teamId = "river-plate";
    const missing = renderToStaticMarkup(<AdminTeamDetailPage />);

    expect(visibleText(missing)).toContain("Equipo no encontrado");
    expect(missing).toContain('href="/admin/teams"');
  });
});
