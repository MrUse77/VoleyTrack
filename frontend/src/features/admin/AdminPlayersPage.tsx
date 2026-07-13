import { Badge } from "../../components/primitives/Badge";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminPlayerFixture } from "../../fixtures";

const columns: DataTableColumn<AdminPlayerFixture>[] = [
  { header: "Jugador", key: "fullName" },
  { header: "Equipo", key: "teamName" },
  { header: "Dorsal", key: "number" },
  { header: "Posición", key: "position" },
  {
    header: "Estado",
    key: "statusLabel",
    render: (player) => <Badge variant="success">{player.statusLabel}</Badge>,
  },
];

export function AdminPlayersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Jugadores"
        description="Administrá y consultá los jugadores registrados."
      />

      <section aria-label="Listado de jugadores">
        <DataTable
          columns={columns}
          getRowKey={(player) => player.id}
          rows={[...ADMIN.players]}
        />
      </section>
    </div>
  );
}
