import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import type { TeamMatchRow, TeamRosterRow } from "./TeamJourney";
import {
  findTeamJourney,
  TeamJourney,
  teamMatchRows,
  TeamNotFound,
  TeamPlayerName,
  teamRosterRows,
} from "./TeamJourney";

export function TeamDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findTeamJourney(id);

  if (!context) return <TeamNotFound />;

  const roster = teamRosterRows(context);
  const recentMatches = teamMatchRows(context).slice(0, 2);

  return (
    <TeamJourney activeTab="overview" {...context}>
      <section
        aria-label="Resumen del equipo"
        className="grid gap-6 min-[1416px]:grid-cols-[536px_540px] min-[1416px]:gap-7 min-[1416px]:translate-x-2"
        data-testid="team-overview-grid"
      >
        <div className="space-y-6 min-[1416px]:space-y-[26px]">
          <Card
            aria-label="Estadísticas del equipo"
            className="p-[22px] pt-5 min-[1416px]:h-[246px]"
            data-testid="team-overview-stats"
          >
            <h2 className="text-[15px] font-black leading-[18px] text-vt-text">Estadísticas del equipo</h2>
            {context.detail ? (
              <dl className="mt-5 grid gap-4 sm:grid-cols-2 min-[1416px]:grid-cols-[232px_232px] min-[1416px]:gap-x-7 min-[1416px]:gap-y-5">
                {context.detail.summaryStats.map((stat) => (
                  <div className="h-[72px] rounded-[14px] bg-vt-panel px-4 py-[14px]" key={stat.label}>
                    <dt className="text-[10px] font-black leading-3 tracking-[0.08em] text-vt-muted">{stat.label}</dt>
                    <dd className={`mt-1 text-2xl font-black leading-7 ${stat.label === "ATAQUES PUNTO" ? "text-vt-accent" : "text-vt-text"}`}>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-5 text-sm text-vt-muted">Estadísticas no disponibles para este equipo.</p>
            )}
          </Card>

          <Card
            aria-label="Últimos partidos"
            className="p-[22px] pt-5 min-[1416px]:h-[242px]"
            data-testid="team-overview-recent-matches"
          >
            <h2 className="text-[15px] font-black leading-[18px] text-vt-text">Últimos partidos</h2>
            {recentMatches.length > 0 ? (
              <ul className="mt-5 space-y-3">
                {recentMatches.map((row) => <RecentMatch key={row.match.id} row={row} />)}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-vt-muted">No hay partidos registrados para este equipo.</p>
            )}
          </Card>
        </div>

        <Card
          aria-label="Vista previa del plantel"
          className="p-6 min-[1416px]:h-[512px]"
          data-testid="team-overview-roster"
        >
          <h2 className="text-lg font-bold leading-6 text-vt-text">Plantel y Estadísticas</h2>
          {roster.length > 0 ? (
            <div className="mt-[22px] overflow-x-auto">
              <table className="w-full min-w-[492px] table-fixed border-collapse text-left">
                <colgroup data-testid="team-overview-roster-columns">
                  <col className="w-[270px]" />
                  <col className="w-[60px]" />
                  <col className="w-[60px]" />
                  <col className="w-[60px]" />
                  <col className="w-[42px]" />
                </colgroup>
                <thead className="bg-vt-panel">
                  <tr className="h-8 text-xs tracking-[0.08em] text-vt-muted">
                    <th className="pl-4 font-bold" scope="col">JUGADOR</th>
                    <th className="text-center font-bold" scope="col">PTS</th>
                    <th className="text-center font-bold" scope="col">ATA</th>
                    <th className="text-center font-bold" scope="col">BLO</th>
                    <th className="text-center font-bold" scope="col">ACE</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.slice(0, 5).map((row, index) => (
                    <RosterPreviewRow index={index} key={row.player.id} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 text-sm text-vt-muted">No hay jugadores registrados para este equipo.</p>
          )}
        </Card>
      </section>
    </TeamJourney>
  );
}

function RosterPreviewRow({ index, row }: { index: number; row: TeamRosterRow }) {
  return (
    <tr
      className={`h-14 ${index % 2 === 0 ? "bg-vt-surface" : "bg-vt-background"}`}
      data-testid="team-overview-roster-row"
    >
      <th className="pl-2 pr-3" scope="row">
        <TeamPlayerName
          className="font-bold text-vt-text"
          player={row.player}
        >
          <span className="mr-[10px] inline-flex size-8 items-center justify-center rounded-full bg-vt-accent text-xs font-bold text-vt-canvas">
            {row.player.number}
          </span>
          {row.player.fullName}
        </TeamPlayerName>
        <span className="block pl-[42px] text-xs font-normal text-vt-muted">{row.player.position}</span>
      </th>
      <td className="text-center font-black text-vt-accent">{row.stats?.points ?? "—"}</td>
      <td className="text-center font-bold text-vt-text">{row.stats?.attacks ?? "—"}</td>
      <td className="text-center font-bold text-vt-text">{row.stats?.blocks ?? "—"}</td>
      <td className="text-center font-bold text-vt-text">{row.stats?.aces ?? "—"}</td>
    </tr>
  );
}

function RecentMatch({ row }: { row: TeamMatchRow }) {
  const content = (
    <div className="flex min-h-[54px] items-center justify-between gap-4 rounded-xl bg-vt-panel px-4 py-2 min-[1416px]:h-[54px]">
      <div className="min-w-0">
        <p className="truncate text-sm font-black text-vt-text">
          {row.match.homeTeamName} vs {row.match.awayTeamName}
        </p>
        <p className="mt-1 text-xs text-vt-muted">{row.resultLabel === "EN VIVO" ? "En vivo" : row.match.badgeLabel}</p>
      </div>
      <p className="shrink-0 text-lg font-black text-vt-text">
        {row.match.score ? `${row.match.score.home} - ${row.match.score.away}` : "Programado"}
      </p>
    </div>
  );

  return (
    <li>
      {row.match.status === "live" ? (
        <Link
          className="block rounded-xl transition hover:ring-1 hover:ring-vt-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/matches/${row.match.id}/live` as string}
        >
          {content}
        </Link>
      ) : content}
    </li>
  );
}
