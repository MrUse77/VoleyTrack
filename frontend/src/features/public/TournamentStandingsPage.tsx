import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";

type StandingsRow = {
  position: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  sets: string;
  points: number;
};

const tournamentTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
  { label: "Cuadro", suffix: "/bracket" },
] as const;

const standings = Object.freeze([
  { position: 1, team: "River Plate", played: 6, won: 6, lost: 0, sets: "16-6", points: 16 },
  { position: 2, team: "Ciudad Voley", played: 6, won: 4, lost: 2, sets: "14-8", points: 13 },
  { position: 3, team: "UPCN San Juan", played: 5, won: 4, lost: 1, sets: "13-7", points: 12 },
  { position: 4, team: "Boca Juniors", played: 6, won: 3, lost: 3, sets: "11-11", points: 10 },
  { position: 5, team: "Bolívar Voley", played: 5, won: 2, lost: 3, sets: "9-12", points: 7 },
  { position: 6, team: "Monteros Voley", played: 6, won: 1, lost: 5, sets: "7-15", points: 4 },
  { position: 7, team: "Obras San Juan", played: 5, won: 1, lost: 4, sets: "6-14", points: 4 },
  { position: 8, team: "Once Unidos", played: 5, won: 0, lost: 5, sets: "4-15", points: 1 },
] satisfies readonly StandingsRow[]);

const columns: DataTableColumn<StandingsRow>[] = [
  { header: "#", key: "position" },
  { header: "Equipo", key: "team" },
  { header: "PJ", key: "played" },
  { header: "PG", key: "won" },
  { header: "PP", key: "lost" },
  { header: "SETS", key: "sets" },
  { header: "PTS", key: "points", sortIndicator: "descending" },
];

const statusVariants = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

export function TournamentStandingsPage() {
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
            <h2 className="mt-4 text-3xl font-black text-vt-text">Tabla de posiciones</h2>
            <p className="mt-2 text-sm text-vt-muted">Temporada regular · 8 equipos · Jornada 6 de 14</p>
          </div>
          <div className="grid min-w-[280px] flex-1 gap-3 sm:grid-cols-3">
            <SummaryStat label="Equipos" value="8" />
            <SummaryStat label="Partidos" value="18" />
            <SummaryStat label="Jugados" value="9" />
          </div>
        </div>
      </Card>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab, index) => (
            <Link
              aria-current={index === 2 ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 2 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
          <span className="ml-auto px-3 text-sm text-vt-muted">Actualizado hace 1 min</span>
        </div>
      </nav>

      <section aria-label="Tabla de posiciones">
        <h2 className="mb-4 text-xl font-bold text-vt-accent">Tabla de posiciones</h2>
        <Card className="overflow-hidden border-vt-border bg-vt-raised p-0">
          <DataTable columns={columns} getRowKey={(row) => row.team} rows={[...standings]} />
        </Card>
      </section>
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
