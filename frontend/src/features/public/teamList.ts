import {
  PUBLIC_TEAM_DETAILS,
  PUBLIC_TEAMS,
  PUBLIC_TOURNAMENTS,
  type TeamFixture,
} from "../../fixtures";

/**
 * The list-row projection the two team lists share.
 *
 * Design: frontend/design/html/voleytrack-equipos.html and
 * voleytrack-admin-equipos.html — both lists are a `.table-wrap` whose columns are
 * `Equipo | Torneo | Jugadores | PG / PP`. The public list derives those figures from
 * `PUBLIC_TEAM_DETAILS` (a team's own detail projection) with the tournament standings as a
 * fallback; the admin list renders the same four columns over `ADMIN.teams`. Two copies of
 * that derivation is exactly what lets the two sides disagree on the same team, so the
 * derivation lives here — the same call `tournamentTables.tsx` already makes for the two
 * standings tables.
 *
 * A team with neither projection keeps `null` for its tournament and its record, and the
 * screens print an em dash rather than inventing a figure.
 */
export type TeamListRow = Readonly<{
  id: string;
  name: string;
  city: string;
  tournamentName: string | null;
  playerCount: number;
  record: string | null;
}>;

export type TeamListExtras = Readonly<{
  tournamentName: string | null;
  record: string | null;
}>;

/**
 * The two derived columns, for a caller that already owns the team's identity and its own
 * player count (the admin fixture carries `playerCount`; the public list derives it).
 *
 * The standings lookup is by team name because `TournamentStandingFixture` has no team id
 * for the rows the fixtures actually use, and it keeps the last tournament's row for a name
 * — the same key the public list has always used.
 */
export function teamListExtras(teamId: string, teamName: string): TeamListExtras {
  const standingsByTeamName = new Map(
    PUBLIC_TOURNAMENTS.all.flatMap((tournament) =>
      tournament.standings.map((standing) => [standing.teamName, standing] as const),
    ),
  );
  const detail = PUBLIC_TEAM_DETAILS.find((item) => item.teamId === teamId);
  const standing = standingsByTeamName.get(teamName);

  return {
    tournamentName: detail?.tournamentName ?? null,
    record: detail
      ? `${detail.wins} / ${detail.matchesPlayed - detail.wins}`
      : standing
        ? `${standing.won} / ${standing.lost}`
        : null,
  };
}

/** The public list's rows, i.e. every `PUBLIC_TEAMS` entry projected through the same rules. */
export function teamListRows(): readonly TeamListRow[] {
  return PUBLIC_TEAMS.map((team: TeamFixture) => {
    const detail = PUBLIC_TEAM_DETAILS.find((item) => item.teamId === team.id);

    return {
      id: team.id,
      name: team.name,
      city: team.city,
      playerCount: detail ? detail.rosterStats.length : team.rosterPlayerIds.length,
      ...teamListExtras(team.id, team.name),
    } satisfies TeamListRow;
  });
}
