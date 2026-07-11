import { describe, expect, it } from "vitest";
import { ADMIN, PUBLIC_MATCHES, PUBLIC_TEAMS, SCORING } from "./index";

const expectFrozenTree = (value: unknown): void => {
  expect(Object.isFrozen(value)).toBe(true);

  if (Array.isArray(value)) {
    for (const item of value) expectFrozenTree(item);
    return;
  }

  if (value !== null && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      if (nestedValue !== null && typeof nestedValue === "object") {
        expectFrozenTree(nestedValue);
      }
    }
  }
};

describe("scoring and admin fixtures", () => {
  it("exposes static Spanish scoring records linked to public match IDs", () => {
    expect(Object.keys(SCORING)).toEqual([
      "matchSetup",
      "console",
      "pointEntry",
      "summary",
    ]);
    expect(SCORING.matchSetup.title).toBe("Configurar partido");
    expect(SCORING.console.statusLabel).toBe("En vivo");
    expect(SCORING.pointEntry.steps[0].label).toBe("Seleccionar equipo que anota");
    expect(SCORING.summary.title).toBe("Resumen del partido");
    expect(SCORING.console.matchId).toBe(PUBLIC_MATCHES.live[0].id);
    expect(SCORING.console.homeTeamId).toBe(PUBLIC_TEAMS[1].id);
    expect(SCORING.console.awayTeamId).toBe(PUBLIC_TEAMS[0].id);
  });

  it("keeps scoring records and nested display data immutable", () => {
    expectFrozenTree(SCORING);
    expect(Object.isFrozen(SCORING.console.score)).toBe(true);
    expect(Object.isFrozen(SCORING.pointEntry.steps)).toBe(true);
    expect(Object.isFrozen(SCORING.summary.sets)).toBe(true);
  });

  it("exposes Spanish admin listings with stable cross-record IDs", () => {
    expect(Object.keys(ADMIN)).toEqual([
      "staff",
      "tournaments",
      "matches",
      "teams",
      "players",
    ]);
    expect(ADMIN.staff[0].roleLabel).toBe("Planillero");
    expect(ADMIN.tournaments[0].statusLabel).toBe("En curso");
    expect(ADMIN.matches[0].statusLabel).toBe("En vivo");
    expect(ADMIN.teams[0].category).toBe("Primera División");
    expect(ADMIN.players[0].position).toBe("Armadora");
    expect(ADMIN.matches[0].tournamentId).toBe(ADMIN.tournaments[0].id);
    expect(ADMIN.teams[0].id).toBe(PUBLIC_TEAMS[0].id);
    expect(ADMIN.players[0].teamId).toBe(ADMIN.teams[0].id);
  });

  it("freezes every admin listing and nested display record", () => {
    expectFrozenTree(ADMIN);
  });
});
