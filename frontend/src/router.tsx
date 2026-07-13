import {
	Outlet,
	createRoute,
	createRootRoute,
	createRouter,
	useLocation,
} from "@tanstack/react-router";
import { AppShell } from "./layouts/AppShell";
import { AdminShell } from "./layouts/AdminShell";
import { PublicShell } from "./layouts/PublicShell";
import type { SidebarNavigationGroup } from "./components/navigation/Sidebar";
import { LoginPage as AuthLoginPage } from "./features/auth/LoginPage";
import { ChangePasswordPage } from "./features/auth/ChangePasswordPage";
import { DashboardPage as PublicDashboardPage } from "./features/public/DashboardPage";
import { MatchesPage } from "./features/public/MatchesPage";
import { TournamentsPage } from "./features/public/TournamentsPage";
import { TournamentDetailPage } from "./features/public/TournamentDetailPage";
import { TournamentMatchesPage } from "./features/public/TournamentMatchesPage";
import { TournamentStandingsPage } from "./features/public/TournamentStandingsPage";
import { TournamentBracketPage } from "./features/public/TournamentBracketPage";
import { TournamentStatsPage } from "./features/public/TournamentStatsPage";
import { TeamDetailPage } from "./features/public/TeamDetailPage";
import { TeamRosterPage } from "./features/public/TeamRosterPage";
import { TeamMatchesPage } from "./features/public/TeamMatchesPage";
import { TeamStatsPage } from "./features/public/TeamStatsPage";
import { LiveMatchPage } from "./features/public/LiveMatchPage";
import { PlayerDetailPage } from "./features/public/PlayerDetailPage";
import { AdminPage } from "./pages/AdminPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { PlanilleroPage } from "./pages/PlanilleroPage";
import { MatchSetupPage } from "./features/scoring/MatchSetupPage";
import { ScoringConsolePage } from "./features/scoring/ScoringConsolePage";
import { PointEntryPage } from "./features/scoring/PointEntryPage";
import { PostMatchSummaryPage } from "./features/scoring/PostMatchSummaryPage";
import { StaffRegisterPage } from "./features/admin/StaffRegisterPage";
import { CreatePlayerPage } from "./features/admin/CreatePlayerPage";
import { CreateTeamPage } from "./features/admin/CreateTeamPage";
import { CreateTournamentPage } from "./features/admin/CreateTournamentPage";
import { CreateMatchPage } from "./features/admin/CreateMatchPage";
import { AdminTournamentMatchesPage } from "./features/admin/AdminTournamentMatchesPage";
import { AdminTournamentsPage } from "./features/admin/AdminTournamentsPage";
import { AdminTournamentStandingsPage } from "./features/admin/AdminTournamentStandingsPage";
import { AdminTournamentStatsPage } from "./features/admin/AdminTournamentStatsPage";
import { UIStatesBoardPage } from "./features/admin/UIStatesBoardPage";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

const shellRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "shell",
	component: AppShell,
});

const publicNavigation: SidebarNavigationGroup[] = [
	{
		items: [
			{ href: "/", icon: "D", label: "Dashboard" },
			{ href: "/matches", icon: "M", label: "Matches" },
			{ href: "/tournaments", icon: "T", label: "Tournaments" },
		],
	},
	{
		items: [
			{ href: "/teams", icon: "T", label: "Teams" },
			{ href: "/players", icon: "P", label: "Players" },
		],
	},
];

const adminNavigation: SidebarNavigationGroup[] = [
	{
		items: [
			{ href: "/admin", icon: "D", label: "Overview" },
			{ href: "/admin/matches", icon: "M", label: "Matches" },
			{ href: "/admin/tournaments", icon: "T", label: "Tournaments" },
		],
	},
	{
		items: [
			{ href: "/admin/teams", icon: "T", label: "Teams" },
			{ href: "/admin/players", icon: "P", label: "Players" },
		],
	},
];

// These route shells are local components because the router module also exports its router instance.
// eslint-disable-next-line react-refresh/only-export-components
function PublicRouteShell() {
	const { pathname } = useLocation();
	return (
		<PublicShell
			currentPath={pathname}
			navigation={publicNavigation}
			roleLabel="Public"
		/>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
function AdminRouteShell() {
	const { pathname } = useLocation();
	return (
		<AdminShell
			currentPath={pathname}
			navigation={adminNavigation}
			roleLabel="Admin"
		/>
	);
}

const publicShellRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "public",
	component: PublicRouteShell,
});

const adminShellRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "admin",
	component: AdminRouteShell,
});

const placeholder = (title: string) => () => <PlaceholderPage title={title} />;

function placeholderRoute(
	parent: typeof shellRoute | typeof publicShellRoute | typeof adminShellRoute,
	path: string,
	title: string,
) {
	return createRoute({
		getParentRoute: () => parent,
		path,
		component: placeholder(title),
	});
}

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
	component: AuthLoginPage,
});

const changePasswordRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/change-password",
	component: ChangePasswordPage,
});

