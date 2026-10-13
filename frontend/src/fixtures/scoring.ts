import { PUBLIC_MATCHES, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./public";
import type {
  ScoringConsoleFixture,
  ScoringFixtures,
  PlayerFixture,
  ScoringPointEntryFixture,
  ScoringSetFixture,
  ScoringSetupFixture,
  ScoringSummaryFixture,
  ScoringSummaryMetricFixture,
  ScoringSummaryMvpFixture,
  ScoringTeamFixture,
} from "./types";

const liveMatch = PUBLIC_MATCHES.live[0];
const homeTeam = Object.freeze({ id: PUBLIC_TEAMS[1].id, name: PUBLIC_TEAMS[1].name, shortName: "Central" } satisfies ScoringTeamFixture);
const awayTeam = Object.freeze({ id: PUBLIC_TEAMS[0].id, name: PUBLIC_TEAMS[0].name, shortName: "San Jorge" } satisfies ScoringTeamFixture);

const scoringRoster = Object.freeze([
  Object.freeze({
    id: "jugadora-valentina-ruiz",
    teamId: awayTeam.id,
    fullName: "Valentina Ruiz",
    number: 7,
    position: "Armadora",
    bio: "Capitana y armadora de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-julieta-benitez",
    teamId: awayTeam.id,
    fullName: "Julieta Benítez",
    number: 2,
    position: "Punta receptora",
    bio: "Punta receptora de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-micaela-torres",
    teamId: awayTeam.id,
    fullName: "Micaela Torres",
    number: 12,
    position: "Punta receptora",
    bio: "Punta receptora de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-florencia-acosta",
    teamId: awayTeam.id,
    fullName: "Florencia Acosta",
    number: 9,
    position: "Opuesta",
    bio: "Opuesta de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-agustina-medina",
    teamId: awayTeam.id,
    fullName: "Agustina Medina",
    number: 5,
    position: "Central",
    bio: "Central de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-sofia-paz",
    teamId: awayTeam.id,
    fullName: "Sofía Paz",
    number: 14,
    position: "Central",
    bio: "Central de Club Atlético San Jorge.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "jugadora-camila-sosa",
    teamId: homeTeam.id,
    fullName: "Camila Sosa",
    number: 11,
    position: "Punta receptora",
    bio: "Referente ofensiva de Rosario Central Vóley.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-lucia-ferreyra",
    teamId: homeTeam.id,
    fullName: "Lucía Ferreyra",
    number: 4,
    position: "Armadora",
    bio: "Armadora de Rosario Central Vóley.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-martina-rios",
    teamId: homeTeam.id,
    fullName: "Martina Ríos",
    number: 8,
    position: "Punta receptora",
    bio: "Punta receptora de Rosario Central Vóley.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-paula-gimenez",
    teamId: homeTeam.id,
    fullName: "Paula Giménez",
    number: 10,
    position: "Opuesta",
    bio: "Opuesta de Rosario Central Vóley.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-daniela-lopez",
    teamId: homeTeam.id,
    fullName: "Daniela López",
    number: 6,
    position: "Central",
    bio: "Central de Rosario Central Vóley.",
  } satisfies PlayerFixture),
  Object.freeze({
    id: "scoring-jugadora-rocio-navarro",
    teamId: homeTeam.id,
    fullName: "Rocío Navarro",
    number: 15,
    position: "Central",
    bio: "Central de Rosario Central Vóley.",
  } satisfies PlayerFixture),
] satisfies readonly PlayerFixture[]);

export const SCORING_ROSTER = scoringRoster;

const sets = Object.freeze([
  Object.freeze({ id: "set-liga-rosarina-02-1", label: "Set 1", home: 25, away: 21 } satisfies ScoringSetFixture),
  Object.freeze({ id: "set-liga-rosarina-02-2", label: "Set 2", home: 22, away: 25 } satisfies ScoringSetFixture),
  Object.freeze({ id: "set-liga-rosarina-02-3", label: "Set 3", home: 15, away: 12 } satisfies ScoringSetFixture),
]);

const matchSetup = Object.freeze({
  id: "scoring-setup-liga-rosarina-02", matchId: liveMatch.id, title: "Configurar partido",
  tournamentName: PUBLIC_TOURNAMENTS.inProgress[0].name, scheduledLabel: liveMatch.scheduledLabel, venue: liveMatch.venue,
  homeTeam, awayTeam,
  steps: Object.freeze([
    Object.freeze({ id: "setup-step-teams", label: "Seleccionar equipos", description: "Elegí los equipos que disputan el partido." }),
    Object.freeze({ id: "setup-step-sets", label: "Configurar sets", description: "Definí la configuración de sets para este partido." }),
    Object.freeze({ id: "setup-step-confirm", label: "Confirmar partido", description: "Revisá los datos antes de comenzar la planilla." }),
  ]),
} satisfies ScoringSetupFixture);
const consoleFixture = Object.freeze({
  id: "scoring-console-liga-rosarina-02", matchId: liveMatch.id, title: "Planilla en vivo", status: "live", statusLabel: "En vivo",
  homeTeamId: homeTeam.id, homeTeamName: homeTeam.name, awayTeamId: awayTeam.id, awayTeamName: awayTeam.name,
  score: Object.freeze({ home: 2, away: 1 }), currentSetLabel: "Set 3", sets,
  actionLabels: Object.freeze(["Anotar punto", "Sustitución"]),
} satisfies ScoringConsoleFixture);
const pointEntry = Object.freeze({
  id: "point-entry-liga-rosarina-02", matchId: liveMatch.id, title: "Anotar punto",
  steps: Object.freeze([
    Object.freeze({ id: "point-step-team", label: "Seleccionar equipo que anota", description: "Elegí el equipo que ganó el punto." }),
    Object.freeze({ id: "point-step-action", label: "Seleccionar jugador", description: "Registrar acción: elegí el jugador titular que realizó la acción." }),
    Object.freeze({ id: "point-step-type", label: "Seleccionar tipo de punto", description: "Elegí el fundamento que describe el punto." }),
    Object.freeze({ id: "point-step-confirm", label: "Revisar y confirmar punto", description: "Verificá el resumen antes de confirmar el punto." }),
  ]),
} satisfies ScoringPointEntryFixture);

export const POINT_TYPES = Object.freeze([
  "Ataque punto",
  "Bloqueo punto",
  "Saque directo (ace)",
  "Error no forzado del rival",
]);
const summarySets = Object.freeze([
  Object.freeze({ id: "set-liga-rosarina-04-1", label: "Set 1", home: 25, away: 23 } satisfies ScoringSetFixture),
  Object.freeze({ id: "set-liga-rosarina-04-2", label: "Set 2", home: 21, away: 25 } satisfies ScoringSetFixture),
  Object.freeze({ id: "set-liga-rosarina-04-3", label: "Set 3", home: 25, away: 18 } satisfies ScoringSetFixture),
  Object.freeze({ id: "set-liga-rosarina-04-4", label: "Set 4", home: 25, away: 20 } satisfies ScoringSetFixture),
]);
const summaryStats = Object.freeze([
  Object.freeze({ id: "summary-stat-attacks", label: "Ataques", home: 45, away: 38 } satisfies ScoringSummaryMetricFixture),
  Object.freeze({ id: "summary-stat-blocks", label: "Bloqueos", home: 12, away: 9 } satisfies ScoringSummaryMetricFixture),
  Object.freeze({ id: "summary-stat-aces", label: "Saques directos", home: 5, away: 3 } satisfies ScoringSummaryMetricFixture),
  Object.freeze({ id: "summary-stat-errors", label: "Errores no forzados", home: 20, away: 24 } satisfies ScoringSummaryMetricFixture),
]);
const summaryMvp = Object.freeze({
  playerName: "Camila Sosa", number: 11, teamName: PUBLIC_MATCHES.finished[0].homeTeamName,
  detail: "22 puntos · 18 ataques, 3 bloqueos y 1 saque directo",
} satisfies ScoringSummaryMvpFixture);
const summary = Object.freeze({
  id: "match-summary-liga-rosarina-04", matchId: PUBLIC_MATCHES.finished[0].id, title: "Resumen del partido", statusLabel: "Finalizado",
  homeTeamName: PUBLIC_MATCHES.finished[0].homeTeamName, awayTeamName: PUBLIC_MATCHES.finished[0].awayTeamName,
  finalScore: Object.freeze(PUBLIC_MATCHES.finished[0].score!), sets: summarySets, stats: summaryStats, mvp: summaryMvp,
} satisfies ScoringSummaryFixture);

export const SCORING = Object.freeze({ matchSetup, console: consoleFixture, pointEntry, summary } satisfies ScoringFixtures);
