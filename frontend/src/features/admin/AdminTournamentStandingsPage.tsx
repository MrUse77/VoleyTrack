import { useParams } from "@tanstack/react-router";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

type StandingsRow = {
  position: number;
  team: string;
  played: number;
  won: number;
  lost: number;
  sets: string;
  points: number;
};

/**
 * The admin tournament's `Clasificación` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-torneo.html — the league detail's
 * `Clasificación <small>TOP 5</small>` panel, a `.table-wrap` inside the competition card whose
 * columns are `# | Equipo | PJ | PG | Pts` with the measurement columns marked `.num`. The
 * app's table carries two more columns (`PP`, `SETS`) that the design has no counterpart for
 * and no `TOP 5` cut, because this screen is the full classification rather than the landing's
 * preview, so the eyebrow reports the row count it actually renders.
 *
 * PROTOTYPE DATA — NOT REAL: these four rows were a literal in this screen before the alignment
 * and are still a local constant; they must be replaced by the tournament's real classification
 * (`ADMIN.tournaments[…].detail.standings` is the fixture projection that already exists).
 */
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
  { header: "SETS", key: "sets", numeric: true },
  { header: "PTS", key: "points", sortIndicator: "descending" },
];

export function AdminTournamentStandingsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  return (
    <AdminTournamentShell activeTab="clasificacion" tournament={tournament}>
      <TournamentPanelHeader eyebrow={`${standings.length} EQUIPOS`}>
        Clasificación
      </TournamentPanelHeader>
      {/* Design: the panel's `.table-wrap` carries `border:0;border-radius:0;background:
          transparent` because the card around it already paints the box. */}
      <DataTable
        columns={columns}
        getRowKey={(row) => row.team}
        rows={[...standings]}
        wrapperClassName="rounded-none border-0 bg-transparent"
      />
    </AdminTournamentShell>
  );
}
