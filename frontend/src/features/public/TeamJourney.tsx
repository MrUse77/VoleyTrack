import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_MATCHES,
  PUBLIC_PLAYERS,
  PUBLIC_TEAM_DETAILS,
  PUBLIC_TEAMS,
  type MatchFixture,
  type TeamDetailFixture,
  type TeamFixture,
  type TeamRosterStatFixture,
} from "../../fixtures";

export type TeamRouteTab = "overview" | "roster" | "matches" | "stats";

const teamTabs = [
  { id: "overview", label: "Resumen", suffix: "", widthClass: "w-[92px]" },
  { id: "roster", label: "Plantel", suffix: "/roster", widthClass: "w-[86px]" },
  { id: "matches", label: "Partidos", suffix: "/matches", widthClass: "w-[92px]" },
  { id: "stats", label: "Estadísticas", suffix: "/stats", widthClass: "w-[104px]" },
] as const;

export type TeamJourneyContext = Readonly<{
  team: TeamFixture;
  detail?: TeamDetailFixture;
}>;

// Shared fixture selectors live with the journey component to keep this bounded slice in one local module.
// eslint-disable-next-line react-refresh/only-export-components
export function findTeamJourney(id: string): TeamJourneyContext | undefined {
  const team = PUBLIC_TEAMS.find((item) => item.id === id);
  if (!team) return undefined;

  return {
    team,
    detail: PUBLIC_TEAM_DETAILS.find((item) => item.teamId === team.id),
  };
}

export type TeamRosterPlayer = Readonly<{
  id: string;
  fullName: string;
  number: number;
  position: string;
  detailId?: string;
}>;

export type TeamRosterRow = Readonly<{
  player: TeamRosterPlayer;
  stats?: TeamRosterStatFixture;
}>;

export type TeamMatchRow = Readonly<{
  match: MatchFixture;
  resultLabel: string;
  contextLabel: string;
}>;

// eslint-disable-next-line react-refresh/only-export-components
export function teamRosterRows(context: TeamJourneyContext): readonly TeamRosterRow[] {
  if (context.detail) {
    return context.detail.rosterStats.map((stats) => ({
      player: {
        id: stats.id,
        fullName: stats.fullName,
        number: stats.number,
        position: stats.position,
        ...(stats.playerDetailId ? { detailId: stats.playerDetailId } : {}),
      },
      stats,
    }));
  }

  return context.team.rosterPlayerIds.flatMap((playerId) => {
    const player = PUBLIC_PLAYERS.find((item) => item.id === playerId);
    return player
      ? [{
          player: {
            id: player.id,
            fullName: player.fullName,
            number: player.number,
            position: player.position,
            detailId: player.id,
          },
        }]
      : [];
  });
}

// eslint-disable-next-line react-refresh/only-export-components
export function teamMatchRows(context: TeamJourneyContext): readonly TeamMatchRow[] {
  const allMatches = Object.values(PUBLIC_MATCHES).flat();

  if (context.detail) {
    return context.detail.matches.map((reference) => ({
      match: reference.match,
      resultLabel: reference.resultLabel,
      contextLabel: reference.contextLabel,
    }));
  }

  return allMatches
    .filter((match) => match.homeTeamId === context.team.id || match.awayTeamId === context.team.id)
    .map((match) => ({
      match,
      resultLabel: match.status === "live"
        ? "EN VIVO"
        : match.status === "finished"
          ? "FINALIZADO"
          : "PRÓXIMO",
      contextLabel: match.scheduledLabel,
    }));
}

export function TeamPlayerName({
  children,
  className,
  player,
}: {
  children?: ReactNode;
  className: string;
  player: TeamRosterPlayer;
}) {
  const content = children ?? player.fullName;

  return player.detailId ? (
    <Link
      className={`${className} hover:text-vt-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent`}
      data-player-id={player.id}
      to={`/players/${player.detailId}` as string}
    >
      {content}
    </Link>
  ) : (
    <span className={className} data-player-id={player.id}>{content}</span>
  );
}

export function TeamNotFound() {
  return (
    <StateBoundary>
      <Card data-testid="team-not-found">
        <h1 className="text-2xl font-bold text-vt-text">Equipo no encontrado</h1>
        <Link
          className="mt-4 inline-block text-sm font-semibold text-vt-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={"/teams" as string}
        >
          ← Volver a equipos
        </Link>
      </Card>
    </StateBoundary>
  );
}

type TeamJourneyProps = TeamJourneyContext & Readonly<{
  activeTab: TeamRouteTab;
  children: ReactNode;
}>;

