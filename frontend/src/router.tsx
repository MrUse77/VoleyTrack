import {
  createRoute,
  createRootRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { MatchesPage } from "./pages/MatchesPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches",
  component: MatchesPage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: () => (
    <PlaceholderPage
      title="Results"
      description="Final match results and recaps will be rebuilt here."
    />
  ),
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: () => (
    <PlaceholderPage
      title="Stats"
      description="League and match statistics will be rebuilt here."
    />
  ),
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: () => (
    <PlaceholderPage
      title="Gallery"
      description="Editorial and media surfaces will be rebuilt here."
    />
  ),
});

const fantasyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fantasy",
  component: () => (
    <PlaceholderPage
      title="Fantasy"
      description="Fantasy experiences and companion views will be rebuilt here."
    />
  ),
});

const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/players",
  component: () => (
    <PlaceholderPage
      title="Players"
      description="Player browsing and profiles will be rebuilt here."
    />
  ),
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teams",
  component: () => (
    <PlaceholderPage
      title="Teams"
      description="Team browsing and roster surfaces will be rebuilt here."
    />
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  matchesRoute,
  resultsRoute,
  statsRoute,
  galleryRoute,
  fantasyRoute,
  playersRoute,
  teamsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
