import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";

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

export function TournamentDetailPage() {
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
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link className="text-sm font-semibold text-vt-accent" to="/tournaments">
            ← Torneos
          </Link>
          <p className="mt-5 text-sm text-vt-muted">Torneos / {tournament.name}</p>
          <h1 className="mt-2 text-3xl font-black text-vt-text">{tournament.name}</h1>
        </div>
        <div className="rounded-xl border border-vt-border bg-vt-raised px-4 py-2 text-sm text-vt-muted">
          Actualizado hace 1 min
        </div>
      </header>

      <Card className="border-vt-border bg-vt-raised p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Badge variant={statusVariants[tournament.status]}>{tournament.statusLabel}</Badge>
            <h2 className="mt-4 text-3xl font-black text-vt-text">Resumen del torneo</h2>
            <p className="mt-2 text-sm text-vt-muted">{tournament.category} · {tournament.dateLabel}</p>
          </div>
          <div className="grid min-w-[280px] flex-1 gap-3 sm:grid-cols-3">
            <SummaryStat label="Fecha" value={tournament.dateLabel} />
            <SummaryStat label="Sede" value={tournament.location} />
            <SummaryStat label="Categoría" value={tournament.category} />
          </div>
        </div>
      </Card>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap gap-2">
          {tournamentTabs.map((tab, index) => (
            <Link
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <section aria-label="Información general" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold text-vt-text">Información general</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <SummaryDetail label="Estado" value={tournament.statusLabel} />
            <SummaryDetail label="Fechas" value={tournament.dateLabel} />
            <SummaryDetail label="Ubicación" value={tournament.location} />
            <SummaryDetail label="Categoría" value={tournament.category} />
          </dl>
        </Card>
        <Card>
          <h2 className="text-lg font-bold text-vt-text">Actividad del torneo</h2>
          <p className="mt-4 text-sm leading-6 text-vt-muted">
            Consultá los partidos, la tabla de posiciones, las estadísticas y el cuadro desde las pestañas del torneo.
          </p>
        </Card>
      </section>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-vt-border bg-vt-panel p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">{label}</p>
      <p className="mt-2 text-sm font-semibold text-vt-text">{value}</p>
    </div>
  );
}

function SummaryDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.08em] text-vt-muted">{label}</dt>
      <dd className="mt-1 text-sm text-vt-text">{value}</dd>
    </div>
  );
}