export function TeamJourney({ activeTab, children, detail, team }: TeamJourneyProps) {
  const initials = detail?.initials ?? teamInitials(team.name);
  const meta = detail
    ? `${detail.tournamentName} · ${detail.matchesPlayed} partidos jugados · ${detail.points} puntos`
    : `${team.category} · ${team.city}`;

  return (
    <StateBoundary>
      <div
        className="w-full max-w-[1104px] min-[1416px]:-mt-1 min-[1428px]:ml-1 min-[1600px]:mx-auto"
        data-testid="team-journey-content"
      >
        <Card
          aria-labelledby="team-name"
          className="relative p-6 min-[1416px]:h-[150px] min-[1416px]:rounded-[18px] min-[1416px]:p-0"
          data-testid="team-hero"
          variant="raised"
        >
          <div className="flex flex-col gap-6 min-[1416px]:block min-[1416px]:h-full">
            <div className="flex min-w-0 items-center gap-5 min-[1416px]:contents">
              <div
                aria-hidden="true"
                className="flex size-[84px] shrink-0 items-center justify-center rounded-2xl border border-vt-border bg-vt-panel text-2xl font-black text-vt-accent min-[1416px]:absolute min-[1416px]:left-6 min-[1416px]:top-[26px] min-[1416px]:rounded-[24px]"
              >
                {initials}
              </div>
              <div className="min-w-0 min-[1416px]:absolute min-[1416px]:left-32 min-[1416px]:top-7">
                <p className="inline-flex min-h-6 items-center rounded-full bg-vt-accent/15 px-3 text-[11px] font-black tracking-[0.08em] text-vt-accent min-[1416px]:h-6 min-[1416px]:bg-vt-accent min-[1416px]:text-[9px] min-[1416px]:text-vt-background">
                  {detail?.standingLabel ?? "EQUIPO"}
                </p>
                <h1 className="mt-2 text-3xl font-black leading-tight text-vt-text min-[1416px]:mt-3 min-[1416px]:text-[30px] min-[1416px]:leading-9 min-[1416px]:tracking-[-0.8px]" id="team-name">
                  {team.name}
                </h1>
                <p className="mt-2 text-sm text-vt-muted min-[1416px]:mt-[6px] min-[1416px]:text-xs min-[1416px]:leading-4">{meta}</p>
              </div>
            </div>

            <dl
              className="grid grid-cols-3 gap-3 min-[1416px]:absolute min-[1416px]:left-[612px] min-[1416px]:top-[34px] min-[1416px]:w-[396px] min-[1416px]:grid-cols-[repeat(3,116px)] min-[1416px]:gap-6"
              data-testid="team-hero-metrics"
            >
              <HeroMetric label="GANADOS" value={detail ? String(detail.wins) : "—"} />
              <HeroMetric label="SETS" value={detail?.sets ?? "—"} />
              <HeroMetric accent label="PUNTOS" value={detail ? String(detail.points) : "—"} />
            </dl>
          </div>
        </Card>

        <nav
          aria-label="Navegación del equipo"
          className="mt-6 min-h-[44px] rounded-[14px] border border-vt-border bg-vt-raised px-3 py-2 min-[1416px]:h-11"
          data-testid="team-tabs"
        >
          <div className="flex flex-wrap items-center gap-3">
            {teamTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex h-7 items-center justify-center rounded-full px-4 text-[11px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${tab.widthClass} ${isActive ? "bg-vt-accent text-vt-background" : "bg-vt-panel text-vt-muted hover:text-vt-text"}`}
                  key={tab.id}
                  to={`/teams/${team.id}${tab.suffix}` as string}
                >
                  {tab.label}
                </Link>
              );
            })}
            <p className="basis-full pt-1 text-[11px] text-vt-muted min-[1416px]:ml-auto min-[1416px]:mr-3 min-[1416px]:w-[210px] min-[1416px]:basis-auto min-[1416px]:pt-0 min-[1416px]:text-right">
              {detail ? `Datos dentro de ${detail.tournamentName}` : "Datos registrados del equipo"}
            </p>
          </div>
        </nav>

        <div className="mt-6 min-[1416px]:mt-7">{children}</div>
      </div>
    </StateBoundary>
  );
}

function HeroMetric({ accent = false, label, value }: { accent?: boolean; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-vt-border bg-vt-panel px-3 py-3 text-center min-[1416px]:h-[82px] min-[1416px]:px-4 min-[1416px]:py-[14px] min-[1416px]:text-left">
      <dt className="text-[10px] font-bold leading-3 tracking-[0.08em] text-vt-muted">{label}</dt>
      <dd className={`mt-1 text-2xl font-black min-[1416px]:mt-2 min-[1416px]:text-[28px] min-[1416px]:leading-[34px] ${accent ? "text-vt-accent" : "text-vt-text"}`}>{value}</dd>
    </div>
  );
}

function teamInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
