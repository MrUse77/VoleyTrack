import type { ReactNode } from "react";
import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { StatePill, type MatchStatus as PillStatus } from "../../components/primitives/StatePill";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_LIVE_MATCH_DETAILS,
  PUBLIC_MATCHES,
  PUBLIC_TOURNAMENTS,
  type LiveMatchDetailFixture,
  type MatchFixture,
  type MatchStatus,
} from "../../fixtures";
import { LiveMatchPresentation, MatchMetadataPanel } from "./LiveMatchPresentation";

const ALL_MATCHES: readonly MatchFixture[] = [
  ...PUBLIC_MATCHES.upcoming,
  ...PUBLIC_MATCHES.live,
  ...PUBLIC_MATCHES.today,
  ...PUBLIC_MATCHES.finished,
];

/**
 * The fixture's match status and the design's pill states are different vocabularies
 * (frontend/design/html/voleytrack.css:84-87 is programado / en vivo / finalizado), so the
 * fixture's confirmed-today state renders the design's "Programado" pill — the same mapping
 * the public dashboard and matches screens use.
 */
const pillStatusByMatchStatus: Record<MatchStatus, PillStatus> = {
  finished: "finalizado",
  live: "envivo",
  today: "programado",
  upcoming: "programado",
};

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

/**
 * The focused, standalone view of one match. It deliberately renders its own shell instead
 * of the public shell (see `router.test.tsx`, "renders the live-detail route as a
 * standalone shell without the public sidebar"): the route is reached from the matches
 * list and from the dashboard's live card, and stripping the public chrome keeps one
 * match's scoreboard, court and timeline the whole page. The public shell's `En vivo`
 * destination lives at `/live` and reuses the same presentation without losing the nav.
 */
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
          <LiveMatchPresentation detail={detail} />
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
            className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-vt-surface-2 px-3 text-xs font-bold text-vt-accent transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent min-[1440px]:h-8 min-[1440px]:w-[120px]"
            data-testid="live-match-back-control"
            to="/matches"
          >
            ← Volver
          </Link>
          <h1 className="min-w-0 truncate text-sm font-black text-vt-text sm:text-lg">
            {title}
          </h1>
          {/*
           * The header status is the design's state pill rather than this screen's own
           * hand-rolled chip, so the state word and its treatment come from one place.
           */}
          <span
            className="flex min-w-0 items-center justify-center min-[1440px]:w-[204px]"
            data-testid="live-match-header-status"
          >
            <StatePill
              label={match ? undefined : "Sin datos"}
              status={match ? pillStatusByMatchStatus[match.status] : "programado"}
            />
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
    <Card padded={false}>
      <CardHeader>
        <h2 className="text-[14px] font-extrabold tracking-[-0.01em]">Partido no encontrado</h2>
      </CardHeader>
      <CardBody>
        <p className="text-[13px] text-vt-muted">
          No existe un partido público con este identificador.
        </p>
        <div className="mt-4">
          <Link className={buttonClasses("surface")} to="/matches">
            Ver todos los partidos
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}

function ScheduledMatchDetail({ match }: { match: MatchFixture }) {
  const tournamentName = tournamentNameFor(match);

  return (
    <>
      <Card data-testid="scheduled-match-detail" padded={false}>
        <CardHeader>
          <h2 className="text-[14px] font-extrabold tracking-[-0.01em]">
            Cobertura todavía no disponible
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-[13px] text-vt-muted">
            La cobertura en vivo todavía no está disponible para este partido.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px]">
            <TeamLink id={match.homeTeamId} name={match.homeTeamName} />
            <span aria-hidden="true" className="text-vt-muted">vs</span>
            <TeamLink id={match.awayTeamId} name={match.awayTeamName} />
          </div>
          <div className="mt-4">
            <Link className={buttonClasses("surface")} to="/matches">
              ← Volver
            </Link>
          </div>
        </CardBody>
      </Card>
      <MatchMetadataPanel match={match} tournamentName={tournamentName} />
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
