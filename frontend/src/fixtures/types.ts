export type MatchStatus = "upcoming" | "live" | "today" | "finished";
export type TournamentStatus = "in-progress" | "upcoming" | "finished";
/**
 * The design's tournament type dimension: the "Tipo" filter offers Liga and Copa
 * (frontend/design/html/voleytrack-torneos.html, the `tournaments-type-filter` select).
 * The third option there, "Bracket", is not a competition type: its own card reads
 * "Diseño exploratorio, no en V1" (same file, the `tournament-card-bracket` card).
 */
export type TournamentType = "Liga" | "Copa";

export type MatchScore = Readonly<{
  home: number;
  away: number;
}>;

export type MatchFixture = Readonly<{
  id: string;
  status: MatchStatus;
  tournamentId: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  scheduledLabel: string;
  venue: string;
  badgeLabel: string;
  score: MatchScore | null;
}>;

export type LiveSetFixture = Readonly<{
  number: number;
  home: number;
  away: number;
  status: "completed" | "current";
}>;

export type LiveRotationPositionFixture = Readonly<{
  position: number;
  playerName: string;
  number: number;
}>;

export type LiveTeamRotationFixture = Readonly<{
  teamId: string;
  teamName: string;
  positions: readonly LiveRotationPositionFixture[];
}>;

/**
 * One player's per-match line in the design's "Estadísticas individuales" roster
 * (frontend/design/html/voleytrack-live.html, the `.roster-player` rows: photo, name and
 * shirt number, role, then PTS / ATA / BLQ / ACE). `role` is the volleyball position the
 * design prints under the name ("Punta", "Central", "Opuesto", "Líbero", "Armador").
 */
export type LiveRosterPlayerFixture = Readonly<{
  playerName: string;
  number: number;
  role: string;
  points: number;
  attackPercent: number;
  blocks: number;
  aces: number;
}>;

export type LiveTeamRosterFixture = Readonly<{
  teamId: string;
  teamName: string;
  players: readonly LiveRosterPlayerFixture[];
}>;

export type LiveMatchEventFixture = Readonly<{
  id: string;
  time: string;
  eventType: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matchContext: string;
  outcome: "point" | "error";
}>;

export type LivePlayerStatFixture = Readonly<{
  rank: number;
  playerName: string;
  teamId: string;
  teamName: string;
  points: number;
}>;

export type LiveTeamStatFixture = Readonly<{
  label: "Ataques punto" | "Bloqueos punto" | "Saques punto" | "Errores no forzados";
  home: number;
  away: number;
}>;

export type PublicVisualSnapshotFixture = Readonly<{
  artboard: string;
  setNumber: number;
  homeSetsWon: number;
  awaySetsWon: number;
  currentScore: MatchScore;
}>;

export type LiveMatchDetailFixture = Readonly<{
  match: MatchFixture;
  tournamentName: string;
  servingTeamId: string;
  currentScore: MatchScore;
  homeSetsWon: number;
  awaySetsWon: number;
  sets: readonly LiveSetFixture[];
  rotations: readonly [LiveTeamRotationFixture, LiveTeamRotationFixture];
  rosters: readonly [LiveTeamRosterFixture, LiveTeamRosterFixture];
  events: readonly LiveMatchEventFixture[];
  playerLeaders: readonly LivePlayerStatFixture[];
  teamStats: readonly LiveTeamStatFixture[];
  visualSnapshot?: PublicVisualSnapshotFixture;
}>;

export type TournamentFixture = Readonly<{
  id: string;
  name: string;
  status: TournamentStatus;
  statusLabel: string;
  type: TournamentType;
  typeLabel: string;
  dateLabel: string;
  location: string;
  category: string;
  standings: readonly TournamentStandingFixture[];
  statLeaders: readonly TournamentStatLeaderFixture[];
  bracketRounds: readonly TournamentBracketRoundFixture[];
}>;

export type TournamentStandingFixture = Readonly<{
  position: number;
  teamName: string;
  teamId?: string;
  played: number;
  won: number;
  lost: number;
  sets: string;
  points: number;
}>;

