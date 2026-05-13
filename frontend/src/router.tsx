import {
	Outlet,
	createRoute,
	createRootRoute,
	createRouter,
} from "@tanstack/react-router";
import { AppShell } from "./layouts/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MatchesPage } from "./pages/MatchesPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { PlanilleroPage } from "./pages/PlanilleroPage";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

const shellRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "shell",
	component: AppShell,
});

const dashboardRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/",
	component: DashboardPage,
});
const adminRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/admin",
	component: AdminPage,
});

const planilleroRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/planillero",
	component: PlanilleroPage,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

const matchesRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/matches",
	component: MatchesPage,
});

const resultsRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/results",
	component: () => (
		<PlaceholderPage
			title="Results"
			description="Final match results and recaps will be rebuilt here."
		/>
	),
});

const statsRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/stats",
	component: () => (
		<PlaceholderPage
			title="Stats"
			description="League and match statistics will be rebuilt here."
		/>
	),
});

const galleryRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/gallery",
	component: () => (
		<PlaceholderPage
			title="Gallery"
			description="Editorial and media surfaces will be rebuilt here."
		/>
	),
});

const fantasyRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/fantasy",
	component: () => (
		<PlaceholderPage
			title="Fantasy"
			description="Fantasy experiences and companion views will be rebuilt here."
		/>
	),
});

const playersRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/players",
	component: () => (
		<PlaceholderPage
			title="Players"
			description="Player browsing and profiles will be rebuilt here."
		/>
	),
});

const teamsRoute = createRoute({
	getParentRoute: () => shellRoute,
	path: "/teams",
	component: () => (
		<PlaceholderPage
			title="Teams"
			description="Team browsing and roster surfaces will be rebuilt here."
		/>
	),
});

const routeTree = rootRoute.addChildren([
	loginRoute,
	shellRoute.addChildren([
		dashboardRoute,
		adminRoute,
		planilleroRoute,
		matchesRoute,
		resultsRoute,
		statsRoute,
		galleryRoute,
		fantasyRoute,
		playersRoute,
		teamsRoute,
	]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
