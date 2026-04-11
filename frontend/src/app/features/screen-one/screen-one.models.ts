export interface ScreenOneVm {
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
  matches: ScreenOneMatchesVm;
  hero: ScreenOneHeroVm;
  liveMatches: ScreenOneLiveMatchVm[];
  lists: ScreenOneListSectionVm[];
  rail: ScreenOneRailCardVm[];
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
  ctaLabel: string;
  filters: ScreenOneMatchFilterVm[];
  featuredMatch: ScreenOneMatchCardVm;
  secondaryMatches: ScreenOneMatchCardVm[];
  emptyState: string;
}

export interface ScreenOneMatchFilterVm {
  label: string;
  active?: boolean;
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
  brand: ScreenOneVm['brand'];
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

export const SCREEN_ONE_VM: ScreenOneVm = {
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
  matches: {
    tag: 'Matches',
    title: 'Match Center',
    subtitle: 'Live scoreboard and editorial spotlight',
    ctaLabel: 'Ver más',
    filters: [
      { label: 'All', active: true },
      { label: 'Live' },
      { label: 'Upcoming' },
      { label: 'Results' },
    ],
    featuredMatch: {
      league: 'VNL 2024',
      teams: ['Brazil', 'Italy'],
      score: '2 - 1',
      status: 'Set 4 · 24-22',
      stage: 'Match point',
      badge: 'LIVE',
    },
    secondaryMatches: [
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
    emptyState: 'No secondary matches available.',
  },
  hero: {
    title: 'Brazil vs Italy',
    subtitle: 'VNL 2024 · Final · Rio de Janeiro',
    tag: 'Featured match',
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
      league: 'VNL 2024',
      teams: ['Brazil', 'Italy'],
      score: '2 - 1',
      status: 'Set 4 · 24-22',
      stage: 'Match point',
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
  lists: [
    {
      title: 'Finished',
      actionLabel: 'Latest results',
      previewCount: 4,
      emptyState: 'No finished matches available yet.',
      items: [
        {
          left: 'CAN',
          right: 'GER',
          score: '3 - 1',
          meta: 'World Cup · Final',
          status: 'Completed',
        },
        {
          left: 'NED',
          right: 'IRI',
          score: '0 - 3',
          meta: 'World Cup · Match day 3',
          status: 'Completed',
        },
        {
          left: 'CUB',
          right: 'BUL',
          score: '3 - 2',
          meta: 'World Cup · Tie-break',
          status: 'Completed',
        },
        {
          left: 'SRB',
          right: 'FRA',
          score: '1 - 3',
          meta: 'World Cup · Quarterfinal',
          status: 'Completed',
        },
        {
          left: 'USA',
          right: 'BRA',
          score: '2 - 3',
          meta: 'World Cup · Semifinal',
          status: 'Completed',
        },
      ],
    },
    {
      title: 'Upcoming',
      actionLabel: 'View all',
      previewCount: 3,
      emptyState: 'No upcoming matches scheduled.',
      items: [
        { left: 'USA', right: 'POL', score: '14:00', meta: 'Pool A · Arena 2' },
        { left: 'FRA', right: 'JPN', score: '16:00', meta: 'Pool B · Arena 1' },
        { left: 'ARG', right: 'SLO', score: '18:00', meta: 'Pool C · Main court' },
      ],
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

export const SCREEN_ONE_MATCHES_VM: ScreenOneVm = {
  ...SCREEN_ONE_VM,
  navigation: SCREEN_ONE_VM.navigation.map((item) => ({
    ...item,
    active: item.label === 'Matches',
  })),
};
