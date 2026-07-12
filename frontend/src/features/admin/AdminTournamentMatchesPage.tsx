import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { ADMIN, type AdminMatchFixture, type AdminTournamentFixture } from "../../fixtures";

const tournamentTabs = [
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

const statusVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
} as const;

function findTournament(id: string): AdminTournamentFixture | undefined {
  return ADMIN.tournaments.find((tournament) => tournament.id === id);
}

function findTournamentMatches(id: string): readonly AdminMatchFixture[] {
  return ADMIN.matches.filter((match) => match.tournamentId === id);
}

export function AdminTournamentMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Torneo no encontrado</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={"/admin/tournaments" as string}>
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
          <Link className="text-sm font-semibold text-vt-accent" to={"/admin/tournaments" as string}>
            ← Torneos
          </Link>
          <p className="mt-5 text-sm text-vt-muted">Administración / Torneos / {tournament.name}</p>
          <h1 className="mt-2 text-3xl font-black text-vt-text">{tournament.name}</h1>
        </div>
        <div className="rounded-xl border border-vt-border bg-vt-raised px-4 py-2 text-sm text-vt-muted">
          {tournament.category} · {tournament.statusLabel}
        </div>
      </header>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab) => (
            <Link
              aria-current={tab.suffix === "/matches" ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab.suffix === "/matches" ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/admin/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <Card className="border-vt-border bg-vt-raised p-5">
        <h2 className="text-xl font-bold text-vt-accent">Partidos del torneo</h2>
        <div className="mt-5 space-y-3">
          {matches.length === 0 ? (
            <p className="text-sm text-vt-muted">Este torneo todavía no tiene partidos programados.</p>
          ) : (
            matches.map((match) => <MatchRow key={match.id} match={match} />)
          )}
        </div>
      </Card>
    </div>
  );
}

function MatchRow({ match }: { match: AdminMatchFixture }) {
  return (
    <article className="rounded-xl border border-vt-border bg-vt-panel p-4" data-testid="admin-tournament-match-row">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex min-w-[130px] items-center gap-2">
          <Badge variant={statusVariants[match.status]}>{match.statusLabel}</Badge>
          <span className="text-xs font-semibold text-vt-muted">{match.scheduledLabel}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-vt-text">{match.homeTeamName} vs {match.awayTeamName}</p>
          <p className="mt-1 text-xs text-vt-muted">{match.venue}</p>
        </div>
      </div>
    </article>
  );
}