const resultsRoute = placeholderRoute(shellRoute, "/results", "Results");
const statsRoute = placeholderRoute(shellRoute, "/stats", "Stats");
const galleryRoute = placeholderRoute(shellRoute, "/gallery", "Gallery");
const fantasyRoute = placeholderRoute(shellRoute, "/fantasy", "Fantasy");
const playersRoute = placeholderRoute(shellRoute, "/players", "Players");
const teamsRoute = placeholderRoute(shellRoute, "/teams", "Teams");

const publicDashboardRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/",
	component: PublicDashboardPage,
});
const matchesRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/matches",
	component: MatchesPage,
});
const tournamentsRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments",
	component: TournamentsPage,
});
const tournamentDetailRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments/$id",
	component: TournamentDetailPage,
});
const tournamentMatchesRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments/$id/matches",
	component: TournamentMatchesPage,
});
const tournamentStandingsRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments/$id/standings",
	component: TournamentStandingsPage,
});
const tournamentStatsRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments/$id/stats",
	component: TournamentStatsPage,
});
const tournamentBracketRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/tournaments/$id/bracket",
	component: TournamentBracketPage,
});
const teamDetailRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/teams/$id",
	component: TeamDetailPage,
});
const teamRosterRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/teams/$id/roster",
	component: TeamRosterPage,
});
const teamMatchesRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/teams/$id/matches",
	component: TeamMatchesPage,
});
const teamStatsRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/teams/$id/stats",
	component: TeamStatsPage,
});
const liveMatchRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/matches/$id/live",
	component: LiveMatchPage,
});
const playerDetailRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/players/$id",
	component: PlayerDetailPage,
});

const adminMatchSetupRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/matches/setup",
	validateSearch: (search: Record<string, unknown>) => search,
	component: MatchSetupPage,
});
const adminScoringRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/matches/$id/scoring",
	validateSearch: (search: Record<string, unknown>) => search,
	component: ScoringConsolePage,
});
const adminPointEntryRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/matches/$id/point-entry",
	validateSearch: (search: Record<string, unknown>) => search,
	component: PointEntryPage,
});
const adminSummaryRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/matches/$id/summary",
	component: PostMatchSummaryPage,
});
const adminStaffRegisterRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/staff/register",
	component: StaffRegisterPage,
});
const adminTournamentMatchesRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/matches",
	component: AdminTournamentMatchesPage,
});
const adminTournamentStandingsRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/standings",
	component: AdminTournamentStandingsPage,
});
const adminTournamentStatsRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/stats",
	component: AdminTournamentStatsPage,
});
const adminUiStatesRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/ui-states",
	component: UIStatesBoardPage,
});
const adminPlayerCreateRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/players/create",
	component: CreatePlayerPage,
});
const adminTeamCreateRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/teams/create",
	validateSearch: (search: Record<string, unknown>) =>
		search.modal === "assign-player" ? { modal: "assign-player" } : {},
	component: CreateTeamPage,
});
const adminTournamentCreateRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/create",
	component: CreateTournamentPage,
});
const adminMatchCreateRoute = createRoute({
  getParentRoute: () => adminShellRoute,
  path: "/admin/matches/create",
  component: CreateMatchPage,
});
const adminTournamentsRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments",
	component: AdminTournamentsPage,
});
const adminMatchesRoute = placeholderRoute(adminShellRoute, "/admin/matches", "Admin matches");
const adminTeamsRoute = placeholderRoute(adminShellRoute, "/admin/teams", "Admin teams");
const adminPlayersRoute = placeholderRoute(adminShellRoute, "/admin/players", "Admin players");

const routeTree = rootRoute.addChildren([
	loginRoute,
	changePasswordRoute,
	shellRoute.addChildren([
		adminRoute,
		planilleroRoute,
		resultsRoute,
		statsRoute,
		galleryRoute,
		fantasyRoute,
		playersRoute,
		teamsRoute,
	]),
	publicShellRoute.addChildren([
		publicDashboardRoute,
		matchesRoute,
		tournamentsRoute,
		tournamentDetailRoute,
		tournamentMatchesRoute,
		tournamentStandingsRoute,
		tournamentStatsRoute,
		tournamentBracketRoute,
		teamDetailRoute,
		teamRosterRoute,
		teamMatchesRoute,
		teamStatsRoute,
		liveMatchRoute,
		playerDetailRoute,
	]),
	adminShellRoute.addChildren([
		adminMatchSetupRoute,
		adminScoringRoute,
		adminPointEntryRoute,
		adminSummaryRoute,
		adminStaffRegisterRoute,
		adminTournamentMatchesRoute,
		adminTournamentStandingsRoute,
		adminTournamentStatsRoute,
		adminUiStatesRoute,
		adminPlayerCreateRoute,
		adminTeamCreateRoute,
		adminTournamentCreateRoute,
		adminMatchCreateRoute,
		adminTournamentsRoute,
		adminMatchesRoute,
		adminTeamsRoute,
		adminPlayersRoute,
	]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
