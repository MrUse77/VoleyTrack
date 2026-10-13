import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { Badge } from "../../components/primitives/Badge";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Num } from "../../components/primitives/Num";
import type { TeamDetailFixture } from "../../fixtures";
import type { TeamMatchRow, TeamRosterRow } from "./TeamJourney";
import {
  findTeamJourney,
  TeamJourney,
  teamMatchRows,
  TeamNotFound,
  TeamPlayerName,
  teamPerformanceBadges,
  teamPerformanceReadout,
  teamRosterRows,
} from "./TeamJourney";

/**
 * Design: frontend/design/html/voleytrack-equipos.html, the team-detail view. Of the app's
 * existing Detalle regions, this keeps the summary statistics card, the roster preview and
 * the recent-matches card, and adds the design's "Rendimiento ÚLTIMOS 5" treatment as a
 * fourth card.
 *
 * Two recorded divergences, both forced by the fixtures rather than chosen:
 * - The design's `Rendimiento` card holds five result badges. `TeamDetailFixture` records
 *   four matches for the only team that has a detail projection, so the strip renders every
 *   match the fixture carries instead of inventing a fifth.
 * - The design's small readout under those badges is `Ataque efectivo 47%`,
 *   `Bloqueos / set 2.4`, `Errores no forzados 11.2`. The app has no per-set or
 *   unforced-error metric anywhere, so the card reports real per-match averages derived
 *   from the team's own `summaryStats` instead of printing numbers nothing backs.
 */
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
        {context.detail ? (
          <PerformanceCard detail={context.detail} matches={teamMatchRows(context)} teamId={context.team.id} />
        ) : null}

        <div className="space-y-6 min-[1416px]:space-y-[26px]">
          <Card
            aria-label="Estadísticas del equipo"
            className="min-[1416px]:h-[246px]"
            data-testid="team-overview-stats"
            padded={false}
          >
            <CardHeader>Estadísticas del equipo</CardHeader>
            {context.detail ? (
              <CardBody data-testid="team-overview-stats-card-body">
                <dl className="grid gap-4 sm:grid-cols-2 min-[1416px]:grid-cols-[232px_232px] min-[1416px]:gap-x-7 min-[1416px]:gap-y-5">
                  {context.detail.summaryStats.map((stat) => (
                    <div className="h-[72px] rounded-[14px] bg-vt-surface-2 px-4 py-[14px]" key={stat.label}>
                      <dt className="text-[10px] font-black leading-3 tracking-[0.08em] text-vt-muted">{stat.label}</dt>
                      <dd className={`mt-1 text-2xl font-black leading-7 ${stat.label === "ATAQUES PUNTO" ? "text-vt-accent" : "text-vt-text"}`}>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardBody>
            ) : (
              <CardBody>
                <p className="text-sm text-vt-muted">Estadísticas no disponibles para este equipo.</p>
              </CardBody>
            )}
          </Card>

          <Card
            aria-label="Últimos partidos"
            className="min-[1416px]:h-[242px]"
            data-testid="team-overview-recent-matches"
            padded={false}
          >
            <CardHeader>Últimos partidos</CardHeader>
            {recentMatches.length > 0 ? (
              <CardBody data-testid="team-overview-recent-matches-card-body">
                <ul className="space-y-3">
                  {recentMatches.map((row) => <RecentMatch key={row.match.id} row={row} />)}
                </ul>
              </CardBody>
            ) : (
              <CardBody>
                <p className="text-sm text-vt-muted">No hay partidos registrados para este equipo.</p>
              </CardBody>
            )}
          </Card>
        </div>

        <Card
          aria-label="Vista previa del plantel"
          className="min-w-0 min-[1416px]:h-[512px]"
          data-testid="team-overview-roster"
          padded={false}
        >
          <CardHeader>Plantel y Estadísticas</CardHeader>
          {roster.length > 0 ? (
            <CardBody data-testid="team-overview-roster-card-body">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[492px] table-fixed border-collapse text-left">
                  <colgroup data-testid="team-overview-roster-columns">
                    <col className="w-[270px]" />
                    <col className="w-[60px]" />
                    <col className="w-[60px]" />
                    <col className="w-[60px]" />
                    <col className="w-[42px]" />
                  </colgroup>
                  <thead className="bg-vt-surface-2">
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
            </CardBody>
          ) : (
            <CardBody>
              <p className="text-sm text-vt-muted">No hay jugadores registrados para este equipo.</p>
            </CardBody>
          )}
        </Card>
      </section>
    </TeamJourney>
  );
}

/**
 * The design's "Rendimiento ÚLTIMOS 5" card: a `.card-h` with the `ÚLTIMOS 5` eyebrow over a
 * `.card-b` holding the last results as `.badge` pills and a small label/value readout.
 *
 * Every badge carries its outcome as text (`V` / `D` / `EN VIVO` / `PRÓXIMO`) before its
 * colour, so the strip never depends on colour alone.
 */
function PerformanceCard({
  detail,
  matches,
  teamId,
}: {
  detail: TeamDetailFixture;
  matches: readonly TeamMatchRow[];
  teamId: string;
}) {
  const badges = teamPerformanceBadges(matches, teamId);
  const readout = teamPerformanceReadout(detail);

  return (
    <Card className="min-[1416px]:col-span-2" data-testid="team-overview-performance" padded={false}>
      <CardHeader>
        Rendimiento
        <small>ÚLTIMOS 5</small>
      </CardHeader>
      <CardBody data-testid="team-overview-performance-card-body">
        <ul aria-label="Últimos resultados" className="mb-[14px] flex flex-wrap gap-2">
          {badges.map((badge) => (
            <li key={badge.id}>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </li>
          ))}
        </ul>
        <dl className="m-0">
          {readout.map((row) => (
            <div className="flex items-center justify-between border-b border-vt-border-2 py-2 last:border-b-0" key={row.label}>
              <dt className="text-[13px] text-vt-muted">{row.label}</dt>
              <dd className="m-0"><Num>{row.value}</Num></dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
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
          <span className="mr-[10px] inline-flex size-8 items-center justify-center rounded-full bg-vt-accent text-xs font-bold text-vt-background">
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
    <div className="flex min-h-[54px] items-center justify-between gap-4 rounded-xl bg-vt-surface-2 px-4 py-2 min-[1416px]:h-[54px]">
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
