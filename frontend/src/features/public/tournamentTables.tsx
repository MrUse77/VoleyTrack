import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import type { DataTableColumn } from "../../components/primitives/DataTable";
import type { TournamentStandingFixture } from "../../fixtures";

/**
 * The two standings-shaped tables the design defines for a tournament detail, kept in a
 * module of their own because two routes render them: the `Resumen` route reproduces the
 * design's opening state (a league opens on `Clasificación`, a cup on `Participantes`) and
 * the `Clasificación` route owns both panels.
 *
 * Design: frontend/design/html/voleytrack-torneos.html — the `liga-a1` detail's table is
 * `# | Equipo | PJ | PG | Pts` (its `Pts` header is marked `.num`), and the `copa-nacional`
 * detail's participant table is `# | Equipo | Torneo`, where `Torneo` is each participant's
 * source competition and is also marked `.num`.
 *
 * Two deliberate departures, both forced by the fixtures rather than chosen: the app's
 * `TournamentStandingFixture` has no source-competition column, so the participant table
 * reports `PJ` and `Puntos` instead of inventing a competition per team; and the design marks
 * its `Torneo` column `.num` while this one's extra columns are numbers the `DataTable`
 * primitive already treats as numeric from the row data.
 */
const teamCell = (standing: TournamentStandingFixture) => standing.teamId
  ? (
    <Link className="font-semibold text-vt-accent hover:underline" to={`/teams/${standing.teamId}` as string}>
      {standing.teamName}
    </Link>
  )
  : standing.teamName;

export const standingsColumns: DataTableColumn<TournamentStandingFixture>[] = [
  { header: "#", key: "position" },
  { header: "Equipo", key: "teamName", render: teamCell },
  { header: "PJ", key: "played" },
  { header: "PG", key: "won" },
  { header: "Pts", key: "points", sortIndicator: "descending" },
];

export const participantColumns: DataTableColumn<TournamentStandingFixture>[] = [
  { header: "#", key: "position" },
  { header: "Equipo", key: "teamName", render: teamCell },
  { header: "PJ", key: "played" },
  { header: "Puntos", key: "points" },
];
