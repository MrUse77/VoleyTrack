import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { PUBLIC_TOURNAMENTS, type TournamentFixture, type TournamentStatLeaderFixture } from "../../fixtures";

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

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

export function TournamentStatsPage() {
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
            <h2 className="mt-4 text-3xl font-black text-vt-text">Estadísticas</h2>
            <p className="mt-2 text-sm text-vt-muted">Líderes individuales · Temporada regular</p>
          </div>
          <div className="grid min-w-[280px] flex-1 gap-3 sm:grid-cols-3">
            <SummaryStat label="Partidos" value="9" />
            <SummaryStat label="Sets" value="38" />
            <SummaryStat label="Puntos" value="1.247" />
          </div>
        </div>
      </Card>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab, index) => (
            <Link
              aria-current={index === 3 ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 3 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
          <span className="ml-auto px-3 text-sm text-vt-muted">Actualizado hace 1 min</span>
        </div>
      </nav>

      <section aria-label="Líderes estadísticos">
        <h2 className="mb-4 text-xl font-bold text-vt-accent">Líderes del torneo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tournament.statLeaders.map((leader) => (
            <StatLeaderCard key={leader.category} leader={leader} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatLeaderCard({ leader }: { leader: TournamentStatLeaderFixture }) {
  return (
    <Card className="border-vt-border bg-vt-raised p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">{leader.category}</p>
      {leader.playerId ? <Link className="mt-3 block text-lg font-black text-vt-text hover:underline" to={`/players/${leader.playerId}` as string}>{leader.playerName}</Link> : <p className="mt-3 text-lg font-black text-vt-text">{leader.playerName}</p>}
      {leader.teamId ? <Link className="mt-1 inline-block text-xs text-vt-muted hover:text-vt-text" to={`/teams/${leader.teamId}` as string}>{leader.teamName}</Link> : <p className="mt-1 text-xs text-vt-muted">{leader.teamName}</p>}
      <p className="mt-4 text-3xl font-black text-vt-accent">
        {leader.value} <span className="text-base font-semibold text-vt-muted">{leader.unit}</span>
      </p>
    </Card>
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
