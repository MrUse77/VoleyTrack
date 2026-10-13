import { Link, useParams } from "@tanstack/react-router";
import { DataTable } from "../../components/primitives/DataTable";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { participantColumns, standingsColumns } from "../public/tournamentTables";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

/**
 * The admin tournament's overview, i.e. the landing the design's own detail page opens on.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-torneo.html (a league) and
 * voleytrack-admin-ver-copa.html (a cup). Everything above the tab strip — the page head with
 * its three actions, the KPI grid and the `Información` card — is rendered by
 * `AdminTournamentShell`, and the cup's extra `Formato` card by the frame's side panel. The
 * panel below the strip reproduces the design's opening state for each format: a league opens
 * on `Clasificación <small>TOP 5</small>` and a cup on `Equipos participantes
 * <small>… CONFIRMADOS · … CUPOS</small>`, which is the first `.detail-tab` the design marks
 * `active` in each file. The same two tables are the public detail's opening panel, so they are
 * the shared `participantColumns` / `standingsColumns` rather than a second definition.
 *
 * The design also renders a matches card below the competition card on this page ("Próximos
 * partidos <small>JORNADA 15</small>" for a league, "Partidos programados <small>CREADOS EN
 * ADMINISTRACIÓN</small>" for a cup). In this app that content is the `Partidos` route of the
 * same tab strip — the same call the public detail made — so the overview points at it instead
 * of rendering a second copy of it.
 */
export function AdminTournamentOverviewPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  const { detail } = tournament;
  const isCup = detail.type === "Copa";

  return (
    <AdminTournamentShell activeTab="resumen" tournament={tournament}>
      {isCup ? (
        <>
          <TournamentPanelHeader eyebrow={`${detail.standings.length} CONFIRMADOS`}>
            Equipos participantes
          </TournamentPanelHeader>
          <DataTable
            columns={participantColumns}
            getRowKey={(row) => `participant-${row.position}`}
            rows={[...detail.standings]}
            wrapperClassName="rounded-none border-0 bg-transparent"
          />
        </>
      ) : (
        <>
          <TournamentPanelHeader eyebrow="TOP 5">Clasificación</TournamentPanelHeader>
          <DataTable
            columns={standingsColumns}
            getRowKey={(row) => `top-${row.position}`}
            rows={[...detail.standings.slice(0, 5)]}
            wrapperClassName="rounded-none border-0 bg-transparent"
          />
        </>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-2 px-[18px] py-4">
        <Link
          className="text-[13px] font-semibold text-vt-accent hover:underline"
          to={`/admin/tournaments/${tournament.id}/bracket` as string}
        >
          Ver las llaves del torneo →
        </Link>
        <Link
          className="text-[13px] font-semibold text-vt-accent hover:underline"
          to={`/admin/tournaments/${tournament.id}/matches` as string}
        >
          Ver los partidos del torneo →
        </Link>
      </div>
    </AdminTournamentShell>
  );
}
