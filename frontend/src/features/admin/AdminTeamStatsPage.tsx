import { useParams } from "@tanstack/react-router";
import { Card, CardBody } from "../../components/primitives/Card";
import { Num } from "../../components/primitives/Num";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { AdminTeamNotFound } from "./AdminTeamNotFound";
import { AdminTeamShell } from "./AdminTeamShell";
import { findAdminTeam } from "./adminTeamLookup";

/**
 * The admin team detail's `Estadísticas` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-equipo.html — a two-column grid: a card
 * headed `Equipo <small>LIGA A1</small>` holding the `.stat-bars` block (a 13px/700 label, a
 * mono accent value and an 8px `--border-2` track with an `--accent` fill), and a card headed
 * `Jugadores <small>TOP 5</small>` listing the squad's leading scorers.
 *
 * Two recorded divergences, both forced by the fixtures rather than chosen: the design's four
 * bars are `Ataque efectivo 47%`, `Recepción 52%`, `Bloqueo / set 2.4`, `Errores no forzados
 * 11.2`, and the app has no metric for any of them, so the bars report the team's own
 * `summaryStats` totals with the fill scaled against the largest of them; and the design's
 * `TOP 5` table is a bare `<table>` with no header cells, which the app renders as a labelled
 * list so the value column is not announced as an unheaded table.
 */
export function AdminTeamStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findAdminTeam(id);

  if (!context) return <AdminTeamNotFound />;

  const { team, detail } = context;
  const maxValue = detail ? Math.max(...detail.summaryStats.map((stat) => stat.value)) : 0;
  const topPlayers = detail ? [...detail.rosterStats].sort((a, b) => b.points - a.points).slice(0, 5) : [];

  return (
    <AdminTeamShell activeTab="stats" context={context}>
      <div className="grid gap-4 min-[901px]:grid-cols-2">
        <Card padded={false}>
          <TournamentPanelHeader eyebrow={detail?.tournamentName ?? team.category}>Equipo</TournamentPanelHeader>
          <CardBody data-testid="admin-team-stats-card-body">
            {detail ? (
              <div className="flex flex-col gap-[14px]">
                {detail.summaryStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-bold text-vt-text">{stat.label}</span>
                      <Num className="text-[13px] font-extrabold text-vt-accent">{stat.value}</Num>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-vt-border-2">
                      <i
                        className="block h-full rounded-full bg-vt-accent"
                        style={{ width: `${maxValue > 0 ? Math.round((stat.value / maxValue) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[13px] text-vt-muted">No hay estadísticas registradas para este equipo.</p>
            )}
          </CardBody>
        </Card>

        <Card padded={false}>
          <TournamentPanelHeader eyebrow="TOP 5">Jugadores</TournamentPanelHeader>
          <CardBody data-testid="admin-team-top-players-card-body">
            {topPlayers.length > 0 ? (
              <ul aria-label="Máximos anotadores" className="m-0 list-none p-0">
                {topPlayers.map((player) => (
                  <li
                    className="flex items-center justify-between gap-3 border-b border-vt-border-2 py-2 last:border-b-0"
                    key={player.id}
                  >
                    <span className="text-[13px]">
                      <b className="text-vt-text">{player.fullName}</b>{" "}
                      <small className="text-vt-muted">{player.position}</small>
                    </span>
                    <Num className="text-[13px] font-bold text-vt-text">{player.points} pts</Num>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-[13px] text-vt-muted">No hay jugadores registrados para este equipo.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </AdminTeamShell>
  );
}
