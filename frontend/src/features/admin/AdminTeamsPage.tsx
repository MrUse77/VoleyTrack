import { Badge } from "../../components/primitives/Badge";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminTeamFixture } from "../../fixtures";

const columns: DataTableColumn<AdminTeamFixture>[] = [
  { header: "Equipo", key: "name" },
  { header: "Ciudad", key: "city" },
  { header: "Entrenador", key: "coach" },
  { header: "Categoría", key: "category" },
  { header: "Jugadores", key: "playerCount" },
  {
    header: "Estado",
    key: "statusLabel",
    render: (team) => <Badge variant="success">{team.statusLabel}</Badge>,
  },
];

export function AdminTeamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipos"
        description="Administrá y consultá los equipos registrados."
      />

      <section aria-label="Listado de equipos">
        <DataTable
          columns={columns}
          getRowKey={(team) => team.id}
          rows={[...ADMIN.teams]}
        />
      </section>
    </div>
  );
}
