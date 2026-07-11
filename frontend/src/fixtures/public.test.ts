import { describe, expect, it } from "vitest";
import {
  PUBLIC_MATCHES,
  PUBLIC_PLAYERS,
  PUBLIC_TEAMS,
  PUBLIC_TOURNAMENTS,
} from "./public";

describe("public fixtures", () => {
  it("provides stable Spanish match and tournament status variants", () => {
    expect(Object.keys(PUBLIC_MATCHES)).toEqual([
      "upcoming",
      "live",
      "today",
      "finished",
    ]);
    expect(Object.keys(PUBLIC_TOURNAMENTS)).toEqual([
      "all",
      "inProgress",
      "upcoming",
      "finished",
    ]);
    expect(PUBLIC_MATCHES.live[0]).toMatchObject({
      status: "live",
      badgeLabel: "En vivo",
    });
    expect(PUBLIC_TOURNAMENTS.inProgress[0]).toMatchObject({
      status: "in-progress",
      statusLabel: "En curso",
    });
  });

  it("keeps public records immutable and connected by stable IDs", () => {
    const teamIds = new Set(PUBLIC_TEAMS.map((team) => team.id));

    for (const matches of Object.values(PUBLIC_MATCHES)) {
      expect(Object.isFrozen(matches)).toBe(true);
      for (const match of matches) {
        expect(Object.isFrozen(match)).toBe(true);
        expect(teamIds).toContain(match.homeTeamId);
        expect(teamIds).toContain(match.awayTeamId);
      }
    }

    for (const player of PUBLIC_PLAYERS) {
      expect(teamIds).toContain(player.teamId);
      expect(Object.isFrozen(player)).toBe(true);
    }

    expect(Object.isFrozen(PUBLIC_TEAMS)).toBe(true);
    expect(Object.isFrozen(PUBLIC_TOURNAMENTS.all)).toBe(true);
  });

  it("freezes nested roster and score display records", () => {
    const playersById = new Map(PUBLIC_PLAYERS.map((player) => [player.id, player]));

    for (const team of PUBLIC_TEAMS) {
      expect(Object.isFrozen(team)).toBe(true);
      expect(Object.isFrozen(team.rosterPlayerIds)).toBe(true);
      for (const playerId of team.rosterPlayerIds) {
        expect(playersById.get(playerId)?.teamId).toBe(team.id);
      }
    }

    expect(Object.isFrozen(PUBLIC_MATCHES.live[0].score)).toBe(true);
    expect(PUBLIC_MATCHES.finished[0].score).toEqual({ home: 3, away: 1 });
  });
});
