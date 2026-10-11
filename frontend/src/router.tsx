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
import { LiveNowPage } from "./features/public/LiveNowPage";
import { PlayersPage } from "./features/public/PlayersPage";
import { PlayerDetailPage } from "./features/public/PlayerDetailPage";
import { AdminPage } from "./pages/AdminPage";
import { PlanilleroPage } from "./pages/PlanilleroPage";
import { MatchSetupPage } from "./features/scoring/MatchSetupPage";
import { ScoringConsolePage } from "./features/scoring/ScoringConsolePage";
import { PointEntryPage } from "./features/scoring/PointEntryPage";
import { PostMatchSummaryPage } from "./features/scoring/PostMatchSummaryPage";
import { AdminStaffPage } from "./features/admin/AdminStaffPage";
import { CreatePlayerPage } from "./features/admin/CreatePlayerPage";
import { CreateTeamPage } from "./features/admin/CreateTeamPage";
import { CreateTournamentPage } from "./features/admin/CreateTournamentPage";
import { CreateMatchPage } from "./features/admin/CreateMatchPage";
import { AdminTournamentMatchesPage } from "./features/admin/AdminTournamentMatchesPage";
import { AdminMatchesPage } from "./features/admin/AdminMatchesPage";
import { AdminPlayersPage } from "./features/admin/AdminPlayersPage";
import { AdminTeamsPage } from "./features/admin/AdminTeamsPage";
import { AdminTournamentsPage } from "./features/admin/AdminTournamentsPage";
import { AdminTournamentOverviewPage } from "./features/admin/AdminTournamentOverviewPage";
import { AdminTournamentBracketPage } from "./features/admin/AdminTournamentBracketPage";
import { AdminTournamentEditPage } from "./features/admin/AdminTournamentEditPage";
import { AdminTournamentStandingsPage } from "./features/admin/AdminTournamentStandingsPage";
import { AdminTournamentStatsPage } from "./features/admin/AdminTournamentStatsPage";
import { UIStatesBoardPage } from "./features/admin/UIStatesBoardPage";

const rootRoute = createRootRoute({
	component: () => <Outlet />,
});

// The design's public sidebar is Dashboard / Partidos / Torneos / Equipos / Jugadores /
// En vivo (frontend/design/html/voleytrack-live.html, `sidebar-public-nav`). Equipos and
// Jugadores joined this list in the same change that replaced their PlaceholderPage
// routes with the real screens, so the nav only ever points at destinations that render.
// `En vivo` was the last one withheld because it had no destination; it now points at
// `/live`, which resolves the match that is live right now inside this same public shell.
// It deliberately does NOT point at `/matches/$id/live`: that route is a focused,
// standalone view (no public sidebar), so linking the nav to it would remove the very
// navigation the user just clicked — the live presentation is shared instead.
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
			// Design: the `En vivo` entry is the only nav item whose mark is a live dot rather
			// than an icon (`<span class="live-dot">`, voleytrack-live.html). This nav renders
			// every public item's mark as the app's own two-digit glyph, and a nested element here
			// would also land inside the `span:last-child` label read used by the nav probe and
			// the router test, so `En vivo` follows the existing glyph convention and the label
			// beside it carries the meaning.
			{ href: "/live", icon: "06", label: "En vivo" },
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
			// The design's admin sidebar names this destination "Staff & gestión"
			// (frontend/design/html/voleytrack-admin-gestion.html) and it now renders that
			// screen: the staff table, the creation dialog and the row edit affordance.
			{ href: "/admin/staff/register", icon: "👥", label: "Staff & gestión" },
			{ href: "/planillero", icon: "📝", label: "Panel de planillero" },
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
// The nav's `En vivo` destination: the same live presentation, inside the public shell, for
// the match that is live right now. See `LiveNowPage` for why the nav does not point at
// `/matches/$id/live`.
const liveRoute = createRoute({
	getParentRoute: () => publicShellRoute,
	path: "/live",
	component: LiveNowPage,
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
	// The design's staff screen keeps its create/edit dialog in the same page, opened by the
	// "+ Nuevo integrante" action and each row's "Editar" button
	// (frontend/design/html/voleytrack-admin-gestion.html). The open dialog is therefore part
	// of the URL, exactly like the create-team modals, so a dialog can be linked to and
	// reloaded rather than only reached by a click.
	validateSearch: (search: Record<string, unknown>) => {
		if (typeof search.editar === "string" && search.editar !== "") return { editar: search.editar };
		if (search.nuevo === true || search.nuevo === "1") return { nuevo: true };
		return {};
	},
	component: AdminStaffPage,
});
const adminTournamentMatchesRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/matches",
	component: AdminTournamentMatchesPage,
});
// The admin tournament's landing: the overview the design's own detail page opens on
// (frontend/design/html/voleytrack-admin-ver-torneo.html). It is a sibling of the three content
// tabs rather than a tab of its own, exactly as the public detail's `Resumen` route is
// (`/tournaments/$id`), so the tab strip can point at a real route for every label it renders.
const adminTournamentOverviewRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id",
	component: AdminTournamentOverviewPage,
});
// Design: the cup detail's `Llaves` panel (voleytrack-admin-ver-copa.html) and the league's
// `Playoffs` panel (voleytrack-admin-ver-torneo.html) render the bracket widget, which the
// public side already built. The admin route reuses that widget and adds only its frame.
const adminTournamentBracketRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/bracket",
	component: AdminTournamentBracketPage,
});
// Design: voleytrack-admin-editar-torneo.html. The design's own entry point for it is the
// tournament detail's `Editar torneo` action, and its `Volver` returns to that detail, so the
// screen is a sibling route under the tournament it edits (`/admin/tournaments/$id/edit`) rather
// than a dialog or a second top-level destination. It mirrors the create screen's own path
// convention (`/admin/tournaments/create`).
const adminTournamentEditRoute = createRoute({
	getParentRoute: () => adminShellRoute,
	path: "/admin/tournaments/$id/edit",
	component: AdminTournamentEditPage,
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
		liveRoute,
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
		adminMatchSetupRoute,
		adminScoringRoute,
		adminPointEntryRoute,
		adminSummaryRoute,
		adminStaffRegisterRoute,
		adminTournamentOverviewRoute,
		adminTournamentBracketRoute,
		adminTournamentEditRoute,
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
