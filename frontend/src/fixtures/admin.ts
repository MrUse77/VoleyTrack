import { PUBLIC_MATCHES, PUBLIC_PLAYERS, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./public";
import type { AdminFixtures } from "./types";

const tournament = PUBLIC_TOURNAMENTS.inProgress[0];
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

export const ADMIN = Object.freeze({
  staff: Object.freeze([Object.freeze({ id: "staff-planillero-mariana-lopez", fullName: "Mariana López", email: "mariana.lopez@voleytrack.test", role: "scorer", roleLabel: "Planillero", status: "active", statusLabel: "Activo" })]),
  tournaments: Object.freeze([Object.freeze({
    id: tournament.id, name: tournament.name, status: tournament.status, statusLabel: tournament.statusLabel, category: tournament.category,
    dateLabel: tournament.dateLabel, location: tournament.location, matchesLabel: "12 partidos", teamsLabel: "8 equipos",
  })]),
  matches: Object.freeze([Object.freeze({
    id: match.id, tournamentId: match.tournamentId, status: match.status, statusLabel: match.badgeLabel, scheduledLabel: match.scheduledLabel,
    homeTeamId: match.homeTeamId, homeTeamName: match.homeTeamName, awayTeamId: match.awayTeamId, awayTeamName: match.awayTeamName, venue: match.venue,
  })]),
  teams: teamRecords,
  players: playerRecords,
} satisfies AdminFixtures);
