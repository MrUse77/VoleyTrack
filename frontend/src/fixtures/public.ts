import type {
  MatchFixture,
  PlayerFixture,
  PublicMatchFixtures,
  PublicTournamentFixtures,
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


export const PUBLIC_TEAMS = Object.freeze([sanJorge, rosarioCentral] satisfies readonly TeamFixture[]);

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
  { position: 1, teamName: "River Plate", played: 6, won: 6, lost: 0, sets: "16-6", points: 16 },
  { position: 2, teamName: "Ciudad Voley", played: 6, won: 4, lost: 2, sets: "14-8", points: 13 },
  { position: 3, teamName: "UPCN San Juan", played: 5, won: 4, lost: 1, sets: "13-7", points: 12 },
  { position: 4, teamName: "Boca Juniors", played: 6, won: 3, lost: 3, sets: "11-11", points: 10 },
  { position: 5, teamName: "Bolívar Voley", played: 5, won: 2, lost: 3, sets: "9-12", points: 7 },
  { position: 6, teamName: "Monteros Voley", played: 6, won: 1, lost: 5, sets: "7-15", points: 4 },
  { position: 7, teamName: "Obras San Juan", played: 5, won: 1, lost: 4, sets: "6-14", points: 4 },
  { position: 8, teamName: "Once Unidos", played: 5, won: 0, lost: 5, sets: "4-15", points: 1 },
] satisfies readonly TournamentStandingFixture[]);

const tournamentStatLeaders = Object.freeze([
  { category: "Puntos", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 142, unit: "pts" },
  { category: "Remates", playerName: "Camila Sosa", playerId: "jugadora-camila-sosa", teamName: rosarioCentral.name, teamId: rosarioCentral.id, value: 87, unit: "remates" },
  { category: "Bloqueos", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 34, unit: "bloqueos" },
  { category: "Saques", playerName: "Camila Sosa", playerId: "jugadora-camila-sosa", teamName: rosarioCentral.name, teamId: rosarioCentral.id, value: 19, unit: "aces" },
  { category: "Recepciones", playerName: "Valentina Ruiz", playerId: "jugadora-valentina-ruiz", teamName: sanJorge.name, teamId: sanJorge.id, value: 156, unit: "recepciones" },
] satisfies readonly TournamentStatLeaderFixture[]);

const tournamentBracketRounds = Object.freeze([
  { round: "Cuartos de final", matches: Object.freeze([
    { displayId: "qf-1", homeTeamName: "River Plate", awayTeamName: "Once Unidos", homeScore: 3, awayScore: 0, status: "played" },
    { displayId: "qf-2", homeTeamName: "Ciudad Voley", awayTeamName: "Obras San Juan", homeScore: 3, awayScore: 1, status: "played" },
    { displayId: "qf-3", homeTeamName: "UPCN San Juan", awayTeamName: "Monteros Voley", homeScore: 3, awayScore: 2, status: "played" },
    { displayId: "qf-4", matchId: "match-liga-rosarina-02", homeTeamName: rosarioCentral.name, homeTeamId: rosarioCentral.id, awayTeamName: sanJorge.name, awayTeamId: sanJorge.id, homeScore: 2, awayScore: 1, status: "live" },
  ]) },
  { round: "Semifinal", matches: Object.freeze([
    { displayId: "sf-1", homeTeamName: "River Plate", awayTeamName: "Ciudad Voley", homeScore: null, awayScore: null, status: "upcoming" },
    { displayId: "sf-2", homeTeamName: "UPCN San Juan", awayTeamName: "Boca Juniors", homeScore: null, awayScore: null, status: "upcoming" },
  ]) },
  { round: "Final", matches: Object.freeze([
    { displayId: "f-1", homeTeamName: "Por definir", awayTeamName: "Por definir", homeScore: null, awayScore: null, status: "upcoming" },
  ]) },
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
  dateLabel: "Enero a febrero de 2026",
  location: "Córdoba, Argentina",
  category: "Primera División",
  ...tournamentDetails,
} satisfies TournamentFixture);

export const PUBLIC_TOURNAMENTS = Object.freeze({
  all: Object.freeze([ligaRosarina, copaLitoral, torneoFederal]),
  inProgress: Object.freeze([ligaRosarina]),
  upcoming: Object.freeze([copaLitoral]),
  finished: Object.freeze([torneoFederal]),
} satisfies PublicTournamentFixtures);

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
