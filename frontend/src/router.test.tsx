// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { ARTBOARD_MANIFEST } from "./artboardManifest";
import { LiveMatchPage } from "./features/public/LiveMatchPage";
import { MatchSetupPage } from "./features/scoring/MatchSetupPage";
import { ScoringConsolePage } from "./features/scoring/ScoringConsolePage";
import { PlayerDetailPage } from "./features/public/PlayerDetailPage";
import { TeamMatchesPage } from "./features/public/TeamMatchesPage";
import { TeamRosterPage } from "./features/public/TeamRosterPage";
import { TeamStatsPage } from "./features/public/TeamStatsPage";
import { router } from "./router";

function routePaths(routeTree: typeof router.routeTree) {
  const paths: string[] = [];
  const visit = (route: { fullPath?: string; children?: readonly unknown[] }) => {
    if (route.fullPath) paths.push(route.fullPath);
    for (const child of route.children ?? []) {
      visit(child as { fullPath?: string; children?: readonly unknown[] });
    }
  };

  visit(routeTree);
  return paths;
}

function manifestPath(route: string) {
  return route.split("?")[0].replaceAll(/:([A-Za-z0-9_]+)/g, "$$$1");
}

describe("router", () => {
  it("exposes the auth route and shell subtree", () => {
    const topLevelRoutes = router.routeTree.children ?? [];
    const topLevelPaths = topLevelRoutes.map((route) => route.path);
    const shellRoute = topLevelRoutes.find((route) => route.id === "/shell");
    const shellChildren = shellRoute?.children as
      | Array<{ path: string }>
      | undefined;
    const shellPaths = shellChildren?.map((route) => route.path) ?? [];

    expect(topLevelPaths).toContain("login");
    expect(shellPaths).toContain("admin");
    expect(shellPaths).toContain("planillero");
    expect(shellPaths).not.toContain("matches");
    expect(shellPaths).toContain("results");
    expect(shellPaths).toContain("stats");
    expect(shellPaths).toContain("gallery");
    expect(shellPaths).toContain("fantasy");
    expect(shellPaths).toContain("players");
    expect(shellPaths).toContain("teams");
  });

  it("renders the public dashboard only at the root route", () => {
    const topLevelRoutes = router.routeTree.children ?? [];
    const publicShellRoute = topLevelRoutes.find((route) => route.id === "/public");
    const publicChildren = publicShellRoute?.children as
      | Array<{ path: string; fullPath: string; options?: { component?: unknown } }>
      | undefined;
    const publicPaths = publicChildren?.map((route) => route.path) ?? [];
    const allPaths = routePaths(router.routeTree);

    expect(publicPaths).toContain("/");
    expect(publicPaths).toContain("matches");
    expect(publicPaths).toContain("matches/$id/live");
    expect(publicPaths).toContain("teams/$id");
    expect(publicPaths).toContain("teams/$id/roster");
    expect(publicPaths).toContain("teams/$id/stats");
    const rosterRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/roster",
    );
    const matchesRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/matches",
    );
    const liveMatchRoute = publicChildren?.find(
      (route) => route.fullPath === "/matches/$id/live",
    );
    const statsRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/stats",
    );
    expect(liveMatchRoute?.options?.component).toBe(LiveMatchPage);
    expect(rosterRoute?.options?.component).toBe(TeamRosterPage);
    expect(matchesRoute?.options?.component).toBe(TeamMatchesPage);
    expect(statsRoute?.options?.component).toBe(TeamStatsPage);
    const playerDetailRoute = publicChildren?.find(
      (route) => route.fullPath === "/players/$id",
    );
    expect(playerDetailRoute?.options?.component).toBe(PlayerDetailPage);
    expect(publicPaths).not.toContain("dashboard");
    expect(allPaths).not.toContain("/dashboard");
  });

  it("exposes scorer routes and their modal search contracts", () => {
    const topLevelRoutes = router.routeTree.children ?? [];
    const adminShellRoute = topLevelRoutes.find((route) => route.id === "/admin");
    const adminChildren = adminShellRoute?.children as
      | Array<{
          fullPath: string;
          options?: {
            component?: unknown;
            validateSearch?: (search: Record<string, unknown>) => Record<string, unknown>;
          };
        }>
      | undefined;
    const matchSetupRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches/setup",
    );

    expect(matchSetupRoute?.options?.component).toBe(MatchSetupPage);
    expect(matchSetupRoute?.options?.validateSearch?.({ modal: "player-selection" })).toEqual({
      modal: "player-selection",
    });

    const scoringRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches/$id/scoring",
    );
    expect(routePaths(router.routeTree)).toContain("/admin/matches/$id/scoring");
    expect(scoringRoute?.options?.component).toBe(ScoringConsolePage);
    expect(scoringRoute?.options?.validateSearch?.({ modal: "substitution", view: "scoreboard" })).toEqual({
      modal: "substitution",
      view: "scoreboard",
    });
  });

  it("renders the substitution dialog when the real router navigates to its canonical URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({
        to: "/admin/matches/$id/scoring",
        params: { id: "match-1" },
        search: { modal: "substitution" },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/matches/match-1/scoring");
    expect(window.location.search).toBe("?modal=substitution");
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain("Sustitución - Equipo Local");

    await act(async () => root.unmount());
    container.remove();
  });

  it("exposes every canonical manifest route path", () => {
    const paths = new Set(routePaths(router.routeTree));
    const expectedPaths = new Set(ARTBOARD_MANIFEST.map((entry) => manifestPath(entry.route)));

    expect([...expectedPaths].filter((path) => !paths.has(path))).toEqual([]);
  });
});
