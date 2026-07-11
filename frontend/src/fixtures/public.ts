import type {
  MatchFixture,
  PlayerFixture,
  PublicMatchFixtures,
  PublicTournamentFixtures,
  TeamFixture,
  TournamentFixture,
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

const ligaRosarina = Object.freeze({
  id: "liga-rosarina-apertura-2026",
  name: "Liga Rosarina Apertura 2026",
  status: "in-progress",
  statusLabel: "En curso",
  dateLabel: "Marzo a julio de 2026",
  location: "Rosario, Santa Fe",
  category: "Primera División",
} satisfies TournamentFixture);

const copaLitoral = Object.freeze({
  id: "copa-litoral-2026",
  name: "Copa del Litoral 2026",
  status: "upcoming",
  statusLabel: "Próximo",
  dateLabel: "Agosto de 2026",
  location: "Santa Fe, Argentina",
  category: "Primera División",
} satisfies TournamentFixture);

const torneoFederal = Object.freeze({
  id: "torneo-federal-verano-2026",
  name: "Torneo Federal de Verano 2026",
  status: "finished",
  statusLabel: "Finalizado",
  dateLabel: "Enero a febrero de 2026",
  location: "Córdoba, Argentina",
  category: "Primera División",
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
