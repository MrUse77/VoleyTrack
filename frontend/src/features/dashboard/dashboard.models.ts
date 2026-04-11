export interface DashboardHomeVm {
  hero: DashboardHeroVm;
  liveMatches: DashboardLiveMatchVm[];
  rail: DashboardRailCardVm[];
}

export interface DashboardHeroVm {
  title: string;
  subtitle: string;
  tag: string;
  ctaLabel: string;
  liveLabel: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  setLabel: string;
  setScores: string[];
}

export interface DashboardLiveMatchVm {
  league: string;
  teams: [string, string];
  score: string;
  status: string;
  stage: string;
}

export interface DashboardRailCardVm {
  title: string;
  subtitle?: string;
  type: "players" | "standings" | "promo";
  items: DashboardRailItemVm[];
  emptyState: string;
}

export interface DashboardRailItemVm {
  rank?: number;
  label: string;
  detail: string;
  value?: string;
}

export const DASHBOARD_HOME_VM: DashboardHomeVm = {
  hero: {
    title: "Brazil vs Italy",
    subtitle: "VNL 2024 · Final · Rio de Janeiro",
    tag: "Main live match",
    ctaLabel: "Ver transmisión",
    liveLabel: "LIVE",
    homeTeam: "Brazil",
    awayTeam: "Italy",
    homeScore: 2,
    awayScore: 1,
    setLabel: "Set 4 · 24-22",
    setScores: ["S1: 25-18", "S2: 22-25", "S3: 25-17", "S4: 24-22"],
  },
  liveMatches: [
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
    {
      league: "Superliga",
      teams: ["Serbia", "Argentina"],
      score: "2 - 2",
      status: "Set 5 · 8-9",
      stage: "Decider",
    },
    {
      league: "Challenger Cup",
      teams: ["Canada", "Germany"],
      score: "1 - 0",
      status: "Set 2 · 16-14",
      stage: "Live",
    },
  ],
  rail: [
    {
      title: "Trending Players",
      subtitle: "Live momentum",
      type: "players",
      emptyState: "No trending players yet.",
      items: [
        { rank: 1, label: "Nishida", detail: "Japan · OP", value: "+14%" },
        { rank: 2, label: "Michieletto", detail: "Italy · OH", value: "+8%" },
        { rank: 3, label: "Leal", detail: "Brazil · OH", value: "-2%" },
      ],
    },
    {
      title: "Standings",
      subtitle: "Current ladder",
      type: "standings",
      emptyState: "Standings are not ready yet.",
      items: [
        { rank: 1, label: "BRA", detail: "Brazil", value: "24" },
        { rank: 2, label: "POL", detail: "Poland", value: "21" },
        { rank: 3, label: "ITA", detail: "Italy", value: "18" },
        { rank: 4, label: "USA", detail: "United States", value: "15" },
        { rank: 5, label: "JPN", detail: "Japan", value: "14" },
      ],
    },
    {
      title: "Premium Stats",
      subtitle: "Partner surface",
      type: "promo",
      emptyState: "Premium access coming soon.",
      items: [],
    },
  ],
};
