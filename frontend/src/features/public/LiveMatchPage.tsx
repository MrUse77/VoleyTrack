import type { ReactNode } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_LIVE_MATCH_DETAILS,
  PUBLIC_MATCHES,
  PUBLIC_TOURNAMENTS,
  type LiveMatchDetailFixture,
  type LiveTeamRotationFixture,
  type MatchFixture,
  type MatchStatus,
} from "../../fixtures";

const ALL_MATCHES: readonly MatchFixture[] = [
  ...PUBLIC_MATCHES.upcoming,
  ...PUBLIC_MATCHES.live,
  ...PUBLIC_MATCHES.today,
  ...PUBLIC_MATCHES.finished,
];

const statusClasses: Record<MatchStatus, string> = {
  finished: "border border-vt-border bg-vt-panel text-vt-muted",
  live: "bg-vt-danger text-white",
  today: "bg-vt-accent text-vt-background",
  upcoming: "border border-vt-border bg-vt-panel text-vt-muted",
};

const homePositionClasses = [
  "col-start-2 row-start-1 min-[1440px]:left-[534px] min-[1440px]:top-[50px]",
  "col-start-2 row-start-2 min-[1440px]:left-[534px] min-[1440px]:top-[184px]",
  "col-start-2 row-start-3 min-[1440px]:left-[534px] min-[1440px]:top-[317px]",
  "col-start-1 row-start-1 min-[1440px]:left-[204px] min-[1440px]:top-[50px]",
  "col-start-1 row-start-2 min-[1440px]:left-[204px] min-[1440px]:top-[184px]",
  "col-start-1 row-start-3 min-[1440px]:left-[204px] min-[1440px]:top-[317px]",
] as const;

const awayPositionClasses = [
  "col-start-1 row-start-1 min-[1440px]:left-[754px] min-[1440px]:top-[50px]",
  "col-start-1 row-start-2 min-[1440px]:left-[754px] min-[1440px]:top-[184px]",
  "col-start-1 row-start-3 min-[1440px]:left-[754px] min-[1440px]:top-[317px]",
  "col-start-2 row-start-1 min-[1440px]:left-[1084px] min-[1440px]:top-[50px]",
  "col-start-2 row-start-2 min-[1440px]:left-[1084px] min-[1440px]:top-[184px]",
  "col-start-2 row-start-3 min-[1440px]:left-[1084px] min-[1440px]:top-[317px]",
] as const;

function findMatch(id: string): MatchFixture | undefined {
  return ALL_MATCHES.find((match) => match.id === id);
}

function findLiveDetail(id: string): LiveMatchDetailFixture | undefined {
  return PUBLIC_LIVE_MATCH_DETAILS.find(({ match }) => match.id === id);
}

function tournamentNameFor(match: MatchFixture): string {
  return (
    PUBLIC_TOURNAMENTS.all.find(({ id }) => id === match.tournamentId)?.name ??
    "Torneo no disponible"
  );
}

export function LiveMatchPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const match = findMatch(id);
  const detail = match ? findLiveDetail(match.id) : undefined;

  return (
    <LiveMatchShell match={match}>
      <StateBoundary>
        {!match ? (
          <UnknownMatchState />
        ) : detail ? (
          <LiveMatchDetail detail={detail} />
        ) : (
          <ScheduledMatchDetail match={match} />
        )}
      </StateBoundary>
    </LiveMatchShell>
  );
}

