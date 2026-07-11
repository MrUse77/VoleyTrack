import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarNavigationGroup } from "../../components/navigation/Sidebar";
import { PUBLIC_MATCHES, PUBLIC_TOURNAMENTS } from "../../fixtures";
import { DashboardPage } from "./DashboardPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, search, to }: { children: ReactNode; search?: Record<string, string>; to: string }) => (
    <a href={search ? `${to}?${new URLSearchParams(search)}` : to}>{children}</a>
  ),
}));

const publicNavigation: SidebarNavigationGroup[] = [
  {
    items: [
      { href: "/", icon: "D", label: "Dashboard" },
      { href: "/matches", icon: "M", label: "Matches" },
    ],
  },
];

describe("public dashboard", () => {
  it("renders fixture-driven match, tournament, and metric cards with the shared Card primitive", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain(PUBLIC_MATCHES.live[0].homeTeamName);
    expect(html).toContain(PUBLIC_MATCHES.live[0].awayTeamName);
    expect(html).toContain(PUBLIC_MATCHES.upcoming[0].scheduledLabel);
    for (const tournament of PUBLIC_TOURNAMENTS.all) {
      expect(html).toContain(tournament.name);
    }
    expect(html).toContain("EN VIVO");
    expect(html).toContain("PRÓXIMOS");
    expect(html).toContain("TORNEOS");
    expect(html).toContain('data-testid="dashboard-match-card"');
    expect(html).toContain('data-testid="dashboard-tournament-card"');
    expect(html).toContain('data-testid="dashboard-metric-card"');
    expect(html).toMatch(/class="[^"]*rounded-2xl[^"]*"[^>]*data-testid="dashboard-match-card"/);
  });

  it("links fixture-driven public content to canonical match and tournament routes", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain(`href="/matches?status=live"`);
    expect(html).toContain(`href="/matches/${PUBLIC_MATCHES.live[0].id}/live"`);
    expect(html).toContain(`href="/matches/${PUBLIC_MATCHES.upcoming[0].id}/live"`);
    expect(html).toContain(`href="/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}"`);
  });

  it("keeps Dashboard active in the public sidebar at the root route", () => {
    const html = renderToStaticMarkup(
      <Sidebar currentPath="/" navigation={publicNavigation} roleLabel="Public" />,
    );

    expect(html).toMatch(/aria-current="page"[^>]*href="\/"/);
  });
});
