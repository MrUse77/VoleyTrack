export type MatchCategory = "LIVE" | "UPCOMING" | "RESULTS";

export interface MatchesBrowserVm {
  tag: string;
  title: string;
  subtitle: string;
  filters: MatchFilterVm[];
  sections: MatchSectionVm[];
}

export interface MatchFilterVm {
  label: string;
  active?: boolean;
}

export interface MatchSectionVm {
  category: MatchCategory;
  title: string;
  items: MatchCardVm[];
  emptyState: string;
}

export interface MatchCardVm {
  league: string;
  teams: [string, string];
  score: string;
  status: string;
  stage: string;
  badge?: string;
}

export const MATCHES_BROWSER_VM: MatchesBrowserVm = {
  tag: "Matches",
  title: "Match Center",
  subtitle: "Live scoreboard and category browser",
  filters: [
    { label: "ALL", active: true },
    { label: "LIVE" },
    { label: "UPCOMING" },
    { label: "RESULTS" },
  ],
  sections: [
    {
      category: "LIVE",
      title: "Live",
      emptyState: "No live matches available.",
      items: [
        {
          league: "VNL 2024",
          teams: ["Brazil", "Italy"],
          score: "2 - 1",
          status: "Set 4 · 24-22",
          stage: "Match point",
          badge: "LIVE",
        },
        {
          league: "World Cup",
          teams: ["USA", "Poland"],
          score: "1 - 1",
          status: "Set 3 · 18-19",
          stage: "Live",
        },
        {
          league: "CEV Cup",
          teams: ["France", "Japan"],
          score: "0 - 0",
          status: "Warm-up",
          stage: "Starting soon",
        },
      ],
    },
    {
      category: "UPCOMING",
      title: "Upcoming",
      emptyState: "No upcoming matches scheduled.",
      items: [
        {
          league: "Pool A",
          teams: ["USA", "POL"],
          score: "14:00",
          status: "Scheduled",
          stage: "Arena 2",
        },
        {
          league: "Pool B",
          teams: ["FRA", "JPN"],
          score: "16:00",
          status: "Scheduled",
          stage: "Arena 1",
        },
        {
          league: "Pool C",
          teams: ["ARG", "SLO"],
          score: "18:00",
          status: "Scheduled",
          stage: "Main court",
        },
      ],
    },
    {
      category: "RESULTS",
      title: "Results",
      emptyState: "No results available yet.",
      items: [
        {
          league: "World Cup",
          teams: ["CAN", "GER"],
          score: "3 - 1",
          status: "Completed",
          stage: "Final",
        },
        {
          league: "World Cup",
          teams: ["NED", "IRI"],
          score: "0 - 3",
          status: "Completed",
          stage: "Round 3",
        },
        {
          league: "World Cup",
          teams: ["CUB", "BUL"],
          score: "3 - 2",
          status: "Completed",
          stage: "Tie-break",
        },
        {
          league: "World Cup",
          teams: ["SRB", "FRA"],
          score: "1 - 3",
          status: "Completed",
          stage: "Quarterfinal",
        },
        {
          league: "World Cup",
          teams: ["USA", "BRA"],
          score: "2 - 3",
          status: "Completed",
          stage: "Semifinal",
        },
      ],
    },
  ],
};
