import { useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { EmptyState } from "../../components/primitives/EmptyState";
import { PUBLIC_PLAYER_DETAILS } from "../../fixtures";
import { teamRosterRows, type TeamJourneyContext } from "../public/TeamJourney";
import { AdminTeamNotFound } from "./AdminTeamNotFound";
import { AdminTeamShell } from "./AdminTeamShell";
import { findAdminTeam } from "./adminTeamLookup";

/**
 * The admin team detail's `Plantel` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-equipo.html — a `.card` wrapping the
 * design's `.roster-table` (Jugador | Posición | Altura | Dorsal, the last two marked `.num`)
 * with the table's own frame flattened into the card.
 *
 * The rows are the shared `teamRosterRows`, so the admin roster and the public roster cannot
 * disagree on who is on the team. `Altura` is the one column with no fixture of its own: a
 * player who has a public profile publishes `heightLabel` there, so the cell reads it through
 * the shared player id and prints an em dash for a player with no profile rather than
 * inventing a height.
 */
type AdminRosterRow = Readonly<{
  id: string;
  fullName: string;
  position: string;
  number: number;
  heightLabel: string | null;
}>;

function adminRosterRows(context: TeamJourneyContext): readonly AdminRosterRow[] {
  return teamRosterRows(context).map(({ player }) => ({
    id: player.id,
    fullName: player.fullName,
    position: player.position,
    number: player.number,
    heightLabel: player.detailId
      ? PUBLIC_PLAYER_DETAILS.find((item) => item.playerId === player.detailId)?.heightLabel ?? null
      : null,
  }));
}

const columns: DataTableColumn<AdminRosterRow>[] = [
  { header: "Jugador", key: "fullName", render: (row) => <span className="font-bold text-vt-text">{row.fullName}</span> },
  { header: "Posición", key: "position" },
  { header: "Altura", key: "heightLabel", numeric: true, render: (row) => row.heightLabel ?? "—" },
  { header: "Dorsal", key: "number", numeric: true },
];

export function AdminTeamRosterPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findAdminTeam(id);

  if (!context) return <AdminTeamNotFound />;

  const rows = adminRosterRows(context);

  return (
    <AdminTeamShell activeTab="roster" context={context}>
      <Card padded={false}>
        {rows.length > 0 ? (
          <DataTable
            columns={columns}
            getRowKey={(row) => row.id}
            rows={[...rows]}
            wrapperClassName="rounded-none border-0 bg-transparent"
          />
        ) : (
          <EmptyState
            description="Todavía no hay jugadores registrados para este equipo."
            title="Plantel vacío"
          />
        )}
      </Card>
    </AdminTeamShell>
  );
}
