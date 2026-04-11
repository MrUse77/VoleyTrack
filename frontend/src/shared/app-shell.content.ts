export const APP_SHELL_BRAND = {
  title: "VOLLEYTRACK",
  subtitle: "Pro dashboard",
} as const;

export const APP_SHELL_NAVIGATION = [
  { label: "Dashboard", href: "/" },
  { label: "Matches", href: "/matches" },
] as const;

export const APP_SHELL_UTILITY = {
  live: true,
  dateLabel: "Fri 10 Apr",
  spotlight: "3 Matches",
} as const;

export const APP_SHELL_FOOTER = {
  brand: APP_SHELL_BRAND,
  columns: [
    {
      title: "Competition",
      links: [
        { label: "Matches", href: "/matches" },
        { label: "Results", href: "/results" },
        { label: "Stats", href: "/stats" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Players", href: "/players" },
        { label: "Teams", href: "/teams" },
        { label: "Fantasy", href: "/fantasy" },
      ],
    },
    {
      title: "Follow",
      links: [
        { label: "Instagram", href: "#" },
        { label: "X / Twitter", href: "#" },
        { label: "YouTube", href: "#" },
      ],
    },
  ],
  legal: "© 2026 VolleyTrack. Local dashboard build.",
} as const;
