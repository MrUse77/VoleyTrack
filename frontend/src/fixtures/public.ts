import type {
  LiveMatchDetailFixture,
  LiveMatchEventFixture,
  LivePlayerStatFixture,
  LiveRosterPlayerFixture,
  LiveRotationPositionFixture,
  LiveSetFixture,
  LiveTeamStatFixture,
  LiveTeamRosterFixture,
  LiveTeamRotationFixture,
  MatchFixture,
  PlayerDetailFixture,
  PlayerFixture,
  PublicMatchFixtures,
  PublicTournamentFixtures,
  PublicVisualSnapshotFixture,
  TeamDetailFixture,
  TeamFixture,
  TournamentBracketRoundFixture,
  TournamentFixture,
  TournamentStandingFixture,
  TournamentStatLeaderFixture,
} from "./types";

const sanJorge = Object.freeze({
  id: "club-atletico-san-jorge",
  name: "Club Atlético San Jorge",
  city: "San Jorge",
  coach: "María Belén Acosta",
  category: "Primera División",
  rosterPlayerIds: Object.freeze(["jugadora-valentina-ruiz"]),
} satisfies TeamFixture);

const rosarioCentral = Object.freeze({
  id: "rosario-central-voley",
  name: "Rosario Central Vóley",
  city: "Rosario",
  coach: "Luciano Ferreyra",
  category: "Primera División",
  rosterPlayerIds: Object.freeze(["jugadora-camila-sosa"]),
} satisfies TeamFixture);

