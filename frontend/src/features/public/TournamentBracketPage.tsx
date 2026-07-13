import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { PUBLIC_TOURNAMENTS, type TournamentBracketMatchFixture, type TournamentFixture } from "../../fixtures";

const tournamentTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
  { label: "Cuadro", suffix: "/bracket" },
] as const;

const statusVariants = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

const matchStatusVariants = {
  played: "default",
  live: "success",
  upcoming: "accent",
} as const;

const matchStatusLabel = {
  played: "Final",
  live: "En vivo",
  upcoming: "Pendiente",
} as const;

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

function renderScore(score: number | null): string {
  return score === null ? "-" : String(score);
}

export function TournamentBracketPage() {
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={tournament.name}
        description={`Torneos / ${tournament.name}`}
        actions={
          <div className="rounded-xl border border-vt-border bg-vt-raised px-4 py-2 text-sm text-vt-muted">
            {tournament.statusLabel} · {tournament.dateLabel}
          </div>
        }
      />

      <Card className="border-vt-border bg-vt-raised p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Badge variant={statusVariants[tournament.status]}>{tournament.statusLabel}</Badge>
            <h2 className="mt-4 text-3xl font-black text-vt-text">Cuadro del torneo</h2>
            <p className="mt-2 text-sm text-vt-muted">Eliminación directa · 8 equipos · Cuartos → Final</p>
          </div>
          <div className="grid min-w-[280px] flex-1 gap-3 sm:grid-cols-3">
            <SummaryStat label="Rondas" value="3" />
            <SummaryStat label="Equipos" value="8" />
            <SummaryStat label="Partidos" value="7" />
          </div>
        </div>
      </Card>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab, index) => (
            <Link
              aria-current={index === 4 ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 4 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
          <span className="ml-auto px-3 text-sm text-vt-muted">Llave actualizada</span>
        </div>
      </nav>

      <section aria-label="Cuadro del torneo">
        <h2 className="mb-4 text-xl font-bold text-vt-accent">Cuadro de eliminación</h2>
        <div className="space-y-6">
          {tournament.bracketRounds.map((round) => (
            <div key={round.round}>
              <h3 className="mb-3 text-lg font-bold text-vt-text">{round.round}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {round.matches.map((match) => (
                  <BracketMatchCard key={match.displayId} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BracketMatchCard({ match }: { match: TournamentBracketMatchFixture }) {
  return (
    <Card className="border-vt-border bg-vt-raised p-4">
      <div className="flex items-center justify-between">
        <Badge variant={matchStatusVariants[match.status]}>{matchStatusLabel[match.status]}</Badge>
        {match.matchId ? <Link className="text-[11px] font-semibold uppercase tracking-[0.08em] text-vt-muted hover:text-vt-text" to={`/matches/${match.matchId}/live` as string}>ID {match.displayId}</Link> : <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-vt-muted">ID {match.displayId}</span>}
      </div>
      <dl className="mt-4 space-y-2">
        <BracketTeamRow id={match.homeTeamId} name={match.homeTeamName} score={renderScore(match.homeScore)} highlight={match.homeScore !== null && match.homeScore > (match.awayScore ?? 0)} />
        <BracketTeamRow id={match.awayTeamId} name={match.awayTeamName} score={renderScore(match.awayScore)} highlight={match.awayScore !== null && match.awayScore > (match.homeScore ?? 0)} />
      </dl>
    </Card>
  );
}

function BracketTeamRow({ id, name, score, highlight }: { id?: string; name: string; score: string; highlight: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-vt-panel px-3 py-2">
      {id ? <Link className={`text-sm font-semibold hover:underline ${highlight ? "text-vt-text" : "text-vt-muted"}`} to={`/teams/${id}` as string}>{name}</Link> : <span className={`text-sm font-semibold ${highlight ? "text-vt-text" : "text-vt-muted"}`}>{name}</span>}
      <span className={`text-sm font-black ${highlight ? "text-vt-accent" : "text-vt-muted"}`}>{score}</span>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-vt-border bg-vt-panel p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">{label}</p>
      <p className="mt-2 text-2xl font-black text-vt-text">{value}</p>
    </div>
  );
}
