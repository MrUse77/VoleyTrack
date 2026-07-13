import { Badge } from "../../components/primitives/Badge";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminMatchFixture } from "../../fixtures";

const statusVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
} as const;

const columns: DataTableColumn<AdminMatchFixture>[] = [
  {
    header: "Estado",
    key: "statusLabel",
    render: (match) => (
      <Badge variant={statusVariants[match.status]}>{match.statusLabel}</Badge>
    ),
  },
  { header: "Fecha y hora", key: "scheduledLabel" },
  { header: "Equipo local", key: "homeTeamName" },
  { header: "Equipo visitante", key: "awayTeamName" },
  { header: "Sede", key: "venue" },
];

export function AdminMatchesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partidos"
        description="Administrá y consultá los partidos registrados."
      />

      <section aria-label="Listado de partidos">
        <DataTable
          columns={columns}
          getRowKey={(match) => match.id}
          rows={[...ADMIN.matches]}
        />
      </section>
    </div>
  );
}