const riverPlate = Object.freeze({
  id: "river-plate",
  name: "River Plate",
  city: "Buenos Aires",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

const bocaJuniors = Object.freeze({
  id: "boca-juniors",
  name: "Boca Juniors",
  city: "Buenos Aires",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

const ciudadVoley = Object.freeze({
  id: "ciudad-voley",
  name: "Ciudad Voley",
  city: "Buenos Aires",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

const upcnSanJuan = Object.freeze({
  id: "upcn-san-juan",
  name: "UPCN San Juan",
  city: "San Juan",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

const bolivar = Object.freeze({
  id: "bolivar",
  name: "Bolívar",
  city: "San Carlos de Bolívar",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

const monteros = Object.freeze({
  id: "monteros",
  name: "Monteros",
  city: "Monteros",
  coach: "Equipo técnico",
  category: "Primera División",
  rosterPlayerIds: Object.freeze([]),
} satisfies TeamFixture);

export const PUBLIC_TEAMS = Object.freeze([
  sanJorge,
  rosarioCentral,
  riverPlate,
  bocaJuniors,
  ciudadVoley,
  upcnSanJuan,
  bolivar,
  monteros,
] satisfies readonly TeamFixture[]);

export const PUBLIC_PLAYERS = Object.freeze([
  Object.freeze({
    id: "jugadora-valentina-ruiz",
    teamId: sanJorge.id,
    fullName: "Valentina Ruiz",
    number: 7,
    position: "Armadora",
    bio: "Capitana y armadora de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "jugadora-camila-sosa",
    teamId: rosarioCentral.id,
    fullName: "Camila Sosa",
    number: 11,
    position: "Punta receptora",
    bio: "Referente ofensiva de Rosario Central Vóley.",
  } satisfies PlayerFixture),
] satisfies readonly PlayerFixture[]);

const tournamentStandings = Object.freeze([
  Object.freeze({ position: 1, teamName: riverPlate.name, played: 6, won: 6, lost: 0, sets: "16-6", points: 16 }),
  Object.freeze({ position: 2, teamName: ciudadVoley.name, played: 6, won: 4, lost: 2, sets: "14-8", points: 13 }),
  Object.freeze({ position: 3, teamName: upcnSanJuan.name, played: 5, won: 4, lost: 1, sets: "13-7", points: 12 }),
  Object.freeze({ position: 4, teamName: bocaJuniors.name, played: 6, won: 3, lost: 3, sets: "11-11", points: 10 }),
  Object.freeze({ position: 5, teamName: bolivar.name, played: 5, won: 2, lost: 3, sets: "9-12", points: 7 }),
  Object.freeze({ position: 6, teamName: monteros.name, played: 6, won: 1, lost: 5, sets: "7-15", points: 4 }),
  Object.freeze({ position: 7, teamName: "Obras San Juan", played: 5, won: 1, lost: 4, sets: "6-14", points: 4 }),
  Object.freeze({ position: 8, teamName: "Once Unidos", played: 5, won: 0, lost: 5, sets: "4-15", points: 1 }),
] satisfies readonly TournamentStandingFixture[]);

// Annotated rather than `satisfies`-checked: freezing each record individually means the array
// literal no longer receives the fixture type as a contextual type, so `playerId` (optional on a
// stat leader) would disappear from the inferred union. The annotation keeps the optional field
// and the immutable form.
const tournamentStatLeaders: readonly TournamentStatLeaderFixture[] = Object.freeze([
  Object.freeze({ category: "Puntos", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 142, unit: "pts" }),
  Object.freeze({ category: "Remates", playerName: "Camila Sosa", playerId: "jugadora-camila-sosa", teamName: rosarioCentral.name, teamId: rosarioCentral.id, value: 87, unit: "remates" }),
  Object.freeze({ category: "Bloqueos", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 34, unit: "bloqueos" }),
  Object.freeze({ category: "Saques", playerName: "Camila Sosa", playerId: "jugadora-camila-sosa", teamName: rosarioCentral.name, teamId: rosarioCentral.id, value: 19, unit: "aces" }),
  Object.freeze({ category: "Recepciones", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 156, unit: "recepciones" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: riverPlate.name, teamId: riverPlate.id, value: 16, unit: "pts" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: ciudadVoley.name, teamId: ciudadVoley.id, value: 13, unit: "pts" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: upcnSanJuan.name, teamId: upcnSanJuan.id, value: 12, unit: "pts" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: bocaJuniors.name, teamId: bocaJuniors.id, value: 10, unit: "pts" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: bolivar.name, teamId: bolivar.id, value: 7, unit: "pts" }),
  Object.freeze({ category: "Tabla general", playerName: "Clasificación", teamName: monteros.name, teamId: monteros.id, value: 4, unit: "pts" }),
]);

// Every record below is frozen down to each round and each match: the admin detail screens
// render this projection through `ADMIN.tournaments[…].detail`, and `scoring-admin.test.ts`
// walks the whole admin tree, so an unfrozen nested record would be a fixture that only looks
// immutable from the public side.
const tournamentBracketRounds = Object.freeze([
  Object.freeze({ round: "Cuartos de final", matches: Object.freeze([
    Object.freeze({ displayId: "qf-1", homeTeamName: "River Plate", awayTeamName: "Once Unidos", homeScore: 3, awayScore: 0, status: "played" }),
    Object.freeze({ displayId: "qf-2", homeTeamName: "Ciudad Voley", awayTeamName: "Obras San Juan", homeScore: 3, awayScore: 1, status: "played" }),
    Object.freeze({ displayId: "qf-3", homeTeamName: "UPCN San Juan", awayTeamName: "Monteros Voley", homeScore: 3, awayScore: 2, status: "played" }),
    Object.freeze({ displayId: "qf-4", matchId: "match-liga-rosarina-02", homeTeamName: rosarioCentral.name, homeTeamId: rosarioCentral.id, awayTeamName: sanJorge.name, awayTeamId: sanJorge.id, homeScore: 2, awayScore: 1, status: "live" }),
  ]) }),
  Object.freeze({ round: "Semifinal", matches: Object.freeze([
    Object.freeze({ displayId: "sf-1", homeTeamName: "River Plate", awayTeamName: "Ciudad Voley", homeScore: null, awayScore: null, status: "upcoming" }),
    Object.freeze({ displayId: "sf-2", homeTeamName: "UPCN San Juan", awayTeamName: "Boca Juniors", homeScore: null, awayScore: null, status: "upcoming" }),
  ]) }),
  Object.freeze({ round: "Final", matches: Object.freeze([
    Object.freeze({ displayId: "f-1", homeTeamName: "Por definir", awayTeamName: "Por definir", homeScore: null, awayScore: null, status: "upcoming" }),
  ]) }),
] satisfies readonly TournamentBracketRoundFixture[]);

const tournamentDetails = Object.freeze({
  standings: tournamentStandings,
  statLeaders: tournamentStatLeaders,
  bracketRounds: tournamentBracketRounds,
});

const ligaRosarina = Object.freeze({
  id: "liga-rosarina-apertura-2026",
  name: "Liga Rosarina Apertura 2026",
  status: "in-progress",
  statusLabel: "En curso",
  type: "Liga",
  typeLabel: "Liga",
  dateLabel: "Marzo a julio de 2026",
  location: "Rosario, Santa Fe",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

const copaLitoral = Object.freeze({
  id: "copa-litoral-2026",
  name: "Copa del Litoral 2026",
  status: "upcoming",
  statusLabel: "Próximo",
  type: "Copa",
  typeLabel: "Copa",
  dateLabel: "Agosto de 2026",
  location: "Santa Fe, Argentina",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

const torneoFederal = Object.freeze({
  id: "torneo-federal-verano-2026",
  name: "Torneo Federal de Verano 2026",
  status: "finished",
  statusLabel: "Finalizado",
  type: "Liga",
  typeLabel: "Liga",
  dateLabel: "Enero a febrero de 2026",
  location: "Córdoba, Argentina",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

const ligaA1 = Object.freeze({
  id: "liga-a1-2026",
  name: "Liga A1",
  status: "in-progress",
  statusLabel: "En curso",
  type: "Liga",
  typeLabel: "Liga",
  dateLabel: "Temporada 2026",
  location: "Argentina",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

const copaNacional = Object.freeze({
  id: "copa-nacional-2026",
  name: "Copa Nacional",
  status: "in-progress",
  statusLabel: "En curso",
  type: "Copa",
  typeLabel: "Copa",
  dateLabel: "Julio de 2026",
  location: "Argentina",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

export const PUBLIC_TOURNAMENTS = Object.freeze({
  all: Object.freeze([ligaRosarina, copaLitoral, torneoFederal, ligaA1, copaNacional]),
  inProgress: Object.freeze([ligaRosarina, ligaA1, copaNacional]),
  upcoming: Object.freeze([copaLitoral]),
  finished: Object.freeze([torneoFederal]),
} satisfies PublicTournamentFixtures);

const featuredDashboardLiveMatch = Object.freeze({
  id: "match-liga-a1-river-boca",
  status: "live",
  tournamentId: ligaA1.id,
  homeTeamId: riverPlate.id,
  homeTeamName: riverPlate.name,
  awayTeamId: bocaJuniors.id,
  awayTeamName: bocaJuniors.name,
  scheduledLabel: "Set 3 · 21-18",
  venue: "Estadio Monumental",
  badgeLabel: "En vivo",
  score: Object.freeze({ home: 21, away: 18 }),
} satisfies MatchFixture);

// The dashboard and live-detail designs are separate immutable visual snapshots.
// Their set totals intentionally differ even though both depict Set 3 at 21-18.
const riverBocaDashboardVisualSnapshot = Object.freeze({
  artboard: "VoleyTrack Public Dashboard - Desktop",
  setNumber: 3,
  homeSetsWon: 2,
  awaySetsWon: 1,
  currentScore: Object.freeze({ home: 21, away: 18 }),
} satisfies PublicVisualSnapshotFixture);

const riverBocaLiveDetailVisualSnapshot = Object.freeze({
  artboard: "VoleyTrack Live Match Detail - Desktop",
  setNumber: 3,
  homeSetsWon: 1,
  awaySetsWon: 1,
  currentScore: Object.freeze({ home: 21, away: 18 }),
} satisfies PublicVisualSnapshotFixture);

const ciudadUpcnLiveMatch = Object.freeze({
  id: "match-liga-a1-ciudad-upcn",
  status: "live",
  tournamentId: ligaA1.id,
  homeTeamId: ciudadVoley.id,
  homeTeamName: ciudadVoley.name,
  awayTeamId: upcnSanJuan.id,
  awayTeamName: upcnSanJuan.name,
  scheduledLabel: "Set 1",
  venue: "Estadio Gorki Grana",
  badgeLabel: "En vivo",
  score: Object.freeze({ home: 15, away: 10 }),
} satisfies MatchFixture);

const bolivarMonterosLiveMatch = Object.freeze({
  id: "match-copa-nacional-bolivar-monteros",
  status: "live",
  tournamentId: copaNacional.id,
  homeTeamId: bolivar.id,
  homeTeamName: bolivar.name,
  awayTeamId: monteros.id,
  awayTeamName: monteros.name,
  scheduledLabel: "Set 5",
  venue: "Complejo República de Venezuela",
  badgeLabel: "En vivo",
  score: Object.freeze({ home: 8, away: 6 }),
} satisfies MatchFixture);

const riverCiudadUpcomingMatch = Object.freeze({
  id: "match-liga-a1-river-ciudad",
  status: "today",
  tournamentId: ligaA1.id,
  homeTeamId: riverPlate.id,
  homeTeamName: riverPlate.name,
  awayTeamId: ciudadVoley.id,
  awayTeamName: ciudadVoley.name,
  scheduledLabel: "MIÉ 9 JUL · 20:00",
  venue: "Estadio Monumental",
  badgeLabel: "Confirmado",
  score: null,
} satisfies MatchFixture);

const upcnBolivarUpcomingMatch = Object.freeze({
  id: "match-liga-a1-upcn-bolivar",
  status: "upcoming",
  tournamentId: ligaA1.id,
  homeTeamId: upcnSanJuan.id,
  homeTeamName: upcnSanJuan.name,
  awayTeamId: bolivar.id,
  awayTeamName: bolivar.name,
  scheduledLabel: "JUE 10 JUL · 18:30",
  venue: "Aldo Cantoni",
  badgeLabel: "Programado",
  score: null,
} satisfies MatchFixture);

const bocaMonterosUpcomingMatch = Object.freeze({
  id: "match-copa-nacional-boca-monteros",
  status: "upcoming",
  tournamentId: copaNacional.id,
  homeTeamId: bocaJuniors.id,
  homeTeamName: bocaJuniors.name,
  awayTeamId: monteros.id,
  awayTeamName: monteros.name,
  scheduledLabel: "JUE 10 JUL · 21:00",
  venue: "La Bombonerita",
  badgeLabel: "Programado",
  score: null,
} satisfies MatchFixture);

const riverCiudadFinishedMatch = Object.freeze({
  id: "match-liga-a1-river-ciudad-finished",
  status: "finished",
  tournamentId: ligaA1.id,
  homeTeamId: riverPlate.id,
  homeTeamName: riverPlate.name,
  awayTeamId: ciudadVoley.id,
  awayTeamName: ciudadVoley.name,
  scheduledLabel: "Finalizado · 4 sets",
  venue: "Sede no informada",
  badgeLabel: "Finalizado",
  score: Object.freeze({ home: 3, away: 1 }),
} satisfies MatchFixture);

const upcnRiverFinishedMatch = Object.freeze({
  id: "match-liga-a1-upcn-river-finished",
  status: "finished",
  tournamentId: ligaA1.id,
  homeTeamId: upcnSanJuan.id,
  homeTeamName: upcnSanJuan.name,
  awayTeamId: riverPlate.id,
  awayTeamName: riverPlate.name,
  scheduledLabel: "Finalizado · 5 sets",
  venue: "Sede no informada",
  badgeLabel: "Finalizado",
  score: Object.freeze({ home: 3, away: 2 }),
} satisfies MatchFixture);

const riverBolivarUpcomingMatch = Object.freeze({
  id: "match-liga-a1-river-bolivar",
  status: "upcoming",
  tournamentId: ligaA1.id,
  homeTeamId: riverPlate.id,
  homeTeamName: riverPlate.name,
  awayTeamId: bolivar.id,
  awayTeamName: bolivar.name,
  scheduledLabel: "Jue 11 Jul · 20:00",
  venue: "Sede no informada",
  badgeLabel: "Programado",
  score: null,
} satisfies MatchFixture);

export const PUBLIC_DASHBOARD = Object.freeze({
  live: Object.freeze({
    featured: Object.freeze({
      match: featuredDashboardLiveMatch,
      tournamentName: "Liga A1",
      homeSetsWon: riverBocaDashboardVisualSnapshot.homeSetsWon,
      awaySetsWon: riverBocaDashboardVisualSnapshot.awaySetsWon,
      latestAction: "Ataque punto",
      // PROTOTYPE DATA — NOT REAL. The design's featured live card carries three values the
      // match record itself does not: a match clock, the officiating referee and the match
      // format (voleytrack-dashboard.html:51-54 — "21:42 · Árbitro: P. López",
      // "al mejor de 5"). They are the design prototype's own values, copied here so the
      // screen can render its structure; public.test.ts pins them only so the shape cannot
      // drift. They must be replaced by real data (a clock, a referee assignment and the
      // tournament's format) as soon as the backend exposes them, and must not be read as
      // facts about this match.
      bestOf: 5,
      clockLabel: "21:42",
      refereeName: "P. López",
      visualSnapshot: riverBocaDashboardVisualSnapshot,
    }),
    compact: Object.freeze([
      Object.freeze({ match: ciudadUpcnLiveMatch, tournamentName: "Liga A1" }),
      Object.freeze({ match: bolivarMonterosLiveMatch, tournamentName: "Copa Nacional" }),
    ]),
  }),
  upcoming: Object.freeze([
    Object.freeze({ match: riverCiudadUpcomingMatch, tournamentName: "Liga A1" }),
    Object.freeze({ match: upcnBolivarUpcomingMatch, tournamentName: "Liga A1" }),
    Object.freeze({ match: bocaMonterosUpcomingMatch, tournamentName: "Copa Nacional" }),
  ]),
});

export const PUBLIC_MATCHES = Object.freeze({
  upcoming: Object.freeze([
    Object.freeze({
      id: "match-liga-rosarina-01",
      status: "upcoming",
      tournamentId: ligaRosarina.id,
      homeTeamId: sanJorge.id,
      homeTeamName: sanJorge.name,
      awayTeamId: rosarioCentral.id,
      awayTeamName: rosarioCentral.name,
      scheduledLabel: "Sábado 18 de julio · 18:00",
      venue: "Club Atlético San Jorge",
      badgeLabel: "Próximo",
      score: null,
    } satisfies MatchFixture),
    upcnBolivarUpcomingMatch,
    bocaMonterosUpcomingMatch,
  ]),
  live: Object.freeze([
    Object.freeze({
      id: "match-liga-rosarina-02",
      status: "live",
      tournamentId: ligaRosarina.id,
      homeTeamId: rosarioCentral.id,
      homeTeamName: rosarioCentral.name,
      awayTeamId: sanJorge.id,
      awayTeamName: sanJorge.name,
      scheduledLabel: "Set 3 · 18:42",
      venue: "Club Rosario Central",
      badgeLabel: "En vivo",
      score: Object.freeze({ home: 2, away: 1 }),
    } satisfies MatchFixture),
    featuredDashboardLiveMatch,
    ciudadUpcnLiveMatch,
    bolivarMonterosLiveMatch,
  ]),
  today: Object.freeze([
    Object.freeze({
      id: "match-liga-rosarina-03",
      status: "today",
      tournamentId: ligaRosarina.id,
      homeTeamId: sanJorge.id,
      homeTeamName: sanJorge.name,
      awayTeamId: rosarioCentral.id,
      awayTeamName: rosarioCentral.name,
      scheduledLabel: "Hoy · 20:30",
      venue: "Club Atlético San Jorge",
      badgeLabel: "Hoy",
      score: null,
    } satisfies MatchFixture),
    riverCiudadUpcomingMatch,
  ]),
  finished: Object.freeze([
    Object.freeze({
      id: "match-liga-rosarina-04",
      status: "finished",
      tournamentId: ligaRosarina.id,
      homeTeamId: rosarioCentral.id,
      homeTeamName: rosarioCentral.name,
      awayTeamId: sanJorge.id,
      awayTeamName: sanJorge.name,
      scheduledLabel: "Viernes 10 de julio · 20:00",
      venue: "Club Rosario Central",
      badgeLabel: "Finalizado",
      score: Object.freeze({ home: 3, away: 1 }),
    } satisfies MatchFixture),
  ]),
} satisfies PublicMatchFixtures);

/**
 * Prototype data: the four tiles of the design's player `.kpi-grid`
 * (frontend/design/html/voleytrack-jugadores.html), including their `.kpi-sub` lines. The
 * app's previous canonical pairs (Puntos Totales 245, Eficacia Ataque 52%, Aces (Saques) 18,
 * Bloqueos 42) were superseded by the design's own labels, values and subs when the detail
 * screen moved onto `KpiGrid`/`Kpi`. The two ranking subs ("1º del torneo", "Top 3 liga")
 * have no app counterpart at all, so the whole set MUST be replaced by real per-player values
 * before the screen is trusted.
 */
const canonicalPlayerKpis = Object.freeze([
  Object.freeze({ label: "Puntos", value: "142", sub: "3.8 / set · 1º del torneo" }),
  Object.freeze({ label: "Ataque", value: "49%", sub: "Efectividad" }),
  Object.freeze({ label: "Bloqueo", value: "18", sub: "0.5 / set" }),
  Object.freeze({ label: "Saque ace", value: "11", sub: "Top 3 liga" }),
] satisfies PlayerDetailFixture["kpis"]);

const canonicalPlayerStatBreakdown = Object.freeze([
  Object.freeze({ id: "attack", label: "Ataque", value: "140 pts", barPercent: 100 }),
  Object.freeze({ id: "block", label: "Bloqueo", value: "42 pts", barPercent: 32 }),
  Object.freeze({ id: "serve", label: "Saque", value: "18 pts", barPercent: 16 }),
  Object.freeze({ id: "defense", label: "Defensa (Digs)", value: "85", barPercent: 60 }),
  Object.freeze({ id: "reception", label: "Recepción Perf.", value: "60%", barPercent: 80 }),
] satisfies PlayerDetailFixture["statBreakdown"]);

function playerRecentMatches(
  playerPoints: readonly [number, number, number, number],
): PlayerDetailFixture["recentMatches"] {
  return Object.freeze([
    Object.freeze({ match: PUBLIC_MATCHES.finished[0], tournamentName: ligaRosarina.name, playerPoints: playerPoints[0] }),
    Object.freeze({ match: PUBLIC_MATCHES.live[0], tournamentName: ligaRosarina.name, playerPoints: playerPoints[1] }),
    Object.freeze({ match: PUBLIC_MATCHES.today[0], tournamentName: ligaRosarina.name, playerPoints: playerPoints[2] }),
    Object.freeze({ match: PUBLIC_MATCHES.upcoming[0], tournamentName: ligaRosarina.name, playerPoints: playerPoints[3] }),
  ]);
}

export const PUBLIC_PLAYER_DETAILS = Object.freeze([
  Object.freeze({
    playerId: PUBLIC_PLAYERS[0].id,
    tournamentId: ligaRosarina.id,
    tournamentName: ligaRosarina.name,
    heightLabel: "1.95m",
    weightLabel: "88kg",
    ageLabel: "22 años",
    kpis: canonicalPlayerKpis,
    statBreakdown: canonicalPlayerStatBreakdown,
    recentMatches: playerRecentMatches([22, 18, 15, 25]),
  } satisfies PlayerDetailFixture),
  Object.freeze({
    playerId: PUBLIC_PLAYERS[1].id,
    tournamentId: ligaRosarina.id,
    tournamentName: ligaRosarina.name,
    heightLabel: "1.86m",
    weightLabel: "76kg",
    ageLabel: "24 años",
    kpis: canonicalPlayerKpis,
    statBreakdown: canonicalPlayerStatBreakdown,
    recentMatches: playerRecentMatches([21, 22, 17, 19]),
  } satisfies PlayerDetailFixture),
] satisfies readonly PlayerDetailFixture[]);

export const PUBLIC_TEAM_DETAILS = Object.freeze([
  Object.freeze({
    teamId: riverPlate.id,
    tournamentId: ligaA1.id,
    tournamentName: "Liga A1 Masculina",
    initials: "RP",
    standingLabel: "1° PUESTO",
    matchesPlayed: 6,
    wins: 5,
    sets: "16-6",
    points: 16,
    summaryStats: Object.freeze([
      Object.freeze({ label: "PUNTOS A FAVOR", value: 482 }),
      Object.freeze({ label: "PUNTOS EN CONTRA", value: 421 }),
      Object.freeze({ label: "ATAQUES PUNTO", value: 248 }),
      Object.freeze({ label: "BLOQUEOS PUNTO", value: 62 }),
    ]),
    rosterStats: Object.freeze([
      Object.freeze({ id: "mateo-silva", fullName: "Mateo Silva", number: 12, position: "Punta receptor", points: 128, attacks: 76, blocks: 18, aces: 16 }),
      Object.freeze({ id: "ivan-molina", fullName: "Iván Molina", number: 7, position: "Central", points: 74, attacks: 38, blocks: 24, aces: 12 }),
      Object.freeze({ id: "santiago-lopez", fullName: "Santiago López", number: 3, position: "Armador", points: 42, attacks: 22, blocks: 14, aces: 6 }),
      Object.freeze({ id: "facundo-rios", fullName: "Facundo Ríos", number: 9, position: "Opuesto", points: 39, attacks: 28, blocks: 8, aces: 3 }),
      Object.freeze({ id: "nicolas-vera", fullName: "Nicolás Vera", number: 1, position: "Líbero", points: 0, attacks: 0, blocks: 0, aces: 0 }),
    ]),
    matches: Object.freeze([
      Object.freeze({
        match: featuredDashboardLiveMatch,
        resultLabel: "EN VIVO",
        contextLabel: "Set 3 · Estadio Monumental",
      }),
      Object.freeze({
        match: riverCiudadFinishedMatch,
        resultLabel: "VICTORIA",
        contextLabel: "Finalizado · 4 sets",
      }),
      Object.freeze({
        match: upcnRiverFinishedMatch,
        resultLabel: "DERROTA",
        contextLabel: "Finalizado · 5 sets",
      }),
      Object.freeze({
        match: riverBolivarUpcomingMatch,
        resultLabel: "PRÓXIMO",
        contextLabel: "Jue 11 Jul · 20:00",
      }),
    ]),
    statCategories: Object.freeze([
      Object.freeze({ id: "points", label: "Puntos", leaderPlayerId: "mateo-silva", leaderValue: 128, unit: "pts" }),
      Object.freeze({ id: "attacks", label: "Ataques", leaderPlayerId: "mateo-silva", leaderValue: 76, unit: "ataques" }),
      Object.freeze({ id: "blocks", label: "Bloqueos", leaderPlayerId: "ivan-molina", leaderValue: 24, unit: "bloqueos" }),
      Object.freeze({ id: "aces", label: "Saques", leaderPlayerId: "mateo-silva", leaderValue: 16, unit: "saques" }),
    ]),
  } satisfies TeamDetailFixture),
] satisfies readonly TeamDetailFixture[]);

type TeamSide = "home" | "away";
type RotationSeed = Readonly<{ playerName: string; number: number }>;
type EventSeed = Readonly<{
  time: string;
  eventType: string;
  playerName: string;
  side: TeamSide;
  score: string;
  outcome: "point" | "error";
}>;
type LeaderSeed = Readonly<{
  playerName: string;
  side: TeamSide;
  points: number;
}>;
// `role` plus the four counting stats the design's roster rows print
// (PTS / ATA / BLQ / ACE). Index-aligned with the side's `RotationSeed` list, so the same
// six players carry the rotation slot and the per-player line instead of naming them twice.
type RosterSeed = Readonly<{
  role: string;
  points: number;
  attackPercent: number;
  blocks: number;
  aces: number;
}>;
type LiveDetailSeed = Readonly<{
  match: MatchFixture;
  tournamentName: string;
  servingSide: TeamSide;
  setScores: readonly Readonly<{ home: number; away: number }>[];
  homeRotation: readonly RotationSeed[];
  awayRotation: readonly RotationSeed[];
  homeRoster: readonly RosterSeed[];
  awayRoster: readonly RosterSeed[];
  events: readonly EventSeed[];
  leaders: readonly LeaderSeed[];
  teamStats: readonly LiveTeamStatFixture[];
  visualSnapshot?: PublicVisualSnapshotFixture;
}>;

function freezeRotation(
  teamId: string,
  teamName: string,
  players: readonly RotationSeed[],
): LiveTeamRotationFixture {
  const positions = Object.freeze(
    players.map((player, index) =>
      Object.freeze({
        position: index + 1,
        playerName: player.playerName,
        number: player.number,
      } satisfies LiveRotationPositionFixture),
    ),
  );

  return Object.freeze({ teamId, teamName, positions });
}

function freezeRoster(
  teamId: string,
  teamName: string,
  players: readonly RotationSeed[],
  stats: readonly RosterSeed[],
): LiveTeamRosterFixture {
  const roster = Object.freeze(
    players.map((player, index) =>
      Object.freeze({
        playerName: player.playerName,
        number: player.number,
        role: stats[index].role,
        points: stats[index].points,
        attackPercent: stats[index].attackPercent,
        blocks: stats[index].blocks,
        aces: stats[index].aces,
      } satisfies LiveRosterPlayerFixture),
    ),
  );

  return Object.freeze({ teamId, teamName, players: roster });
}

function createLiveDetail(seed: LiveDetailSeed): LiveMatchDetailFixture {
  const sets = Object.freeze(
    seed.setScores.map((set, index) =>
      Object.freeze({
        number: index + 1,
        home: set.home,
        away: set.away,
        status: index === seed.setScores.length - 1 ? "current" : "completed",
      } satisfies LiveSetFixture),
    ),
  );
  const completedSets = sets.filter(({ status }) => status === "completed");
  const currentSet = sets.at(-1)!;
  const teamIdentity = {
    home: { id: seed.match.homeTeamId, name: seed.match.homeTeamName },
    away: { id: seed.match.awayTeamId, name: seed.match.awayTeamName },
  } as const;
  const rotations = Object.freeze([
    freezeRotation(seed.match.homeTeamId, seed.match.homeTeamName, seed.homeRotation),
    freezeRotation(seed.match.awayTeamId, seed.match.awayTeamName, seed.awayRotation),
  ]) as readonly [LiveTeamRotationFixture, LiveTeamRotationFixture];
  const rosters = Object.freeze([
    freezeRoster(seed.match.homeTeamId, seed.match.homeTeamName, seed.homeRotation, seed.homeRoster),
    freezeRoster(seed.match.awayTeamId, seed.match.awayTeamName, seed.awayRotation, seed.awayRoster),
  ]) as readonly [LiveTeamRosterFixture, LiveTeamRosterFixture];
  const events = Object.freeze(
    seed.events.map((event, index) => {
      const team = teamIdentity[event.side];
      return Object.freeze({
        id: `${seed.match.id}-event-${index + 1}`,
        time: event.time,
        eventType: event.eventType,
        playerName: event.playerName,
        teamId: team.id,
        teamName: team.name,
        matchContext: `Set ${currentSet.number} · ${event.score}`,
        outcome: event.outcome,
      } satisfies LiveMatchEventFixture);
    }),
  );
  const playerLeaders = Object.freeze(
    seed.leaders.map((leader, index) => {
      const team = teamIdentity[leader.side];
      return Object.freeze({
        rank: index + 1,
        playerName: leader.playerName,
        teamId: team.id,
        teamName: team.name,
        points: leader.points,
      } satisfies LivePlayerStatFixture);
    }),
  );
  const teamStats = Object.freeze(
    seed.teamStats.map((stat) => Object.freeze({ ...stat })),
  );

  return Object.freeze({
    match: seed.match,
    tournamentName: seed.tournamentName,
    servingTeamId: teamIdentity[seed.servingSide].id,
    currentScore: Object.freeze({
      home: currentSet.home,
      away: currentSet.away,
    }),
    homeSetsWon: completedSets.filter(({ home, away }) => home > away).length,
    awaySetsWon: completedSets.filter(({ home, away }) => away > home).length,
    sets,
    rotations,
    rosters,
    events,
    playerLeaders,
    teamStats,
    ...(seed.visualSnapshot ? { visualSnapshot: seed.visualSnapshot } : {}),
  } satisfies LiveMatchDetailFixture);
}

export const PUBLIC_LIVE_MATCH_DETAILS = Object.freeze([
  createLiveDetail({
    match: PUBLIC_MATCHES.live[0],
    tournamentName: ligaRosarina.name,
    servingSide: "home",
    setScores: [
      { home: 25, away: 21 },
      { home: 22, away: 25 },
      { home: 18, away: 14 },
    ],
    homeRotation: [
      { playerName: "Camila Sosa", number: 11 },
      { playerName: "Martina López", number: 4 },
      { playerName: "Julieta Paz", number: 9 },
      { playerName: "Agustina Vega", number: 2 },
      { playerName: "Sofía Ríos", number: 6 },
      { playerName: "Malena Ortiz", number: 13 },
    ],
    awayRotation: [
      { playerName: "Valentina Ruiz", number: 7 },
      { playerName: "Lucía Gómez", number: 10 },
      { playerName: "Paula Acosta", number: 5 },
      { playerName: "Micaela Díaz", number: 12 },
      { playerName: "Carolina Ferreyra", number: 3 },
      { playerName: "Josefina Luna", number: 8 },
    ],
    // Prototype data. The design's "Estadísticas individuales" roster
    // (frontend/design/html/voleytrack-live.html, the `.roster-player` rows) prints PTS, ATA,
    // BLQ and ACE for all twelve players on court, and no fixture carried a per-player match
    // line. These values are transcribed in the design's shape and MUST be replaced by real
    // per-player match statistics; the design's own prototype numbers belong to different
    // teams, so they were not copied. Roles are the five volleyball positions the design's
    // `.roster-player-role` prints.
    homeRoster: [
      { role: "Punta", points: 22, attackPercent: 45, blocks: 1, aces: 1 },
      { role: "Central", points: 15, attackPercent: 49, blocks: 3, aces: 0 },
      { role: "Opuesto", points: 11, attackPercent: 39, blocks: 1, aces: 1 },
      { role: "Punta", points: 9, attackPercent: 43, blocks: 1, aces: 0 },
      { role: "Líbero", points: 0, attackPercent: 51, blocks: 0, aces: 0 },
      { role: "Armador", points: 5, attackPercent: 34, blocks: 0, aces: 2 },
    ],
    awayRoster: [
      { role: "Opuesto", points: 20, attackPercent: 43, blocks: 2, aces: 1 },
      { role: "Central", points: 14, attackPercent: 47, blocks: 3, aces: 1 },
      { role: "Punta", points: 10, attackPercent: 41, blocks: 1, aces: 0 },
      { role: "Punta", points: 7, attackPercent: 36, blocks: 0, aces: 1 },
      { role: "Líbero", points: 0, attackPercent: 53, blocks: 0, aces: 0 },
      { role: "Armador", points: 3, attackPercent: 30, blocks: 0, aces: 1 },
    ],
    events: [
      { time: "18:42", eventType: "Ataque punto", playerName: "Camila Sosa", side: "home", score: "18-14", outcome: "point" },
      { time: "18:40", eventType: "Error no forzado", playerName: "Lucía Gómez", side: "away", score: "17-14", outcome: "error" },
      { time: "18:38", eventType: "Bloqueo punto", playerName: "Martina López", side: "home", score: "17-13", outcome: "point" },
    ],
    leaders: [
      { playerName: "Camila Sosa", side: "home", points: 22 },
      { playerName: "Valentina Ruiz", side: "away", points: 20 },
      { playerName: "Martina López", side: "home", points: 15 },
    ],
    teamStats: [
      { label: "Ataques punto", home: 39, away: 35 },
      { label: "Bloqueos punto", home: 10, away: 8 },
      { label: "Saques punto", home: 6, away: 7 },
      { label: "Errores no forzados", home: 13, away: 16 },
    ],
  }),
  createLiveDetail({
    match: PUBLIC_MATCHES.live[1],
    tournamentName: ligaA1.name,
    servingSide: "home",
    setScores: [
      { home: 25, away: 20 },
      { home: 22, away: 25 },
      { home: 21, away: 18 },
    ],
    homeRotation: [
      { playerName: "Mateo Silva", number: 10 },
      { playerName: "Iván Molina", number: 7 },
      { playerName: "Lucas Acosta", number: 4 },
      { playerName: "Santiago Ruiz", number: 5 },
      { playerName: "Tomás Vega", number: 1 },
      { playerName: "Nicolás Pereyra", number: 12 },
    ],
    awayRotation: [
      { playerName: "Bruno Herrera", number: 9 },
      { playerName: "Joaquín López", number: 11 },
      { playerName: "Franco Díaz", number: 14 },
      { playerName: "Emiliano Torres", number: 3 },
      { playerName: "Martín Rojas", number: 2 },
      { playerName: "Alan Gómez", number: 8 },
    ],
    // Prototype data — see the first seed: the design's per-player roster line has no
    // counterpart in this projection yet and must be replaced by real match statistics.
    homeRoster: [
      { role: "Punta", points: 28, attackPercent: 46, blocks: 2, aces: 1 },
      { role: "Central", points: 18, attackPercent: 50, blocks: 4, aces: 0 },
      { role: "Opuesto", points: 11, attackPercent: 38, blocks: 1, aces: 1 },
      { role: "Punta", points: 9, attackPercent: 41, blocks: 1, aces: 0 },
      { role: "Líbero", points: 0, attackPercent: 55, blocks: 0, aces: 0 },
      { role: "Armador", points: 5, attackPercent: 33, blocks: 0, aces: 2 },
    ],
    awayRoster: [
      { role: "Opuesto", points: 24, attackPercent: 44, blocks: 2, aces: 1 },
      { role: "Central", points: 15, attackPercent: 48, blocks: 3, aces: 1 },
      { role: "Punta", points: 12, attackPercent: 40, blocks: 1, aces: 0 },
      { role: "Punta", points: 8, attackPercent: 37, blocks: 0, aces: 1 },
      { role: "Líbero", points: 0, attackPercent: 52, blocks: 0, aces: 0 },
      { role: "Armador", points: 4, attackPercent: 31, blocks: 0, aces: 2 },
    ],
    events: [
      { time: "21:45", eventType: "Ataque punto", playerName: "Mateo Silva", side: "home", score: "21-18", outcome: "point" },
      { time: "21:43", eventType: "Error no forzado", playerName: "Bruno Herrera", side: "away", score: "20-18", outcome: "error" },
      { time: "21:41", eventType: "Bloqueo punto", playerName: "Iván Molina", side: "home", score: "20-17", outcome: "point" },
    ],
    leaders: [
      { playerName: "Mateo Silva", side: "home", points: 28 },
      { playerName: "Bruno Herrera", side: "away", points: 24 },
      { playerName: "Iván Molina", side: "home", points: 18 },
    ],
    teamStats: [
      { label: "Ataques punto", home: 45, away: 38 },
      { label: "Bloqueos punto", home: 12, away: 9 },
      { label: "Saques punto", home: 8, away: 6 },
      { label: "Errores no forzados", home: 15, away: 18 },
    ],
    visualSnapshot: riverBocaLiveDetailVisualSnapshot,
  }),
  createLiveDetail({
    match: PUBLIC_MATCHES.live[2],
    tournamentName: ligaA1.name,
    servingSide: "away",
    setScores: [{ home: 15, away: 10 }],
    homeRotation: [
      { playerName: "Tomás Pereyra", number: 7 },
      { playerName: "Juan Cruz Medina", number: 12 },
      { playerName: "Lautaro Sosa", number: 4 },
      { playerName: "Facundo Paz", number: 15 },
      { playerName: "Ramiro Luna", number: 2 },
      { playerName: "Agustín Vera", number: 9 },
    ],
    awayRotation: [
      { playerName: "Nicolás Araya", number: 5 },
      { playerName: "Federico Gómez", number: 11 },
      { playerName: "Marcos Díaz", number: 8 },
      { playerName: "Ezequiel Ríos", number: 14 },
      { playerName: "Sebastián Ortiz", number: 3 },
      { playerName: "Leandro Ruiz", number: 10 },
    ],
    // Prototype data — see the first seed: the design's per-player roster line has no
    // counterpart in this projection yet and must be replaced by real match statistics.
    homeRoster: [
      { role: "Punta", points: 8, attackPercent: 42, blocks: 1, aces: 1 },
      { role: "Central", points: 5, attackPercent: 46, blocks: 1, aces: 0 },
      { role: "Opuesto", points: 4, attackPercent: 37, blocks: 0, aces: 0 },
      { role: "Punta", points: 3, attackPercent: 40, blocks: 1, aces: 0 },
      { role: "Líbero", points: 0, attackPercent: 50, blocks: 0, aces: 0 },
      { role: "Armador", points: 2, attackPercent: 32, blocks: 0, aces: 1 },
    ],
    awayRoster: [
      { role: "Opuesto", points: 6, attackPercent: 41, blocks: 1, aces: 1 },
      { role: "Central", points: 5, attackPercent: 45, blocks: 1, aces: 0 },
      { role: "Punta", points: 3, attackPercent: 38, blocks: 0, aces: 1 },
      { role: "Punta", points: 2, attackPercent: 35, blocks: 0, aces: 0 },
      { role: "Líbero", points: 0, attackPercent: 49, blocks: 0, aces: 0 },
      { role: "Armador", points: 1, attackPercent: 29, blocks: 0, aces: 1 },
    ],
    events: [
      { time: "20:18", eventType: "Ataque punto", playerName: "Tomás Pereyra", side: "home", score: "15-10", outcome: "point" },
      { time: "20:16", eventType: "Saque punto", playerName: "Nicolás Araya", side: "away", score: "14-10", outcome: "point" },
      { time: "20:14", eventType: "Error no forzado", playerName: "Federico Gómez", side: "away", score: "14-9", outcome: "error" },
    ],
    leaders: [
      { playerName: "Tomás Pereyra", side: "home", points: 8 },
      { playerName: "Nicolás Araya", side: "away", points: 6 },
      { playerName: "Juan Cruz Medina", side: "home", points: 5 },
    ],
    teamStats: [
      { label: "Ataques punto", home: 10, away: 7 },
      { label: "Bloqueos punto", home: 2, away: 1 },
      { label: "Saques punto", home: 2, away: 1 },
      { label: "Errores no forzados", home: 3, away: 5 },
    ],
  }),
  createLiveDetail({
    match: PUBLIC_MATCHES.live[3],
    tournamentName: copaNacional.name,
    servingSide: "home",
    setScores: [
      { home: 25, away: 22 },
      { home: 19, away: 25 },
      { home: 23, away: 25 },
      { home: 25, away: 21 },
      { home: 8, away: 6 },
    ],
    homeRotation: [
      { playerName: "Manuel Álvarez", number: 6 },
      { playerName: "Pedro Molina", number: 13 },
      { playerName: "Ignacio Silva", number: 4 },
      { playerName: "Gonzalo Paz", number: 10 },
      { playerName: "Matías Ríos", number: 2 },
      { playerName: "Franco Vera", number: 9 },
    ],
    awayRotation: [
      { playerName: "Santino Ruiz", number: 8 },
      { playerName: "Lucas Herrera", number: 11 },
      { playerName: "Bruno Sosa", number: 5 },
      { playerName: "Julián Acosta", number: 14 },
      { playerName: "Emiliano Luna", number: 3 },
      { playerName: "Tobías Gómez", number: 12 },
    ],
    // Prototype data — see the first seed: the design's per-player roster line has no
    // counterpart in this projection yet and must be replaced by real match statistics.
    homeRoster: [
      { role: "Punta", points: 25, attackPercent: 47, blocks: 2, aces: 1 },
      { role: "Central", points: 17, attackPercent: 51, blocks: 4, aces: 0 },
      { role: "Opuesto", points: 12, attackPercent: 40, blocks: 1, aces: 1 },
      { role: "Punta", points: 9, attackPercent: 44, blocks: 1, aces: 0 },
      { role: "Líbero", points: 0, attackPercent: 54, blocks: 0, aces: 0 },
      { role: "Armador", points: 4, attackPercent: 35, blocks: 0, aces: 2 },
    ],
    awayRoster: [
      { role: "Opuesto", points: 23, attackPercent: 45, blocks: 2, aces: 2 },
      { role: "Central", points: 16, attackPercent: 49, blocks: 3, aces: 1 },
      { role: "Punta", points: 11, attackPercent: 42, blocks: 1, aces: 0 },
      { role: "Punta", points: 8, attackPercent: 38, blocks: 0, aces: 1 },
      { role: "Líbero", points: 0, attackPercent: 51, blocks: 0, aces: 0 },
      { role: "Armador", points: 3, attackPercent: 30, blocks: 0, aces: 2 },
    ],
    events: [
      { time: "22:07", eventType: "Bloqueo punto", playerName: "Pedro Molina", side: "home", score: "8-6", outcome: "point" },
      { time: "22:05", eventType: "Ataque punto", playerName: "Santino Ruiz", side: "away", score: "7-6", outcome: "point" },
      { time: "22:03", eventType: "Error no forzado", playerName: "Lucas Herrera", side: "away", score: "7-5", outcome: "error" },
    ],
    leaders: [
      { playerName: "Manuel Álvarez", side: "home", points: 25 },
      { playerName: "Santino Ruiz", side: "away", points: 23 },
      { playerName: "Pedro Molina", side: "home", points: 17 },
    ],
    teamStats: [
      { label: "Ataques punto", home: 52, away: 49 },
      { label: "Bloqueos punto", home: 13, away: 11 },
      { label: "Saques punto", home: 7, away: 8 },
      { label: "Errores no forzados", home: 19, away: 21 },
    ],
  }),
] satisfies readonly LiveMatchDetailFixture[]);
