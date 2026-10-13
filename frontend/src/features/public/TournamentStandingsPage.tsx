import { useParams } from "@tanstack/react-router";
import { DataTable } from "../../components/primitives/DataTable";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";
import { TournamentDetailShell, TournamentNotFound, TournamentPanelHeader } from "./TournamentDetailShell";
import { participantColumns, standingsColumns } from "./tournamentTables";

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

export function TournamentStandingsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) return <TournamentNotFound />;

  return (
    <TournamentDetailShell activeTab="clasificacion" tournament={tournament}>
      {/*
       * Design: the `Clasificación` panel of a league detail —
       * `card-h` "Clasificación <small>TOP 5</small>" over a `.table-wrap` whose columns are
       * `# | Equipo | PJ | PG | Pts` and whose five rows are the top five places
       * (frontend/design/html/voleytrack-torneos.html, the `liga-a1` detail). The design's
       * panel flattens its `.table-wrap` (`border:0;border-radius:0;background:transparent`)
       * because the competition card already paints that box, which is what
       * `wrapperClassName` reproduces here.
       */}
      <TournamentPanelHeader eyebrow="TOP 5">Clasificación</TournamentPanelHeader>
      <DataTable
        columns={standingsColumns}
        getRowKey={(row) => `top-${row.position}`}
        rows={[...tournament.standings.slice(0, 5)]}
        wrapperClassName="rounded-none border-0 bg-transparent"
      />

      {/*
       * Design: the cup detail's first panel is "Equipos participantes <small>6 CONFIRMADOS ·
       * 16 CUPOS</small>" over a `# | Equipo | Torneo` table (same file, the `copa-nacional`
       * detail). The app's single standings route carries both design panels — the top five
       * for a league and the full participant list — because adding the design's
       * `Participantes` tab would need a sixth route in `src/router.tsx`, outside this
       * change's edit surface. See `tournamentTables.tsx` for why the participant table
       * reports `PJ` and `Puntos` instead of the design's source-competition column.
       */}
      <TournamentPanelHeader eyebrow={`${tournament.standings.length} CONFIRMADOS`}>
        Equipos participantes
      </TournamentPanelHeader>
      <DataTable
        columns={participantColumns}
        getRowKey={(row) => `participant-${row.position}`}
        rows={[...tournament.standings]}
        wrapperClassName="rounded-none border-0 bg-transparent"
      />
    </TournamentDetailShell>
  );
}
