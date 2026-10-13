import { PUBLIC_MATCHES, PUBLIC_PLAYERS, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./public";
import type { AdminFixtures } from "./types";

const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
// The design's admin list shows exactly two tournaments, one Liga "En curso" and one Copa
// "Programado" (frontend/design/html/voleytrack-admin-torneos.html, the `tournaments-grid`
// cards). The admin fixture carried one row, so a "Tipo" filter could not exist; the design's
// second card is the app's own upcoming Copa.
const upcomingCup = PUBLIC_TOURNAMENTS.upcoming[0];
const match = PUBLIC_MATCHES.live[0];
const sanJorge = PUBLIC_TEAMS[0];
const rosarioCentral = PUBLIC_TEAMS[1];
const teamRecords = Object.freeze([
  Object.freeze({ id: sanJorge.id, name: sanJorge.name, city: sanJorge.city, coach: sanJorge.coach, category: sanJorge.category, playerCount: 1, status: "active", statusLabel: "Activo" }),
  Object.freeze({ id: rosarioCentral.id, name: rosarioCentral.name, city: rosarioCentral.city, coach: rosarioCentral.coach, category: rosarioCentral.category, playerCount: 1, status: "active", statusLabel: "Activo" }),
]);
const playerRecords = Object.freeze([
  Object.freeze({ id: PUBLIC_PLAYERS[0].id, teamId: sanJorge.id, teamName: sanJorge.name, fullName: PUBLIC_PLAYERS[0].fullName, number: 7, position: "Armadora", status: "active", statusLabel: "Activo" }),
  Object.freeze({ id: PUBLIC_PLAYERS[1].id, teamId: rosarioCentral.id, teamName: rosarioCentral.name, fullName: PUBLIC_PLAYERS[1].fullName, number: 11, position: "Punta receptora", status: "active", statusLabel: "Activo" }),
]);
const matchTournament = PUBLIC_TOURNAMENTS.all.find((item) => item.id === match.tournamentId);

// PROTOTYPE DATA — NOT REAL. The design's staff table carries a `Torneo` column and its edit
// modal a "Torneo asignado" select (frontend/design/html/voleytrack-admin-gestion.html); the
// single staff record is assigned to the tournament the rest of the fixtures already use.
// It must be replaced by a real staff-to-tournament assignment.
export const ADMIN = Object.freeze({
  staff: Object.freeze([Object.freeze({ id: "staff-planillero-mariana-lopez", fullName: "Mariana López", email: "mariana.lopez@voleytrack.test", role: "scorer", roleLabel: "Planillero", status: "active", statusLabel: "Activo", tournamentLabel: tournament.name })]),
  // PROTOTYPE DATA — NOT REAL: `matchesLabel` and `teamsLabel` are the design's own card
  // figures ("18 equipos · 132 partidos") written as fixed labels, because no fixture counts
  // matches or team registrations yet. They must be replaced by real counts.
  tournaments: Object.freeze([
    Object.freeze({
      id: tournament.id, name: tournament.name, status: tournament.status, statusLabel: tournament.statusLabel, category: tournament.category,
      dateLabel: tournament.dateLabel, location: tournament.location, matchesLabel: "12 partidos", teamsLabel: "8 equipos",
      detail: tournament,
    }),
    Object.freeze({
      id: upcomingCup.id, name: upcomingCup.name, status: upcomingCup.status, statusLabel: upcomingCup.statusLabel, category: upcomingCup.category,
      dateLabel: upcomingCup.dateLabel, location: upcomingCup.location, matchesLabel: "15 partidos", teamsLabel: "16 equipos",
      detail: upcomingCup,
    }),
  ]),
  matches: Object.freeze([Object.freeze({
    id: match.id, tournamentId: match.tournamentId, status: match.status, statusLabel: match.badgeLabel, scheduledLabel: match.scheduledLabel,
    // `MatchFixture` carries only the tournament id, so the name the design's card prints is
    // resolved here; a missing tournament prints an explicit gap rather than an empty label.
    tournamentName: matchTournament?.name ?? "Torneo no disponible",
    homeTeamId: match.homeTeamId, homeTeamName: match.homeTeamName, awayTeamId: match.awayTeamId, awayTeamName: match.awayTeamName, venue: match.venue,
  })]),
  teams: teamRecords,
  players: playerRecords,
} satisfies AdminFixtures);