export type TournamentStatLeaderFixture = Readonly<{
  category: string;
  playerName: string;
  playerId?: string;
  teamName: string;
  teamId?: string;
  value: number;
  unit: string;
}>;

export type TournamentBracketMatchFixture = Readonly<{
  displayId: string;
  matchId?: string;
  homeTeamName: string;
  homeTeamId?: string;
  awayTeamName: string;
  awayTeamId?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "played" | "live" | "upcoming";
}>;

export type TournamentBracketRoundFixture = Readonly<{
  round: string;
  matches: readonly TournamentBracketMatchFixture[];
}>;

export type TeamFixture = Readonly<{
  id: string;
  name: string;
  city: string;
  coach: string;
  category: string;
  rosterPlayerIds: readonly string[];
}>;

export type TeamSummaryStatFixture = Readonly<{
  label: "PUNTOS A FAVOR" | "PUNTOS EN CONTRA" | "ATAQUES PUNTO" | "BLOQUEOS PUNTO";
  value: number;
}>;

export type TeamRosterStatFixture = Readonly<{
  id: string;
  fullName: string;
  number: number;
  position: string;
  playerDetailId?: string;
  points: number;
  attacks: number;
  blocks: number;
  aces: number;
}>;

export type TeamMatchReferenceFixture = Readonly<{
  match: MatchFixture;
  resultLabel: "EN VIVO" | "VICTORIA" | "DERROTA" | "PRÓXIMO";
  contextLabel: string;
}>;

export type TeamStatCategoryFixture = Readonly<{
  id: "points" | "attacks" | "blocks" | "aces";
  label: "Puntos" | "Ataques" | "Bloqueos" | "Saques";
  leaderPlayerId: string;
  leaderValue: number;
  unit: "pts" | "ataques" | "bloqueos" | "saques";
}>;

export type TeamDetailFixture = Readonly<{
  teamId: string;
  tournamentId: string;
  tournamentName: string;
  initials: string;
  standingLabel: string;
  matchesPlayed: number;
  wins: number;
  sets: string;
  points: number;
  summaryStats: readonly TeamSummaryStatFixture[];
  rosterStats: readonly TeamRosterStatFixture[];
  matches: readonly TeamMatchReferenceFixture[];
  statCategories: readonly TeamStatCategoryFixture[];
}>;

export type PlayerFixture = Readonly<{
  id: string;
  teamId: string;
  fullName: string;
  number: number;
  position: string;
  bio: string;
}>;

export type PlayerKpiFixture = Readonly<{
  label: "Puntos" | "Ataque" | "Bloqueo" | "Saque ace";
  value: string;
  /**
   * The design's `.kpi-sub` line (voleytrack-jugadores.html, the player view's `.kpi` tiles).
   */
  sub: string;
}>;

export type PlayerStatBreakdownFixture = Readonly<{
  id: "attack" | "block" | "serve" | "defense" | "reception";
  label: "Ataque" | "Bloqueo" | "Saque" | "Defensa (Digs)" | "Recepción Perf.";
  value: string;
  barPercent: number;
  tone: "attack" | "block" | "serve" | "defense" | "reception";
}>;

export type PlayerRecentMatchFixture = Readonly<{
  match: MatchFixture;
  tournamentName: string;
  playerPoints: number;
}>;

export type PlayerDetailFixture = Readonly<{
  playerId: string;
  tournamentId: string;
  tournamentName: string;
  heightLabel: string;
  weightLabel: string;
  ageLabel: string;
  kpis: readonly PlayerKpiFixture[];
  statBreakdown: readonly PlayerStatBreakdownFixture[];
  recentMatches: readonly PlayerRecentMatchFixture[];
}>;

export type PublicMatchFixtures = Readonly<{
  upcoming: readonly MatchFixture[];
  live: readonly MatchFixture[];
  today: readonly MatchFixture[];
  finished: readonly MatchFixture[];
}>;

