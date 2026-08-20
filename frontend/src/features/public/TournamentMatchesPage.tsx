import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_MATCHES, PUBLIC_TOURNAMENTS, type MatchFixture, type TournamentFixture } from "../../fixtures";

const tournamentTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
  { label: "Cuadro", suffix: "/bracket" },
] as const;

const statusVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
} as const;

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

function findTournamentMatches(id: string): readonly MatchFixture[] {
  return [PUBLIC_MATCHES.live, PUBLIC_MATCHES.today, PUBLIC_MATCHES.upcoming, PUBLIC_MATCHES.finished]
    .flat()
    .filter((match) => match.tournamentId === id);
}

export function TournamentMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Torneo no encontrado</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to="/tournaments">
          ← Volver a torneos
        </Link>
      </Card>
    );
  }

  const matches = findTournamentMatches(tournament.id);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link className="text-sm font-semibold text-vt-accent" to="/tournaments">
            ← Torneos
          </Link>
          <p className="mt-5 text-sm text-vt-muted">Torneos / {tournament.name}</p>
          <h1 className="mt-2 text-3xl font-black text-vt-text">{tournament.name}</h1>
        </div>
        <div className="rounded-xl border border-vt-border bg-vt-raised px-4 py-2 text-sm text-vt-muted">
          {tournament.statusLabel} · {tournament.dateLabel}
        </div>
      </header>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab, index) => (
            <Link
              aria-current={index === 1 ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 1 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
          <span className="ml-auto px-3 text-sm text-vt-muted">Datos dentro de {tournament.name}</span>
        </div>
      </nav>

      <Card className="border-vt-border p-5" variant="raised">
        <h2 className="text-xl font-bold text-vt-accent">Partidos del Torneo</h2>
        <div className="mt-5 space-y-3">
          {matches.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function MatchRow({ match }: { match: MatchFixture }) {
  return (
    <Link
      className="block rounded-xl border border-vt-border bg-vt-panel p-4 transition hover:border-vt-accent"
      data-testid="tournament-match-row"
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
        <p className={`text-base font-black ${match.status === "live" ? "text-vt-danger" : match.score ? "text-vt-success" : "text-vt-text"}`}>
          {match.score ? `${match.score.home} - ${match.score.away}` : "Programado"}
        </p>
      </div>
    </Link>
  );
}