function LiveMatchShell({
  children,
  match,
}: {
  children: ReactNode;
  match?: MatchFixture;
}) {
  const title = match
    ? `${match.homeTeamName} vs ${match.awayTeamName}`
    : "Detalle del partido";
  const statusLabel = match
    ? match.status === "live"
      ? "EN VIVO"
      : match.badgeLabel.toUpperCase()
    : "SIN DATOS";
  const statusClass = match
    ? statusClasses[match.status]
    : "border border-vt-border bg-vt-panel text-vt-muted";

  return (
    <div
      className="min-h-screen min-w-0 bg-vt-background text-vt-text"
      data-testid="live-match-shell"
    >
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-vt-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-vt-background"
        href="#live-match-main"
      >
        Saltar al contenido
      </a>
      <header
        aria-label="Encabezado del partido"
        className="min-h-[72px] bg-vt-surface min-[1440px]:h-[72px]"
        data-testid="live-match-header"
      >
        <div
          className="mx-auto grid min-h-[72px] w-full max-w-[1368px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:px-6 min-[1440px]:h-[72px] min-[1440px]:grid-cols-[120px_minmax(0,1fr)_204px] min-[1440px]:gap-x-11 min-[1440px]:px-0 min-[1440px]:py-0"
          data-testid="live-match-header-content"
        >
          <Link
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-vt-panel px-3 text-xs font-bold text-vt-accent transition hover:bg-vt-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent min-[1440px]:h-8 min-[1440px]:w-[120px]"
            data-testid="live-match-back-control"
            to="/matches"
          >
            ← Volver
          </Link>
          <h1 className="min-w-0 truncate text-sm font-black text-vt-text sm:text-lg">
            {title}
          </h1>
          <span
            className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-center text-xs font-black min-[1440px]:w-[204px] ${statusClass}`}
            data-testid="live-match-header-status"
          >
            {statusLabel}
          </span>
        </div>
      </header>
      <main
        className="mx-auto w-full max-w-[1368px] px-4 pb-10 pt-7 sm:px-6 min-[1440px]:w-[1368px] min-[1440px]:px-0"
        data-match-id={match?.id}
        data-testid="live-match-content"
        id="live-match-main"
      >
        {children}
      </main>
    </div>
  );
}

function UnknownMatchState() {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-vt-text">Partido no encontrado</h2>
      <p className="mt-2 text-sm text-vt-muted">
        No existe un partido público con este identificador.
      </p>
    </Card>
  );
}

function LiveMatchDetail({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;
  const currentSet = detail.sets.at(-1)!;
  const servingTeamName =
    detail.servingTeamId === match.homeTeamId
      ? match.homeTeamName
      : match.awayTeamName;

  return (
    <>
      <Scoreboard
        currentSetNumber={currentSet.number}
        detail={detail}
        servingTeamName={servingTeamName}
      />
      <CourtRotations rotations={detail.rotations} />
      <div
        className="mt-[30px] grid grid-cols-1 gap-6 min-[1440px]:grid-cols-[660px_660px] min-[1440px]:gap-12"
        data-testid="live-statistics-grid"
      >
        <TeamStatistics detail={detail} />
        <PlayerStatistics detail={detail} />
      </div>
      <LiveEvents detail={detail} />
      <MatchMetadata
        match={match}
        servingTeamName={servingTeamName}
        tournamentName={detail.tournamentName}
      />
    </>
  );
}

function Scoreboard({
  currentSetNumber,
  detail,
  servingTeamName,
}: {
  currentSetNumber: number;
  detail: LiveMatchDetailFixture;
  servingTeamName: string;
}) {
  const { match } = detail;

  return (
    <section
      aria-labelledby="live-scoreboard-heading"
      className="relative overflow-hidden rounded-2xl bg-vt-surface min-[1440px]:h-[180px]"
      data-testid="live-match-scoreboard"
    >
      <h2 className="sr-only" id="live-scoreboard-heading">
        Marcador del partido en vivo
      </h2>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-4 px-5 py-6 min-[1440px]:block min-[1440px]:p-0">
        <Link
          className="col-start-1 row-start-1 min-w-0 text-center text-base font-black text-vt-text hover:text-vt-accent hover:underline sm:text-xl min-[1440px]:absolute min-[1440px]:left-[80px] min-[1440px]:top-[40px] min-[1440px]:w-[200px] min-[1440px]:text-right min-[1440px]:text-[28px]"
          to={`/teams/${match.homeTeamId}` as string}
        >
          {match.homeTeamName}
        </Link>
        <span
          className="col-start-1 row-start-2 text-center text-[44px] font-black leading-none text-vt-accent min-[1440px]:absolute min-[1440px]:left-[320px] min-[1440px]:top-[40px] min-[1440px]:w-[100px] min-[1440px]:text-right min-[1440px]:text-[56px]"
          data-testid="current-score-home"
        >
          {detail.currentScore.home}
        </span>
        <span
          aria-hidden="true"
          className="col-start-2 row-start-2 text-xl font-bold text-vt-muted min-[1440px]:absolute min-[1440px]:left-[640px] min-[1440px]:top-[56px] min-[1440px]:w-[80px] min-[1440px]:text-center min-[1440px]:text-2xl"
        >
          vs
        </span>
        <span
          className="col-start-3 row-start-2 text-center text-[44px] font-black leading-none text-vt-text min-[1440px]:absolute min-[1440px]:left-[1020px] min-[1440px]:top-[40px] min-[1440px]:w-[100px] min-[1440px]:text-left min-[1440px]:text-[56px]"
          data-testid="current-score-away"
        >
          {detail.currentScore.away}
        </span>
        <Link
          className="col-start-3 row-start-1 min-w-0 text-center text-base font-black text-vt-text hover:text-vt-accent hover:underline sm:text-xl min-[1440px]:absolute min-[1440px]:left-[1160px] min-[1440px]:top-[40px] min-[1440px]:w-[200px] min-[1440px]:text-left min-[1440px]:text-[28px]"
          to={`/teams/${match.awayTeamId}` as string}
        >
          {match.awayTeamName}
        </Link>
        <p className="col-span-3 row-start-3 text-center text-xs font-bold text-vt-muted sm:text-sm min-[1440px]:absolute min-[1440px]:left-[600px] min-[1440px]:top-[140px] min-[1440px]:w-[240px]">
          Set {currentSetNumber} · {detail.currentScore.home}-{detail.currentScore.away} · Saque: {servingTeamName}
        </p>
      </div>
    </section>
  );
}

function CourtRotations({
  rotations,
}: {
  rotations: LiveMatchDetailFixture["rotations"];
}) {
  return (
    <section
      aria-labelledby="court-rotations-heading"
      className="relative mt-[30px] rounded-2xl border border-vt-raised bg-vt-surface p-4 sm:p-6 min-[1440px]:h-[510px] min-[1440px]:p-0"
      data-testid="court-rotations"
    >
      <h2
        className="text-lg font-bold text-vt-text min-[1440px]:absolute min-[1440px]:left-6 min-[1440px]:top-6"
        id="court-rotations-heading"
      >
        Rotaciones en cancha
      </h2>
      <p className="sr-only">
        La línea central separa ambos campos y cada lado incluye su línea de ataque.
      </p>
      <div
        className="relative mt-5 grid min-h-[360px] grid-cols-2 overflow-hidden rounded border-2 border-vt-raised-border bg-vt-raised min-[1440px]:absolute min-[1440px]:left-6 min-[1440px]:top-[70px] min-[1440px]:mt-0 min-[1440px]:block min-[1440px]:h-[400px] min-[1440px]:min-h-0 min-[1440px]:w-[1320px]"
        data-testid="court-graphic"
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 z-0 w-0.5 bg-white"
          data-testid="volleyball-net"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/3 z-0 w-0.5 bg-vt-muted"
          data-testid="attack-line"
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-2/3 z-0 w-0.5 bg-vt-muted"
          data-testid="attack-line"
        />
        <TeamCourtPositions rotation={rotations[0]} side="home" />
        <TeamCourtPositions rotation={rotations[1]} side="away" />
      </div>
    </section>
  );
}

function TeamCourtPositions({
  rotation,
  side,
}: {
  rotation: LiveTeamRotationFixture;
  side: "home" | "away";
}) {
  const positionClasses = side === "home" ? homePositionClasses : awayPositionClasses;

  return (
    <ol
      aria-label={`${rotation.teamName}, rotación actual`}
      className="relative z-10 grid list-none grid-cols-2 grid-rows-3 place-items-center gap-x-2 gap-y-6 p-4 sm:gap-8 sm:p-8 min-[1440px]:contents"
      data-testid="court-position-grid"
    >
      {rotation.positions.map((player, index) => (
        <li
          aria-label={`${rotation.teamName}, posición ${player.position}: ${player.playerName}, número ${player.number}`}
          className={`flex size-12 items-center justify-center min-[1440px]:absolute min-[1440px]:size-8 ${positionClasses[index]}`}
          data-position={player.position}
          data-testid="court-position"
          key={player.position}
        >
          <span
            aria-hidden="true"
            className={`flex size-8 items-center justify-center rounded-full text-xs font-bold text-white ${side === "home" ? "bg-vt-accent" : "bg-blue-500"}`}
          >
            {player.number}
          </span>
          <span className="sr-only">{player.playerName}</span>
        </li>
      ))}
    </ol>
  );
}

function TeamStatistics({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;

  return (
    <section
      className="overflow-hidden rounded-2xl bg-vt-surface px-4 pb-5 pt-5 sm:px-[30px] min-[1440px]:h-[280px] min-[1440px]:px-[30px] min-[1440px]:pb-[30px]"
      data-testid="team-statistics"
    >
      <h2 className="text-lg font-black leading-[22px] text-vt-text">
        Estadísticas del partido
      </h2>
      <dl className="mt-[18px] space-y-2.5">
        {detail.teamStats.map((stat) => {
          const isError = stat.label === "Errores no forzados";
          const homeClass = isError
            ? "text-vt-danger"
            : stat.home > stat.away
              ? "text-vt-accent"
              : "text-vt-text";
          const awayClass = isError
            ? "text-vt-danger"
            : stat.away > stat.home
              ? "text-vt-accent"
              : "text-vt-text";

          return (
            <div
              className="grid h-10 grid-cols-[minmax(0,1fr)_64px_64px] items-center gap-2 rounded-lg bg-vt-panel px-3 min-[1440px]:grid-cols-[180px_80px_1fr_80px] min-[1440px]:gap-5 min-[1440px]:px-5"
              key={stat.label}
            >
              <dt className="truncate text-xs text-vt-muted">{stat.label}</dt>
              <dd
                aria-label={`${match.homeTeamName}: ${stat.home}`}
                className={`text-right text-sm font-black ${homeClass}`}
                data-testid={isError ? "team-stat-errors-home" : undefined}
              >
                {stat.home}
              </dd>
              <dd
                aria-label={`${match.awayTeamName}: ${stat.away}`}
                className={`text-right text-sm font-black min-[1440px]:col-start-4 ${awayClass}`}
                data-testid={isError ? "team-stat-errors-away" : undefined}
              >
                {stat.away}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

function PlayerStatistics({ detail }: { detail: LiveMatchDetailFixture }) {
  return (
    <section
      className="overflow-hidden rounded-2xl bg-vt-surface px-4 pb-5 pt-5 sm:px-[30px] min-[1440px]:h-[280px] min-[1440px]:px-[30px] min-[1440px]:pb-[30px]"
      data-testid="player-statistics"
    >
      <h2 className="text-lg font-black leading-[22px] text-vt-text">Mejores jugadores</h2>
      <ol
        aria-label="Líderes de puntos del partido en vivo"
        className="mt-[18px] list-none space-y-2.5"
      >
        {detail.playerLeaders.map((leader) => {
          const isLeader = leader.rank === 1;
          const rankColor = isLeader ? "text-vt-accent" : "text-vt-text";

          return (
            <li
              aria-label={`${leader.rank}. ${leader.playerName}, ${leader.teamName}, ${leader.points} puntos`}
              className="relative grid h-[50px] grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 rounded-lg bg-vt-panel px-3 min-[1440px]:block min-[1440px]:px-0"
              key={`${leader.rank}-${leader.playerName}`}
            >
              <span
                className={`text-xs font-black min-[1440px]:absolute min-[1440px]:left-5 min-[1440px]:top-[17px] ${rankColor}`}
                data-testid={`player-leader-rank-${leader.rank}`}
              >
                {leader.rank}
              </span>
              <span className="truncate text-xs font-bold text-vt-text min-[1440px]:absolute min-[1440px]:left-[60px] min-[1440px]:top-[17px] min-[1440px]:w-[180px]">
                {leader.playerName}
              </span>
              <span className="hidden text-xs text-vt-muted sm:block min-[1440px]:absolute min-[1440px]:left-[300px] min-[1440px]:top-[17px] min-[1440px]:w-[180px]">
                {leader.teamName}
              </span>
              <span
                className={`text-right text-sm font-black min-[1440px]:absolute min-[1440px]:right-5 min-[1440px]:top-[17px] min-[1440px]:w-[60px] ${rankColor}`}
                data-testid={`player-leader-points-${leader.rank}`}
              >
                {leader.points} pts
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function LiveEvents({ detail }: { detail: LiveMatchDetailFixture }) {
  return (
    <section
      aria-labelledby="live-events-heading"
      className="mt-[30px] overflow-hidden rounded-2xl bg-vt-surface px-4 pb-5 pt-5 sm:px-[30px] min-[1440px]:h-[250px] min-[1440px]:px-[30px]"
      data-testid="live-events"
    >
      <h2 className="text-lg font-black leading-[22px] text-vt-text" id="live-events-heading">
        Eventos en vivo
      </h2>
      <ol className="mt-[18px] list-none space-y-2.5">
        {detail.events.map((event) => (
          <li
            className="grid min-h-10 gap-2 rounded-lg bg-vt-panel px-4 py-2 sm:grid-cols-[80px_minmax(0,1.2fr)_minmax(0,1fr)_auto] sm:items-center min-[1440px]:h-10 min-[1440px]:min-h-0 min-[1400px]:grid-cols-[120px_240px_840px_108px]! min-[1440px]:px-0 min-[1440px]:py-0"
            data-testid="live-event"
            key={event.id}
          >
            <time className="text-[11px] text-vt-muted">{event.time}</time>
            <div
              className={`border-l-[6px] pl-3 ${event.outcome === "error" ? "border-vt-danger" : "border-vt-accent"}`}
            >
              <p className="truncate text-xs font-bold text-vt-text">
                {event.playerName} · {event.teamName}
              </p>
            </div>
            <p className="text-xs text-vt-muted">{event.eventType}</p>
            <span
              className={`text-right text-xs font-black ${event.outcome === "error" ? "text-vt-text" : "text-vt-accent"}`}
            >
              {event.matchContext.split(" · ").at(-1)}
            </span>
            <span className="sr-only">{event.matchContext}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function MatchMetadata({
  match,
  servingTeamName,
  tournamentName,
}: {
  match: MatchFixture;
  servingTeamName?: string;
  tournamentName: string;
}) {
  return (
    <Card className="mt-[30px]">
      <h2 className="text-lg font-bold text-vt-text">
        Información del partido
      </h2>
      <dl className="mt-5 grid gap-5 sm:grid-cols-2 min-[1440px]:grid-cols-3">
        <SummaryDetail label="Torneo" value={tournamentName} />
        <SummaryDetail label="Estado" value={match.badgeLabel} />
        <SummaryDetail label="Sede" value={match.venue} />
        <SummaryDetail label="Horario" value={match.scheduledLabel} />
        {servingTeamName ? (
          <SummaryDetail label="Saque" value={servingTeamName} />
        ) : null}
        <SummaryDetail label="Identificador" value={match.id} />
      </dl>
    </Card>
  );
}

function ScheduledMatchDetail({ match }: { match: MatchFixture }) {
  const tournamentName = tournamentNameFor(match);

  return (
    <>
      <Card variant="raised">
        <h2 className="text-lg font-bold text-vt-text">
          Cobertura todavía no disponible
        </h2>
        <p className="mt-2 text-sm text-vt-muted">
          La cobertura en vivo todavía no está disponible para este partido.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <TeamLink id={match.homeTeamId} name={match.homeTeamName} />
          <span aria-hidden="true" className="text-vt-muted">vs</span>
          <TeamLink id={match.awayTeamId} name={match.awayTeamName} />
        </div>
      </Card>
      <MatchMetadata match={match} tournamentName={tournamentName} />
    </>
  );
}

function TeamLink({ id, name }: { id: string; name: string }) {
  return (
    <Link
      className="font-semibold text-vt-accent hover:underline"
      to={`/teams/${id}` as string}
    >
      {name}
    </Link>
  );
}

function SummaryDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.08em] text-vt-muted">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-vt-text">{value}</dd>
    </div>
  );
}
