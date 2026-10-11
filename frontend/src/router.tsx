import {
	Outlet,
	createRoute,
	createRootRoute,
	createRouter,
	useLocation,
} from "@tanstack/react-router";
import { AdminShell, isScorerPath } from "./layouts/AdminShell";
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
import { TeamsPage } from "./features/public/TeamsPage";
import { TeamDetailPage } from "./features/public/TeamDetailPage";
import { TeamRosterPage } from "./features/public/TeamRosterPage";
import { TeamMatchesPage } from "./features/public/TeamMatchesPage";
import { TeamStatsPage } from "./features/public/TeamStatsPage";
import { LiveMatchPage } from "./features/public/LiveMatchPage";
import { PlayersPage } from "./features/public/PlayersPage";
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
import { AdminMatchesPage } from "./features/admin/AdminMatchesPage";
import { AdminPlayersPage } from "./features/admin/AdminPlayersPage";
import { AdminTeamsPage } from "./features/admin/AdminTeamsPage";
import { AdminTournamentsPage } from "./features/admin/AdminTournamentsPage";
import { AdminTournamentStandingsPage } from "./features/admin/AdminTournamentStandingsPage";
import { AdminTournamentStatsPage } from "./features/admin/AdminTournamentStatsPage";
import { UIStatesBoardPage } from "./features/admin/UIStatesBoardPage";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

// The design's public sidebar is Dashboard / Partidos / Torneos / Equipos / Jugadores /
// En vivo (frontend/design/html/voleytrack.html, `sidebar-public-nav`). Equipos and
// Jugadores joined this list in the same change that replaced their PlaceholderPage
// routes with the real screens, so the nav only ever points at destinations that render.
// `En vivo` is still withheld: it arrives with its own screen in a later task (T16 in
// odd/tasks/frontend-design-parity.md) and has no route yet, so adding it now would be a
// link to nothing rather than a shorter nav.
// The app-only "Estadísticas" entry was removed because it was the only entry point of
// `placeholderRoute(publicShellRoute, "/stats")`, which rendered no screen — the real
// statistics views live at /tournaments/$id/stats and /teams/$id/stats and stay reachable
// from their own pages.
// T10 then removed the app-only shell subtree (`/shell` and its `/results`, `/gallery` and
// `/fantasy` PlaceholderPage children) together with the legacy shell it existed to feed.
const publicNavigation: SidebarNavigationGroup[] = [
	{
		items: [
			{ href: "/", icon: "01", label: "Dashboard" },
			{ href: "/matches", icon: "02", label: "Partidos" },
			{ href: "/tournaments", icon: "03", label: "Torneos" },
			{ href: "/teams", icon: "04", label: "Equipos" },
			{ href: "/players", icon: "05", label: "Jugadores" },
		],
	},
];

const adminNavigation: SidebarNavigationGroup[] = [
	{
		label: "GESTIÓN DE COMPETICIÓN",
		items: [
			{ href: "/admin", icon: "📊", label: "Dashboard" },
			{ href: "/admin/matches", icon: "📋", label: "Partidos" },
			{ href: "/admin/tournaments", icon: "🏆", label: "Torneos" },
			{ href: "/admin/teams", icon: "🛡️", label: "Equipos" },
			{ href: "/admin/players", icon: "🏃", label: "Jugadores" },
		],
	},
	{
		label: "ADMINISTRACIÓN",
		items: [
			{ href: "/admin/staff/register", icon: "👥", label: "Staff / Planilleros" },
			{ href: "/planillero", icon: "📝", label: "Panel de planillero" },
			{ href: "/admin/settings", icon: "⚙️", label: "Configuración" },
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
			roleLabel="Público"
		/>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
function AdminRouteShell() {
	const { pathname } = useLocation();
	const isScorer = isScorerPath(pathname);
	return (
		<AdminShell
			currentPath={pathname}
			navigation={adminNavigation}
			roleLabel={isScorer ? "PLANILLERO" : "ADMIN"}
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
	parent: typeof publicShellRoute | typeof adminShellRoute,
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
	getParentRoute: () => adminShellRoute,
	path: "/admin",
	component: AdminPage,
});

const planilleroRoute = createRoute({
	getParentRoute: () => adminShellRoute,
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

const playersRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/players",
	component: PlayersPage,
});
const teamsRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/teams",
	component: TeamsPage,
});
const adminSettingsRoute = placeholderRoute(adminShellRoute, "/admin/settings", "Configuración");

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
	getParentRoute: () => rootRoute,
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
	validateSearch: (search: Record<string, unknown>) => {
		if (search.modal === "player") return { modal: "player" };
		if (search.modal === "assign-player") return { modal: "assign-player" };
		return {};
	},
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
const adminMatchesRoute = createRoute({
  getParentRoute: () => adminShellRoute,
  path: "/admin/matches",
  component: AdminMatchesPage,
});
const adminTeamsRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/teams",
	component: AdminTeamsPage,
});
const adminPlayersRoute = createRoute({
  getParentRoute: () => adminShellRoute,
  path: "/admin/players",
  component: AdminPlayersPage,
});

export const routeTree = rootRoute.addChildren([
	loginRoute,
	changePasswordRoute,
	liveMatchRoute,
	publicShellRoute.addChildren([
		publicDashboardRoute,
		playersRoute,
		teamsRoute,
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
		playerDetailRoute,
	]),
	adminShellRoute.addChildren([
		adminRoute,
		planilleroRoute,
		adminSettingsRoute,
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