export type PublicTournamentFixtures = Readonly<{
  all: readonly TournamentFixture[];
  inProgress: readonly TournamentFixture[];
  upcoming: readonly TournamentFixture[];
  finished: readonly TournamentFixture[];
}>;

export type ScoringMatchStatus = "setup" | "live" | "finished";
export type ScoringTeamFixture = Readonly<{ id: string; name: string; shortName: string }>;
export type ScoringSetFixture = Readonly<{ id: string; label: string; home: number; away: number }>;
export type ScoringSetupStepFixture = Readonly<{ id: string; label: string; description: string }>;
export type ScoringSetupFixture = Readonly<{
  id: string; matchId: string; title: string; tournamentName: string;
  scheduledLabel: string; venue: string; homeTeam: ScoringTeamFixture; awayTeam: ScoringTeamFixture;
  steps: readonly ScoringSetupStepFixture[];
}>;
export type ScoringConsoleFixture = Readonly<{
  id: string; matchId: string; title: string; status: ScoringMatchStatus; statusLabel: string;
  homeTeamId: string; homeTeamName: string; awayTeamId: string; awayTeamName: string; score: MatchScore;
  currentSetLabel: string; sets: readonly ScoringSetFixture[]; actionLabels: readonly string[];
}>;
export type ScoringPointStepFixture = Readonly<{ id: string; label: string; description: string }>;
export type ScoringPointEntryFixture = Readonly<{
  id: string; matchId: string; title: string; steps: readonly ScoringPointStepFixture[];
}>;
export type ScoringSummaryMetricFixture = Readonly<{
  id: string; label: string; home: number; away: number;
}>;
export type ScoringSummaryMvpFixture = Readonly<{
  playerName: string; number: number; teamName: string; detail: string;
}>;
export type ScoringSummaryFixture = Readonly<{
  id: string; matchId: string; title: string; statusLabel: string; homeTeamName: string; awayTeamName: string;
  finalScore: MatchScore; sets: readonly ScoringSetFixture[];
  stats?: readonly ScoringSummaryMetricFixture[]; mvp?: ScoringSummaryMvpFixture | null;
}>;
export type ScoringFixtures = Readonly<{
  matchSetup: ScoringSetupFixture; console: ScoringConsoleFixture; pointEntry: ScoringPointEntryFixture; summary: ScoringSummaryFixture;
}>;

export type AdminStaffFixture = Readonly<{
  id: string; fullName: string; email: string; role: string; roleLabel: string; status: string; statusLabel: string;
  /**
   * The design's `Torneo` column and "Torneo asignado" select
   * (frontend/design/html/voleytrack-admin-gestion.html). The staff record had no
   * assignment at all, so the shape gains the field the design renders.
   */
  tournamentLabel: string;
}>;
export type AdminTournamentFixture = Readonly<{
  id: string; name: string; status: TournamentStatus; statusLabel: string; category: string; dateLabel: string;
  location: string; matchesLabel: string; teamsLabel: string;
}>;
export type AdminMatchFixture = Readonly<{
  id: string; tournamentId: string; status: MatchStatus; statusLabel: string; scheduledLabel: string;
  /**
   * The design's match card prints the competition next to the schedule
   * (frontend/design/html/voleytrack-admin-partidos.html, `.match-meta`), and the match
   * record only carried `tournamentId`; the name is resolved from the tournament fixture.
   */
  tournamentName: string;
  homeTeamId: string; homeTeamName: string; awayTeamId: string; awayTeamName: string; venue: string;
}>;
export type AdminTeamFixture = Readonly<{
  id: string; name: string; city: string; coach: string; category: string; playerCount: number; status: string; statusLabel: string;
}>;
export type AdminPlayerFixture = Readonly<{
  id: string; teamId: string; teamName: string; fullName: string; number: number; position: string; status: string; statusLabel: string;
}>;
export type AdminFixtures = Readonly<{
  staff: readonly AdminStaffFixture[]; tournaments: readonly AdminTournamentFixture[]; matches: readonly AdminMatchFixture[];
  teams: readonly AdminTeamFixture[]; players: readonly AdminPlayerFixture[];
}>;
