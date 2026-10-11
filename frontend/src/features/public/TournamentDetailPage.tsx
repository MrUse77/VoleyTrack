import { Link, useParams } from "@tanstack/react-router";
import { DataTable } from "../../components/primitives/DataTable";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";
import { TournamentDetailShell, TournamentNotFound, TournamentPanelHeader } from "./TournamentDetailShell";
import { participantColumns, standingsColumns } from "./tournamentTables";

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

/**
 * The `Resumen` route.
 *
 * Design: frontend/design/html/voleytrack-torneos.html renders the page head, the KPI grid
 * and the `Información` card above its `.tor-tabs` strip, i.e. the design has no `Resumen`
 * tab — the app keeps a route for that region because `src/router.tsx` already defines it,
 * and `TournamentDetailShell` renders the region on every tab. The panel below the strip
 * therefore reproduces the design's opening state of the competition card: a league opens on
 * `Clasificación <small>TOP 5</small>` and a cup on `Equipos participantes`, which is the
 * first `.tor-tab` the design marks `active` for each detail (`liga-a1` and `copa-nacional`).
 */
export function TournamentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) return <TournamentNotFound />;

  const isCup = tournament.type === "Copa";

  return (
    <TournamentDetailShell activeTab="resumen" tournament={tournament}>
      {isCup ? (
        <>
          <TournamentPanelHeader eyebrow={`${tournament.standings.length} CONFIRMADOS`}>
            Equipos participantes
          </TournamentPanelHeader>
          <DataTable
            columns={participantColumns}
            getRowKey={(row) => `participant-${row.position}`}
            rows={[...tournament.standings]}
            wrapperClassName="rounded-none border-0 bg-transparent"
          />
        </>
      ) : (
        <>
          <TournamentPanelHeader eyebrow="TOP 5">Clasificación</TournamentPanelHeader>
          <DataTable
            columns={standingsColumns}
            getRowKey={(row) => `top-${row.position}`}
            rows={[...tournament.standings.slice(0, 5)]}
            wrapperClassName="rounded-none border-0 bg-transparent"
          />
        </>
      )}

      {/*
       * The design's own next step out of the landing: the competition panel and the two
       * section cards below it are reachable from the strip above, so the landing keeps a
       * single explicit pointer instead of restating their content.
       */}
      <div className="px-[18px] py-4">
        <Link
          className="text-[13px] font-semibold text-vt-accent hover:underline"
          to={`/tournaments/${tournament.id}/bracket` as string}
        >
          Ver las llaves del torneo →
        </Link>
      </div>
    </TournamentDetailShell>
  );
}
