export type MatchStatus = "upcoming" | "live" | "today" | "finished";
export type TournamentStatus = "in-progress" | "upcoming" | "finished";

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

export type TournamentFixture = Readonly<{
  id: string;
  name: string;
  status: TournamentStatus;
  statusLabel: string;
  dateLabel: string;
  location: string;
  category: string;
}>;

export type TeamFixture = Readonly<{
  id: string;
  name: string;
  city: string;
  coach: string;
  category: string;
  rosterPlayerIds: readonly string[];
}>;

export type PlayerFixture = Readonly<{
  id: string;
  teamId: string;
  fullName: string;
  number: number;
  position: string;
  bio: string;
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
export type ScoringSummaryFixture = Readonly<{
  id: string; matchId: string; title: string; statusLabel: string; homeTeamName: string; awayTeamName: string;
  finalScore: MatchScore; sets: readonly ScoringSetFixture[];
}>;
export type ScoringFixtures = Readonly<{
  matchSetup: ScoringSetupFixture; console: ScoringConsoleFixture; pointEntry: ScoringPointEntryFixture; summary: ScoringSummaryFixture;
}>;

export type AdminStaffFixture = Readonly<{
  id: string; fullName: string; email: string; role: string; roleLabel: string; status: string; statusLabel: string;
}>;
export type AdminTournamentFixture = Readonly<{
  id: string; name: string; status: TournamentStatus; statusLabel: string; category: string; dateLabel: string;
  location: string; matchesLabel: string; teamsLabel: string;
}>;
export type AdminMatchFixture = Readonly<{
  id: string; tournamentId: string; status: MatchStatus; statusLabel: string; scheduledLabel: string;
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
