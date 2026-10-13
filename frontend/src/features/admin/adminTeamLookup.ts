import { ADMIN, PUBLIC_TEAM_DETAILS, PUBLIC_TEAMS } from "../../fixtures";
import type { TeamJourneyContext } from "../public/TeamJourney";

/**
 * The admin team area's single lookup.
 *
 * It lives in a module of its own because the four admin team detail routes (the overview and
 * the three content tabs) all resolve the same row, and four copies of the same `find` are
 * what let two of them drift.
 *
 * The admin area is scoped to `ADMIN.teams`, exactly as the admin tournament area is scoped to
 * `ADMIN.tournaments`: a team the administration does not manage is not an admin detail. The
 * shell itself needs the public `TeamFixture` and the public `TeamDetailFixture` — the admin
 * row carries only the list's own labels — and the admin team ids are the public team ids
 * (`scoring-admin.test.ts` pins that), so the row is resolved from `PUBLIC_TEAMS`.
 */
export function findAdminTeam(id: string): TeamJourneyContext | undefined {
  const isAdminTeam = ADMIN.teams.some((team) => team.id === id);
  if (!isAdminTeam) return undefined;

  const team = PUBLIC_TEAMS.find((item) => item.id === id);
  if (!team) return undefined;

  const detail = PUBLIC_TEAM_DETAILS.find((item) => item.teamId === id);

  return detail ? { team, detail } : { team };
}
