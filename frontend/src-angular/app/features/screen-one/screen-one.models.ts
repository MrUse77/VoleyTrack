export interface ScreenOneDashboardVm {
  brand: {
    title: string;
    subtitle: string;
  };
  utility: {
    live: boolean;
    dateLabel: string;
    spotlight: string;
  };
  navigation: ScreenOneNavItemVm[];
  hero: ScreenOneHeroVm;
  liveMatches: ScreenOneLiveMatchVm[];
  rail: ScreenOneRailCardVm[];
}

export interface ScreenOneMatchesPageVm {
  brand: ScreenOneDashboardVm['brand'];
  utility: ScreenOneDashboardVm['utility'];
  navigation: ScreenOneNavItemVm[];
  matchCenter: ScreenOneMatchesVm;
  footer: ScreenOneFooterVm;
}

export interface ScreenOneNavItemVm {
  label: string;
  href: string;
  active?: boolean;
}

export interface ScreenOneHeroVm {
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

export interface ScreenOneMatchesVm {
  tag: string;
  title: string;
  subtitle: string;
  filters: ScreenOneMatchFilterVm[];
  sections: ScreenOneMatchSectionVm[];
}

export interface ScreenOneMatchFilterVm {
  label: string;
  active?: boolean;
}

export type ScreenOneMatchCategory = 'LIVE' | 'UPCOMING' | 'RESULTS';

export interface ScreenOneMatchSectionVm {
  category: ScreenOneMatchCategory;
  title: string;
  items: ScreenOneMatchCardVm[];
  emptyState: string;
}

export interface ScreenOneMatchCardVm {
  league: string;
  teams: [string, string];
  score: string;
  status: string;
  stage: string;
  badge?: string;
}

export interface ScreenOneLiveMatchVm {
  league: string;
  teams: [string, string];
  score: string;
  status: string;
  stage: string;
}

export interface ScreenOneListSectionVm {
  title: string;
  actionLabel?: string;
  previewCount?: number;
  items: ScreenOneMatchListItemVm[];
  emptyState: string;
}

export interface ScreenOneMatchListItemVm {
  left: string;
  right: string;
  score: string;
  meta: string;
  status?: string;
}

export interface ScreenOneRailCardVm {
  title: string;
  subtitle?: string;
  type: 'players' | 'standings' | 'promo';
  items: ScreenOneRailItemVm[];
  emptyState: string;
}

export interface ScreenOneRailItemVm {
  rank?: number;
  label: string;
  detail: string;
  value?: string;
}

export interface ScreenOneFooterVm {
  brand: ScreenOneDashboardVm['brand'];
  columns: ScreenOneFooterColumnVm[];
  legal: string;
}

export interface ScreenOneFooterColumnVm {
  title: string;
  links: ScreenOneFooterLinkVm[];
}

export interface ScreenOneFooterLinkVm {
  label: string;
  href: string;
}

export const SCREEN_ONE_DASHBOARD_VM: ScreenOneDashboardVm = {
  brand: {
    title: 'VOLLEYTRACK',
    subtitle: 'Pro dashboard',
  },
  utility: {
    live: true,
    dateLabel: 'Fri 10 Apr',
    spotlight: '3 Matches',
  },
  navigation: [
    { label: 'Dashboard', href: '/', active: true },
    { label: 'Matches', href: '/matches' },
    { label: 'Results', href: '/results' },
    { label: 'Stats', href: '/stats' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Fantasy', href: '/fantasy' },
  ],
  hero: {
    title: 'Brazil vs Italy',
    subtitle: 'VNL 2024 · Final · Rio de Janeiro',
    tag: 'Main live match',
    ctaLabel: 'Ver transmisión',
    liveLabel: 'LIVE',
    homeTeam: 'Brazil',
    awayTeam: 'Italy',
    homeScore: 2,
    awayScore: 1,
    setLabel: 'Set 4 · 24-22',
    setScores: ['S1: 25-18', 'S2: 22-25', 'S3: 25-17', 'S4: 24-22'],
  },
  liveMatches: [
    {
      league: 'World Cup',
      teams: ['USA', 'Poland'],
      score: '1 - 1',
      status: 'Set 3 · 18-19',
      stage: 'Live',
    },
    {
      league: 'CEV Cup',
      teams: ['France', 'Japan'],
      score: '0 - 0',
      status: 'Warm-up',
      stage: 'Starting soon',
    },
    {
      league: 'Superliga',
      teams: ['Serbia', 'Argentina'],
      score: '2 - 2',
      status: 'Set 5 · 8-9',
      stage: 'Decider',
    },
    {
      league: 'Challenger Cup',
      teams: ['Canada', 'Germany'],
      score: '1 - 0',
      status: 'Set 2 · 16-14',
      stage: 'Live',
    },
  ],
  rail: [
    {
      title: 'Trending Players',
      subtitle: 'Live momentum',
      type: 'players',
      emptyState: 'No trending players yet.',
      items: [
        { rank: 1, label: 'Nishida', detail: 'Japan · OP', value: '+14%' },
        { rank: 2, label: 'Michieletto', detail: 'Italy · OH', value: '+8%' },
        { rank: 3, label: 'Leal', detail: 'Brazil · OH', value: '-2%' },
      ],
    },
    {
      title: 'Standings',
      subtitle: 'Current ladder',
      type: 'standings',
      emptyState: 'Standings are not ready yet.',
      items: [
        { rank: 1, label: 'BRA', detail: 'Brazil', value: '24' },
        { rank: 2, label: 'POL', detail: 'Poland', value: '21' },
        { rank: 3, label: 'ITA', detail: 'Italy', value: '18' },
        { rank: 4, label: 'USA', detail: 'United States', value: '15' },
        { rank: 5, label: 'JPN', detail: 'Japan', value: '14' },
      ],
    },
    {
      title: 'Premium Stats',
      subtitle: 'Partner surface',
      type: 'promo',
      emptyState: 'Premium access coming soon.',
      items: [],
    },
  ],
};

export const SCREEN_ONE_MATCHES_VM: ScreenOneMatchesPageVm = {
  brand: SCREEN_ONE_DASHBOARD_VM.brand,
  utility: {
    live: true,
    dateLabel: SCREEN_ONE_DASHBOARD_VM.utility.dateLabel,
    spotlight: 'Category browser',
  },
  navigation: SCREEN_ONE_DASHBOARD_VM.navigation.map((item) => ({
    ...item,
    active: item.label === 'Matches',
  })),
  matchCenter: {
    tag: 'Matches',
    title: 'Match Center',
    subtitle: 'Live scoreboard and category browser',
    filters: [
      { label: 'ALL', active: true },
      { label: 'LIVE' },
      { label: 'UPCOMING' },
      { label: 'RESULTS' },
    ],
    sections: [
      {
        category: 'LIVE',
        title: 'Live',
        emptyState: 'No live matches available.',
        items: [
          {
            league: 'VNL 2024',
            teams: ['Brazil', 'Italy'],
            score: '2 - 1',
            status: 'Set 4 · 24-22',
            stage: 'Match point',
            badge: 'LIVE',
          },
          {
            league: 'World Cup',
            teams: ['USA', 'Poland'],
            score: '1 - 1',
            status: 'Set 3 · 18-19',
            stage: 'Live',
          },
          {
            league: 'CEV Cup',
            teams: ['France', 'Japan'],
            score: '0 - 0',
            status: 'Warm-up',
            stage: 'Starting soon',
          },
        ],
      },
      {
        category: 'UPCOMING',
        title: 'Upcoming',
        emptyState: 'No upcoming matches scheduled.',
        items: [
          {
            league: 'Pool A',
            teams: ['USA', 'POL'],
            score: '14:00',
            status: 'Scheduled',
            stage: 'Arena 2',
          },
          {
            league: 'Pool B',
            teams: ['FRA', 'JPN'],
            score: '16:00',
            status: 'Scheduled',
            stage: 'Arena 1',
          },
          {
            league: 'Pool C',
            teams: ['ARG', 'SLO'],
            score: '18:00',
            status: 'Scheduled',
            stage: 'Main court',
          },
        ],
      },
      {
        category: 'RESULTS',
        title: 'Results',
        emptyState: 'No results available yet.',
        items: [
          {
            league: 'World Cup',
            teams: ['CAN', 'GER'],
            score: '3 - 1',
            status: 'Completed',
            stage: 'Final',
          },
          {
            league: 'World Cup',
            teams: ['NED', 'IRI'],
            score: '0 - 3',
            status: 'Completed',
            stage: 'Round 3',
          },
          {
            league: 'World Cup',
            teams: ['CUB', 'BUL'],
            score: '3 - 2',
            status: 'Completed',
            stage: 'Tie-break',
          },
          {
            league: 'World Cup',
            teams: ['SRB', 'FRA'],
            score: '1 - 3',
            status: 'Completed',
            stage: 'Quarterfinal',
          },
          {
            league: 'World Cup',
            teams: ['USA', 'BRA'],
            score: '2 - 3',
            status: 'Completed',
            stage: 'Semifinal',
          },
        ],
      },
    ],
  },
  footer: {
    brand: {
      title: 'VOLLEYTRACK',
      subtitle: 'Pro dashboard',
    },
    columns: [
      {
        title: 'Competition',
        links: [
          { label: 'Matches', href: '#' },
          { label: 'Results', href: '#' },
          { label: 'Stats', href: '#' },
        ],
      },
      {
        title: 'Community',
        links: [
          { label: 'Players', href: '#' },
          { label: 'Teams', href: '#' },
          { label: 'Fantasy', href: '#' },
        ],
      },
      {
        title: 'Follow',
        links: [
          { label: 'Instagram', href: '#' },
          { label: 'X / Twitter', href: '#' },
          { label: 'YouTube', href: '#' },
        ],
      },
    ],
    legal: '© 2026 VolleyTrack. Local dashboard build.',
  },
};

export const SCREEN_ONE_DASHBOARD_HOME_VM: ScreenOneDashboardVm = {
  ...SCREEN_ONE_DASHBOARD_VM,
  navigation: SCREEN_ONE_DASHBOARD_VM.navigation.map((item) => ({
    ...item,
    active: item.label === 'Dashboard',
  })),
};
