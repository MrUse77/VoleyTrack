import { ADMIN, type AdminTournamentFixture } from "../../fixtures";

/**
 * The admin tournament area's single lookup.
 *
 * It lives in a module of its own because the admin tournament routes (the overview, the
 * bracket, the edit form and the three content tabs) all resolve the same row from
 * `ADMIN.tournaments`, and five copies of the same `find` are what let two of them drift.
 */
export function findAdminTournament(id: string): AdminTournamentFixture | undefined {
  return ADMIN.tournaments.find((tournament) => tournament.id === id);
}
