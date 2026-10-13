import { describe, expect, it } from "vitest";
import {
  PUBLIC_DASHBOARD,
  PUBLIC_LIVE_MATCH_DETAILS,
  PUBLIC_MATCHES,
  PUBLIC_PLAYER_DETAILS,
  PUBLIC_PLAYERS,
  PUBLIC_TEAM_DETAILS,
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

  it("carries the design's tournament type dimension on every tournament", () => {
    // The design's tournaments filter offers a "Tipo" dimension (Liga / Copa) and its
    // detail pages branch on it (frontend/design/html/voleytrack-torneos.html), so every
    // tournament publishes it and the fixture stays immutable.
    for (const tournament of PUBLIC_TOURNAMENTS.all) {
      expect(["Liga", "Copa"]).toContain(tournament.type);
      expect(tournament.typeLabel).toBe(tournament.type);
      expect(Object.isFrozen(tournament)).toBe(true);
    }
    expect(PUBLIC_TOURNAMENTS.all.some((tournament) => tournament.type === "Liga")).toBe(true);
    expect(PUBLIC_TOURNAMENTS.all.some((tournament) => tournament.type === "Copa")).toBe(true);
  });

  it("provides the canonical dashboard match composition with stable route IDs", () => {
    expect(PUBLIC_MATCHES.live.map((match) => match.id)).toEqual(expect.arrayContaining([
      "match-liga-a1-river-boca",
      "match-liga-a1-ciudad-upcn",
      "match-copa-nacional-bolivar-monteros",
    ]));

    const scheduledIds = [...PUBLIC_MATCHES.today, ...PUBLIC_MATCHES.upcoming].map((match) => match.id);
    expect(scheduledIds).toEqual(expect.arrayContaining([
      "match-liga-a1-river-ciudad",
      "match-liga-a1-upcn-bolivar",
      "match-copa-nacional-boca-monteros",
    ]));
    expect(PUBLIC_DASHBOARD.live.featured.match.id).toBe("match-liga-a1-river-boca");
    // The design's featured live card also names the match clock, the referee and the match
    // format (frontend/design/html/voleytrack-dashboard.html:51-54). The match record has no
    // counterpart for any of them, so they are pinned here as part of the immutable
    // dashboard projection.
    expect(PUBLIC_DASHBOARD.live.featured).toMatchObject({
      bestOf: 5,
      clockLabel: "21:42",
      refereeName: "P. López",
    });
    expect(PUBLIC_DASHBOARD.live.compact).toHaveLength(2);
    expect(PUBLIC_DASHBOARD.upcoming).toHaveLength(3);
    expect(Object.isFrozen(PUBLIC_DASHBOARD)).toBe(true);
    expect(Object.isFrozen(PUBLIC_DASHBOARD.live.compact)).toBe(true);
  });

  it("models the dashboard and live-detail artboards as distinct immutable temporal snapshots", () => {
    const dashboardFeatured = PUBLIC_DASHBOARD.live.featured as typeof PUBLIC_DASHBOARD.live.featured & {
      visualSnapshot?: {
        artboard: string;
        setNumber: number;
        homeSetsWon: number;
        awaySetsWon: number;
        currentScore: { home: number; away: number };
      };
    };
    const liveDetail = PUBLIC_LIVE_MATCH_DETAILS.find(
      ({ match }) => match.id === dashboardFeatured.match.id,
    ) as (typeof PUBLIC_LIVE_MATCH_DETAILS)[number] & {
      visualSnapshot?: {
        artboard: string;
        setNumber: number;
        homeSetsWon: number;
        awaySetsWon: number;
        currentScore: { home: number; away: number };
      };
    };

    expect(dashboardFeatured.visualSnapshot).toEqual({
      artboard: "VoleyTrack Public Dashboard - Desktop",
      setNumber: 3,
      homeSetsWon: 2,
      awaySetsWon: 1,
      currentScore: { home: 21, away: 18 },
    });
    expect(liveDetail.visualSnapshot).toEqual({
      artboard: "VoleyTrack Live Match Detail - Desktop",
      setNumber: 3,
      homeSetsWon: 1,
      awaySetsWon: 1,
      currentScore: { home: 21, away: 18 },
    });
    expect(dashboardFeatured.visualSnapshot).not.toBe(liveDetail.visualSnapshot);
    expect(Object.isFrozen(dashboardFeatured.visualSnapshot)).toBe(true);
    expect(Object.isFrozen(liveDetail.visualSnapshot)).toBe(true);
    expect(Object.isFrozen(dashboardFeatured.visualSnapshot?.currentScore)).toBe(true);
    expect(Object.isFrozen(liveDetail.visualSnapshot?.currentScore)).toBe(true);
    expect(dashboardFeatured.homeSetsWon).toBe(2);
    expect(dashboardFeatured.awaySetsWon).toBe(1);
    expect(liveDetail.homeSetsWon).toBe(1);
    expect(liveDetail.awaySetsWon).toBe(1);
  });

  it("resolves every dashboard tournament label to the match tournament identity", () => {
    const tournamentsById = new Map(PUBLIC_TOURNAMENTS.all.map((tournament) => [tournament.id, tournament]));
    const dashboardMatches = [
      PUBLIC_DASHBOARD.live.featured,
      ...PUBLIC_DASHBOARD.live.compact,
      ...PUBLIC_DASHBOARD.upcoming,
    ];

    expect(PUBLIC_TOURNAMENTS.all).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "liga-a1-2026", name: "Liga A1" }),
      expect.objectContaining({ id: "copa-nacional-2026", name: "Copa Nacional" }),
    ]));

    for (const { match, tournamentName } of dashboardMatches) {
      const tournament = tournamentsById.get(match.tournamentId);

      expect(tournament, `missing tournament ${match.tournamentId} for ${match.id}`).toBeDefined();
      expect(tournament?.name).toBe(tournamentName);
      expect(Object.isFrozen(tournament)).toBe(true);
    }
  });

  it("keeps public records immutable and connected by stable IDs", () => {
    const teamIds = new Set(PUBLIC_TEAMS.map((team) => team.id));
    const tournamentIds = new Set(PUBLIC_TOURNAMENTS.all.map((tournament) => tournament.id));

    for (const matches of Object.values(PUBLIC_MATCHES)) {
      expect(Object.isFrozen(matches)).toBe(true);
      for (const match of matches) {
        expect(Object.isFrozen(match)).toBe(true);
        expect(teamIds).toContain(match.homeTeamId);
        expect(teamIds).toContain(match.awayTeamId);
        expect(tournamentIds).toContain(match.tournamentId);
      }
    }

    for (const player of PUBLIC_PLAYERS) {
      expect(teamIds).toContain(player.teamId);
      expect(Object.isFrozen(player)).toBe(true);
    }

    expect(Object.isFrozen(PUBLIC_TEAMS)).toBe(true);
    expect(Object.isFrozen(PUBLIC_TOURNAMENTS.all)).toBe(true);
  });

  it("provides immutable, identity-safe player detail projections", () => {
    const publicPlayerIds = PUBLIC_PLAYERS.map(({ id }) => id);
    const allMatches = Object.values(PUBLIC_MATCHES).flat();
    const liveDetailMatches = new Set(
      PUBLIC_LIVE_MATCH_DETAILS.map(({ match }) => match),
    );
    const riverDetail = PUBLIC_TEAM_DETAILS.find(
      ({ teamId }) => teamId === "river-plate",
    );

    expect(PUBLIC_PLAYER_DETAILS.map(({ playerId }) => playerId)).toEqual(
      publicPlayerIds,
    );
    // The design's own KPI tile set (frontend/design/html/voleytrack-jugadores.html),
    // including its `.kpi-sub` lines; see the fixture comment for why it supersedes the
    // previous canonical pairs.
    expect(PUBLIC_PLAYER_DETAILS[0].kpis).toEqual([
      { label: "Puntos", value: "142", sub: "3.8 / set · 1º del torneo" },
      { label: "Ataque", value: "49%", sub: "Efectividad" },
      { label: "Bloqueo", value: "18", sub: "0.5 / set" },
      { label: "Saque ace", value: "11", sub: "Top 3 liga" },
    ]);
    expect(PUBLIC_PLAYER_DETAILS[0].statBreakdown).toEqual([
      { id: "attack", label: "Ataque", value: "140 pts", barPercent: 100 },
      { id: "block", label: "Bloqueo", value: "42 pts", barPercent: 32 },
      { id: "serve", label: "Saque", value: "18 pts", barPercent: 16 },
      { id: "defense", label: "Defensa (Digs)", value: "85", barPercent: 60 },
      { id: "reception", label: "Recepción Perf.", value: "60%", barPercent: 80 },
    ]);
    expect(PUBLIC_PLAYER_DETAILS[0].recentMatches.map(({ playerPoints }) => playerPoints)).toEqual([22, 18, 15, 25]);

    for (const detail of PUBLIC_PLAYER_DETAILS) {
      expect(publicPlayerIds).toContain(detail.playerId);
      expect(Object.isFrozen(detail)).toBe(true);
      expect(Object.isFrozen(detail.kpis)).toBe(true);
      expect(Object.isFrozen(detail.statBreakdown)).toBe(true);
      expect(Object.isFrozen(detail.recentMatches)).toBe(true);

      for (const kpi of detail.kpis) expect(Object.isFrozen(kpi)).toBe(true);
      for (const stat of detail.statBreakdown) expect(Object.isFrozen(stat)).toBe(true);
      for (const recent of detail.recentMatches) {
        expect(Object.isFrozen(recent)).toBe(true);
        expect(allMatches).toContain(recent.match);
        if (recent.match.status === "live") {
          expect(liveDetailMatches).toContain(recent.match);
        }
      }
    }

    for (const row of riverDetail?.rosterStats ?? []) {
      if (!("playerDetailId" in row)) {
        expect(PUBLIC_PLAYER_DETAILS.some(({ playerId }) => playerId === row.id)).toBe(false);
      }
    }
    expect(PUBLIC_PLAYERS.map(({ id }) => id)).toEqual(publicPlayerIds);
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

  it("provides the canonical immutable River Plate team journey projection", () => {
    const detail = PUBLIC_TEAM_DETAILS.find(({ teamId }) => teamId === "river-plate");
    const playersById = new Map(PUBLIC_PLAYERS.map((player) => [player.id, player]));
    const matchesById = new Map(
      Object.values(PUBLIC_MATCHES).flat().map((match) => [match.id, match]),
    );

    expect(detail).toMatchObject({
      initials: "RP",
      standingLabel: "1° PUESTO",
      tournamentName: "Liga A1 Masculina",
      matchesPlayed: 6,
      wins: 5,
      sets: "16-6",
      points: 16,
    });
    expect(detail?.summaryStats).toEqual([
      { label: "PUNTOS A FAVOR", value: 482 },
      { label: "PUNTOS EN CONTRA", value: 421 },
      { label: "ATAQUES PUNTO", value: 248 },
      { label: "BLOQUEOS PUNTO", value: 62 },
    ]);
    expect(PUBLIC_PLAYERS.map(({ id }) => id)).toEqual([
      "jugadora-valentina-ruiz",
      "jugadora-camila-sosa",
    ]);
    expect(PUBLIC_MATCHES.upcoming.map(({ id }) => id)).toEqual([
      "match-liga-rosarina-01",
      "match-liga-a1-upcn-bolivar",
      "match-copa-nacional-boca-monteros",
    ]);
    expect(PUBLIC_MATCHES.finished.map(({ id }) => id)).toEqual([
      "match-liga-rosarina-04",
    ]);
    expect(detail?.rosterStats).toEqual([
      { id: "mateo-silva", fullName: "Mateo Silva", number: 12, position: "Punta receptor", points: 128, attacks: 76, blocks: 18, aces: 16 },
      { id: "ivan-molina", fullName: "Iván Molina", number: 7, position: "Central", points: 74, attacks: 38, blocks: 24, aces: 12 },
      { id: "santiago-lopez", fullName: "Santiago López", number: 3, position: "Armador", points: 42, attacks: 22, blocks: 14, aces: 6 },
      { id: "facundo-rios", fullName: "Facundo Ríos", number: 9, position: "Opuesto", points: 39, attacks: 28, blocks: 8, aces: 3 },
      { id: "nicolas-vera", fullName: "Nicolás Vera", number: 1, position: "Líbero", points: 0, attacks: 0, blocks: 0, aces: 0 },
    ]);
    expect(detail?.matches.map(({ match }) => match.id)).toEqual([
      "match-liga-a1-river-boca",
      "match-liga-a1-river-ciudad-finished",
      "match-liga-a1-upcn-river-finished",
      "match-liga-a1-river-bolivar",
    ]);

    for (const row of detail?.rosterStats ?? []) {
      if ("playerDetailId" in row && typeof row.playerDetailId === "string") {
        expect(playersById.get(row.playerDetailId)?.teamId).toBe(detail?.teamId);
      }
      expect(Object.isFrozen(row)).toBe(true);
    }
    for (const item of detail?.matches ?? []) {
      expect(item.match.homeTeamId === detail?.teamId || item.match.awayTeamId === detail?.teamId).toBe(true);
      expect(Object.isFrozen(item)).toBe(true);
      expect(Object.isFrozen(item.match)).toBe(true);
    }
    expect(matchesById.get(detail?.matches[0]?.match.id ?? "")).toBe(detail?.matches[0]?.match);
    expect(Object.isFrozen(detail)).toBe(true);
    expect(Object.isFrozen(detail?.summaryStats)).toBe(true);
    expect(Object.isFrozen(detail?.rosterStats)).toBe(true);
    expect(Object.isFrozen(detail?.matches)).toBe(true);
  });

  it("composes one immutable, identity-consistent detail projection for every public live match", () => {
    const details = PUBLIC_LIVE_MATCH_DETAILS;

    expect(details.map(({ match }) => match.id)).toEqual(
      PUBLIC_MATCHES.live.map((match) => match.id),
    );

    const tournamentsById = new Map(
      PUBLIC_TOURNAMENTS.all.map((tournament) => [tournament.id, tournament]),
    );

    for (const detail of details) {
      const match = PUBLIC_MATCHES.live.find(({ id }) => id === detail.match.id);

      expect(detail.match).toBe(match);
      expect(detail.tournamentName).toBe(
        tournamentsById.get(detail.match.tournamentId)?.name,
      );
      expect(detail.sets.at(-1)?.status).toBe("current");
      expect(detail.rotations).toHaveLength(2);
      expect(detail.rotations[0].positions).toHaveLength(6);
      expect(detail.rotations[1].positions).toHaveLength(6);
      // The live screen's "Estadísticas individuales" roster prints one line per player on
      // court (design: voleytrack-live.html, the `.roster-player` rows), so the roster is
      // the same six players as the rotation, index-aligned, with the per-player match line.
      expect(detail.rosters).toHaveLength(2);
      for (const [index, roster] of detail.rosters.entries()) {
        expect(roster.teamId).toBe(detail.rotations[index].teamId);
        expect(roster.teamName).toBe(detail.rotations[index].teamName);
        expect(roster.players.map(({ playerName }) => playerName)).toEqual(
          detail.rotations[index].positions.map(({ playerName }) => playerName),
        );
        expect(roster.players.map(({ number }) => number)).toEqual(
          detail.rotations[index].positions.map(({ number }) => number),
        );
        expect(Object.isFrozen(roster)).toBe(true);
        expect(Object.isFrozen(roster.players)).toBe(true);
        for (const player of roster.players) {
          expect(Object.isFrozen(player)).toBe(true);
          expect(player.role).not.toHaveLength(0);
        }
      }
      expect(detail.events).not.toHaveLength(0);
      expect(detail.playerLeaders).not.toHaveLength(0);
      expect(detail.teamStats).toHaveLength(4);
      expect(Object.isFrozen(detail)).toBe(true);
      expect(Object.isFrozen(detail.sets)).toBe(true);
      expect(Object.isFrozen(detail.rotations)).toBe(true);
      expect(Object.isFrozen(detail.rotations[0].positions)).toBe(true);
      expect(Object.isFrozen(detail.rosters)).toBe(true);
      expect(Object.isFrozen(detail.events)).toBe(true);
      expect(Object.isFrozen(detail.playerLeaders)).toBe(true);
      expect(Object.isFrozen(detail.teamStats)).toBe(true);
    }
  });

  it("covers every canonical dashboard live route without changing dashboard order or identity", () => {
    const details = PUBLIC_LIVE_MATCH_DETAILS;
    const dashboardLive = [
      PUBLIC_DASHBOARD.live.featured,
      ...PUBLIC_DASHBOARD.live.compact,
    ];

    expect(dashboardLive.map(({ match }) => match.id)).toEqual([
      "match-liga-a1-river-boca",
      "match-liga-a1-ciudad-upcn",
      "match-copa-nacional-bolivar-monteros",
    ]);

    for (const dashboardItem of dashboardLive) {
      const detail = details.find(
        ({ match }) => match.id === dashboardItem.match.id,
      );

      expect(detail, `missing live projection for ${dashboardItem.match.id}`).toBeDefined();
      expect(detail?.match).toBe(dashboardItem.match);
      expect(detail?.tournamentName).toBe(dashboardItem.tournamentName);
      expect(detail?.currentScore).toEqual(dashboardItem.match.score);
    }
  });
});
