import { useParams } from "@tanstack/react-router";
import { DataTable } from "../../components/primitives/DataTable";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { standingsColumns } from "../public/tournamentTables";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

/**
 * The admin tournament's `Clasificación` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-torneo.html — the league detail's
 * `Clasificación <small>TOP 5</small>` panel, a `.table-wrap` inside the competition card whose
 * columns are `# | Equipo | PJ | PG | Pts`, all three measurements marked `.num`. The design's
 * panel shows the landing's five-row preview; this screen is the tab that owns the full
 * classification, so the eyebrow reports the row count it actually renders.
 *
 * Correctness fix (this change): the tab used to render the screen's own frozen prototype
 * table — four invented rows (`San Jorge Vóley`, `Rosario Central`, `Provincial`, `Náutico
 * Sportivo Avellaneda`) with two columns the design has no counterpart for (`PP`, `SETS`) and
 * a header set that did not match the public standings route. It now renders
 * `tournament.detail.standings` through the shared `standingsColumns`, which is exactly the
 * fixture-backed path the public `Clasificación` panel and the admin overview already use, so
 * the two sides can no longer disagree on the same tournament's table.
 */
export function AdminTournamentStandingsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  const { detail } = tournament;

  return (
    <AdminTournamentShell activeTab="clasificacion" tournament={tournament}>
      <TournamentPanelHeader eyebrow={`${detail.standings.length} EQUIPOS`}>
        Clasificación
      </TournamentPanelHeader>
      {/* Design: the panel's `.table-wrap` carries `border:0;border-radius:0;background:
          transparent` because the card around it already paints the box. */}
      <DataTable
        columns={standingsColumns}
        getRowKey={(row) => `standing-${row.position}`}
        rows={[...detail.standings]}
        wrapperClassName="rounded-none border-0 bg-transparent"
      />
    </AdminTournamentShell>
  );
}
