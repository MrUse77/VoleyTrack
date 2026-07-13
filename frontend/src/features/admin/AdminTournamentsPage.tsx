import { Badge } from "../../components/primitives/Badge";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminTournamentFixture } from "../../fixtures";

const statusVariants = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

const columns: DataTableColumn<AdminTournamentFixture>[] = [
  { header: "Torneo", key: "name" },
  { header: "Categoría", key: "category" },
  {
    header: "Estado",
    key: "statusLabel",
    render: (tournament) => (
      <Badge variant={statusVariants[tournament.status]}>{tournament.statusLabel}</Badge>
    ),
  },
  { header: "Fechas", key: "dateLabel" },
  { header: "Sede", key: "location" },
  { header: "Partidos", key: "matchesLabel" },
  { header: "Equipos", key: "teamsLabel" },
];

export function AdminTournamentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Torneos"
        description="Administrá y consultá los torneos registrados."
      />

      <section aria-label="Listado de torneos">
        <DataTable
          columns={columns}
          getRowKey={(tournament) => tournament.id}
          rows={[...ADMIN.tournaments]}
        />
      </section>
    </div>
  );
}
