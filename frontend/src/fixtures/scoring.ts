import { PUBLIC_MATCHES, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./public";
import type {
  ScoringConsoleFixture,
  ScoringFixtures,
  ScoringPointEntryFixture,
  ScoringSetFixture,
  ScoringSetupFixture,
  ScoringSummaryFixture,
  ScoringTeamFixture,
} from "./types";

const liveMatch = PUBLIC_MATCHES.live[0];
const homeTeam = Object.freeze({ id: PUBLIC_TEAMS[1].id, name: PUBLIC_TEAMS[1].name, shortName: "Central" } satisfies ScoringTeamFixture);
const awayTeam = Object.freeze({ id: PUBLIC_TEAMS[0].id, name: PUBLIC_TEAMS[0].name, shortName: "San Jorge" } satisfies ScoringTeamFixture);
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
    Object.freeze({ id: "point-step-action", label: "Registrar acción", description: "Mostrá la acción del punto." }),
  ]),
} satisfies ScoringPointEntryFixture);
const summary = Object.freeze({
  id: "match-summary-liga-rosarina-04", matchId: PUBLIC_MATCHES.finished[0].id, title: "Resumen del partido", statusLabel: "Finalizado",
  homeTeamName: PUBLIC_MATCHES.finished[0].homeTeamName, awayTeamName: PUBLIC_MATCHES.finished[0].awayTeamName,
  finalScore: Object.freeze(PUBLIC_MATCHES.finished[0].score!), sets,
} satisfies ScoringSummaryFixture);

export const SCORING = Object.freeze({ matchSetup, console: consoleFixture, pointEntry, summary } satisfies ScoringFixtures);
