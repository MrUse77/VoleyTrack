import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_MATCHES, PUBLIC_TEAMS, type MatchFixture, type TeamFixture } from "../../fixtures";

const teamTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Plantel", suffix: "/roster" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

const statusVariants = { finished: "default", live: "success", today: "accent", upcoming: "default" } as const;

function findTeam(id: string): TeamFixture | undefined {
  return PUBLIC_TEAMS.find((team) => team.id === id);
}

function findTeamMatches(id: string): readonly MatchFixture[] {
  return [PUBLIC_MATCHES.live, PUBLIC_MATCHES.today, PUBLIC_MATCHES.upcoming, PUBLIC_MATCHES.finished]
    .flat()
    .filter((match) => match.homeTeamId === id || match.awayTeamId === id);
}

export function TeamMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const team = findTeam(id);

  if (!team) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Equipo no encontrado</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={"/teams" as string}>
          ← Volver a equipos
        </Link>
      </Card>
    );
  }

  const matches = findTeamMatches(team.id);

  return (
    <div className="space-y-6">
      <header>
        <Link className="text-sm font-semibold text-vt-accent" to={"/teams" as string}>
          ← Equipos
        </Link>
        <p className="mt-5 text-sm text-vt-muted">Equipos / {team.name}</p>
        <h1 className="mt-2 text-3xl font-black text-vt-text">{team.name}</h1>
        <p className="mt-2 text-sm text-vt-muted">{team.city} · {team.category}</p>
      </header>

      <nav aria-label="Navegación del equipo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap gap-2">
          {teamTabs.map((tab) => {
            const isActive = tab.suffix === "/matches";
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${isActive ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
                key={tab.label}
                to={`/teams/${team.id}${tab.suffix}` as string}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Card>
        <h2 className="text-xl font-bold text-vt-accent">Partidos del equipo</h2>
        {matches.length > 0 ? (
          <div className="mt-5 space-y-3">
            {matches.map((match) => <MatchRow key={match.id} match={match} />)}
          </div>
        ) : (
          <p className="mt-4 text-sm text-vt-muted">No hay partidos registrados para este equipo.</p>
        )}
      </Card>
    </div>
  );
}

function MatchRow({ match }: { match: MatchFixture }) {
  return (
    <Link
      className="block rounded-xl border border-vt-border bg-vt-panel p-4 transition hover:border-vt-accent"
      data-testid="team-match-row"
      to={`/matches/${match.id}/live` as string}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-[130px] items-center gap-2">
          <Badge variant={statusVariants[match.status]}>{match.badgeLabel}</Badge>
          <span className="text-xs font-semibold text-vt-muted">{match.scheduledLabel}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-vt-text">{match.homeTeamName} vs {match.awayTeamName}</p>
          <p className="mt-1 text-xs text-vt-muted">{match.venue}</p>
        </div>
        <p className="text-base font-black text-vt-text">{match.score ? `${match.score.home} - ${match.score.away}` : "Programado"}</p>
      </div>
    </Link>
  );
}
