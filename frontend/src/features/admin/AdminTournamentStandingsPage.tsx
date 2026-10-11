import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { ADMIN, type AdminTournamentFixture } from "../../fixtures";

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
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

const standings = Object.freeze([
  { position: 1, team: "San Jorge Vóley", played: 6, won: 5, lost: 1, sets: "16-7", points: 15 },
  { position: 2, team: "Rosario Central", played: 6, won: 4, lost: 2, sets: "14-9", points: 12 },
  { position: 3, team: "Provincial", played: 6, won: 3, lost: 3, sets: "11-11", points: 9 },
  { position: 4, team: "Náutico Sportivo Avellaneda", played: 6, won: 0, lost: 6, sets: "3-17", points: 0 },
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

function findTournament(id: string): AdminTournamentFixture | undefined {
  return ADMIN.tournaments.find((tournament) => tournament.id === id);
}

export function AdminTournamentStandingsPage() {
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
              aria-current={tab.suffix === "/standings" ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab.suffix === "/standings" ? "bg-vt-accent text-vt-background" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/admin/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <section aria-label="Tabla de posiciones">
        <Card className="border-vt-border p-6" variant="raised">
          <h2 className="text-xl font-bold text-vt-accent">Tabla de posiciones</h2>
          <p className="mt-2 text-sm text-vt-muted">Posiciones actuales del torneo</p>
        </Card>
        <Card className="mt-4 overflow-hidden border-vt-border p-0" variant="raised">
          <DataTable columns={columns} getRowKey={(row) => row.team} rows={[...standings]} />
        </Card>
      </section>
    </div>
  );
}
