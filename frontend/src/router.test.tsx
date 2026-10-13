// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ARTBOARD_MANIFEST } from "./artboardManifest";
import { LiveMatchPage } from "./features/public/LiveMatchPage";
import { LiveNowPage } from "./features/public/LiveNowPage";
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
import { AdminTeamDetailPage } from "./features/admin/AdminTeamDetailPage";
import { AdminTeamRosterPage } from "./features/admin/AdminTeamRosterPage";
import { AdminTeamMatchesPage } from "./features/admin/AdminTeamMatchesPage";
import { AdminTeamStatsPage } from "./features/admin/AdminTeamStatsPage";
import { AdminTournamentsPage } from "./features/admin/AdminTournamentsPage";
import { AdminTournamentOverviewPage } from "./features/admin/AdminTournamentOverviewPage";
import { AdminTournamentBracketPage } from "./features/admin/AdminTournamentBracketPage";
import { AdminTournamentEditPage } from "./features/admin/AdminTournamentEditPage";
import { AdminTournamentStandingsPage } from "./features/admin/AdminTournamentStandingsPage";
import { AdminTournamentStatsPage } from "./features/admin/AdminTournamentStatsPage";
import { UIStatesBoardPage } from "./features/admin/UIStatesBoardPage";
import { ADMIN, PUBLIC_DASHBOARD, PUBLIC_MATCHES, PUBLIC_PLAYERS, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./fixtures";
import { PlayerDetailPage } from "./features/public/PlayerDetailPage";
import { PlayersPage } from "./features/public/PlayersPage";
import { TeamMatchesPage } from "./features/public/TeamMatchesPage";
import { TeamRosterPage } from "./features/public/TeamRosterPage";
import { TeamStatsPage } from "./features/public/TeamStatsPage";
import { TeamsPage } from "./features/public/TeamsPage";
import { routeTree } from "./router";

// Each test owns a fresh router. A mounted RouterProvider overwrites the
// router's startTransition with an acknowledgement-based closure and never
// restores it on unmount, so a shared module-level singleton is poisoned for
// every test that runs after the first mount.
function createTestRouter() {
  return createRouter({ routeTree });
}

type RouteTreeLike = { fullPath?: string; children?: readonly unknown[] };

function routePaths(tree: RouteTreeLike) {
  const paths: string[] = [];
  const visit = (route: RouteTreeLike) => {
    if (route.fullPath) paths.push(route.fullPath);
    for (const child of route.children ?? []) {
      visit(child as RouteTreeLike);
    }
  };

  visit(tree);
  return paths;
}

function manifestPath(route: string) {
  return route.split("?")[0].replaceAll(/:([A-Za-z0-9_]+)/g, "$$$1");
}

describe("router", () => {
  let router: ReturnType<typeof createTestRouter>;

  beforeEach(() => {
    router = createTestRouter();
  });

  // Each test mounts a RouterProvider over its own router, and a mounted provider patches
  // window.history.pushState/replaceState and registers its own popstate listener without
  // undoing either on unmount. Without this, the file accumulated one chained pushState
  // patch and one listener per mount across its ~30 mounts. `destroy()` is the public
  // @tanstack/history API that restores the originals and removes the listener.
  afterEach(() => {
    router.history.destroy();
  });

  it("exposes the auth route and admin shell subtree", () => {
    const topLevelRoutes = router.routeTree.children ?? [];
    const topLevelPaths = topLevelRoutes.map((route) => route.path);

    expect(topLevelPaths).toContain("login");
    // The app-only `/shell` route and its /results, /gallery and /fantasy PlaceholderPage
    // children were deleted with the legacy AppShell they existed to feed: nothing linked to
    // them, and /results and /fantasy duplicated the real /matches and /tournaments screens.
    // `/shell` was a pathless layout route, so the proof is its id and the children's
    // full paths, not a top-level path segment.
    expect(topLevelRoutes.map((route) => route.id as string)).not.toContain("/shell");
    const allPaths = routePaths(router.routeTree);
    expect(allPaths).not.toContain("/results");
    expect(allPaths).not.toContain("/gallery");
    expect(allPaths).not.toContain("/fantasy");

    const adminShellRoute = topLevelRoutes.find((route) => route.id === "/admin");
    const adminShellPaths = (adminShellRoute?.children as Array<{ path: string }> | undefined)
      ?.map((route) => route.path) ?? [];
    expect(adminShellPaths).toContain("admin");
    expect(adminShellPaths).toContain("planillero");
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
    // /stats was a PlaceholderPage with no design counterpart and no working screen; its
    // route and its single nav entry were removed, so the public subtree must not expose it.
    // `/teams/:id/stats` and `/tournaments/:id/stats` below are real screens and stay.
    expect(publicPaths).not.toContain("stats");
    expect(publicPaths).toContain("players");
    expect(publicPaths).toContain("teams");
    expect(allPaths).not.toContain("/stats");
    // `/teams` and `/players` stopped being PlaceholderPage routes when their real screens
    // landed (T14/T15): the routes stay, and these assertions now pin the real components
    // rather than deleting the protection the placeholder assertions used to give them.
    expect(allPaths).toContain("/teams");
    expect(allPaths).toContain("/players");
    expect(publicPaths).not.toContain("matches/$id/live");
    expect(publicPaths).toContain("live");
    expect(publicPaths).toContain("teams/$id");
    expect(publicPaths).toContain("teams/$id/roster");
    expect(publicPaths).toContain("teams/$id/stats");
    const teamsRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams",
    );
    const playersRoute = publicChildren?.find(
      (route) => route.fullPath === "/players",
    );
    expect(teamsRoute?.options?.component).toBe(TeamsPage);
    expect(playersRoute?.options?.component).toBe(PlayersPage);
    const rosterRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/roster",
    );
    const matchesRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/matches",
    );
    const liveMatchRoute = topLevelRoutes.find(
      (route) => route.fullPath === "/matches/$id/live",
    );
    // The nav's `En vivo` destination is a separate route inside this public shell, pinned
    // here next to the standalone `/matches/$id/live` so the two cannot collapse into one.
    const liveRoute = publicChildren?.find((route) => route.fullPath === "/live");
    expect(liveRoute?.options?.component).toBe(LiveNowPage);
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

  it("renders the live-detail route as a standalone shell without the public sidebar", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const match = PUBLIC_DASHBOARD.live.featured.match;

    await act(async () => {
      await router.navigate({
        to: "/matches/$id/live",
        params: { id: match.id },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/matches/${match.id}/live`);
    expect(container.querySelector('[data-testid="live-match-shell"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="live-match-header"]')).not.toBeNull();
    expect(container.querySelector("aside")).toBeNull();
    expect(container.querySelector('[aria-label="Navegación Público"]')).toBeNull();
    expect(container.querySelector('[aria-label="Buscar en VoleyTrack"]')).toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders every canonical dashboard live ID through the public live-detail route", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const dashboardLive = [
      PUBLIC_DASHBOARD.live.featured,
      ...PUBLIC_DASHBOARD.live.compact,
    ];

    for (const { match, tournamentName } of dashboardLive) {
      await act(async () => {
        await router.navigate({
          to: "/matches/$id/live",
          params: { id: match.id },
        });
        root.render(<RouterProvider router={router} />);
      });

      expect(window.location.pathname).toBe(`/matches/${match.id}/live`);
      expect(container.querySelector('[data-testid="live-match-scoreboard"]')).not.toBeNull();
      expect(container.querySelector(`[data-match-id="${match.id}"]`)).not.toBeNull();
      expect(container.textContent).toContain(match.homeTeamName);
      expect(container.textContent).toContain(match.awayTeamName);
      expect(container.textContent).toContain(tournamentName);
    }

    await act(async () => root.unmount());
    container.remove();
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

    const pointEntryRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches/$id/point-entry",
    );
    expect(pointEntryRoute?.options?.component).toBe(PointEntryPage);
    expect(pointEntryRoute?.options?.validateSearch?.({ step: "point-step-action" })).toEqual({
      step: "point-step-action",
    });

    const summaryRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches/$id/summary",
    );
    expect(summaryRoute?.options?.component).toBe(PostMatchSummaryPage);

    const staffRegisterRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/staff/register",
    );
    expect(staffRegisterRoute?.options?.component).toBe(AdminStaffPage);
    // The design's staff screen hosts its create/edit dialog in the same page
    // (frontend/design/html/voleytrack-admin-gestion.html), so the open dialog is part of the
    // route's search contract rather than unreachable component state.
    expect(staffRegisterRoute?.options?.validateSearch?.({ editar: "staff-planillero-mariana-lopez" })).toEqual({
      editar: "staff-planillero-mariana-lopez",
    });
    expect(staffRegisterRoute?.options?.validateSearch?.({ nuevo: "1" })).toEqual({ nuevo: true });
    expect(staffRegisterRoute?.options?.validateSearch?.({ editar: "" })).toEqual({});
    // `/admin/settings` was a PlaceholderPage: the design's admin navigation has no such
    // destination (frontend/design/html/voleytrack-admin-gestion.html lists Staff & gestión,
    // Partidos, Equipos, Jugadores, Torneos), and the nav only points at screens that render,
    // so the route and its single nav entry were removed with it.
    expect(routePaths(router.routeTree)).not.toContain("/admin/settings");

    const createPlayerRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/players/create",
    );
    expect(createPlayerRoute?.options?.component).toBe(CreatePlayerPage);

    const createTeamRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/create",
    );
    expect(createTeamRoute?.options?.component).toBe(CreateTeamPage);
    // The design's create screen opens its player dialog with plain component state
    // (`openPlayerModal()`, frontend/design/html/voleytrack-admin-crear-equipo.html) and the
    // app-only assign-free-player dialog is gone, so the route declares no search contract.
    expect(createTeamRoute?.options?.validateSearch).toBeUndefined();

    // The admin team detail: the design's own tab set
    // (frontend/design/html/voleytrack-admin-ver-equipo.html) as one real route per label, a
    // sibling under the resource — the shape the admin tournament cluster uses.
    const teamDetailRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/$id",
    );
    expect(teamDetailRoute?.options?.component).toBe(AdminTeamDetailPage);

    const teamRosterRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/$id/roster",
    );
    expect(teamRosterRoute?.options?.component).toBe(AdminTeamRosterPage);

    const teamMatchesRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/$id/matches",
    );
    expect(teamMatchesRoute?.options?.component).toBe(AdminTeamMatchesPage);

    const teamStatsRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/$id/stats",
    );
    expect(teamStatsRoute?.options?.component).toBe(AdminTeamStatsPage);

    const createTournamentRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/create",
    );
    expect(createTournamentRoute?.options?.component).toBe(CreateTournamentPage);

    const createMatchRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches/create",
    );
    expect(createMatchRoute?.options?.component).toBe(CreateMatchPage);

    const uiStatesRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/ui-states",
    );
    expect(uiStatesRoute?.options?.component).toBe(UIStatesBoardPage);

    const tournamentsRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments",
    );
    expect(tournamentsRoute?.options?.component).toBe(AdminTournamentsPage);

    const matchesRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/matches",
    );
    expect(matchesRoute?.options?.component).toBe(AdminMatchesPage);

    const teamsRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams",
    );
    expect(teamsRoute?.options?.component).toBe(AdminTeamsPage);

    const playersRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/players",
    );
    expect(playersRoute?.options?.component).toBe(AdminPlayersPage);

    const tournamentMatchesRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id/matches",
    );
    expect(tournamentMatchesRoute?.options?.component).toBe(AdminTournamentMatchesPage);

    const tournamentStandingsRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id/standings",
    );
    expect(tournamentStandingsRoute?.options?.component).toBe(AdminTournamentStandingsPage);

    // The three admin tournament routes this slice added: the overview the design's own detail
    // page opens on, the bracket panel, and the edit form (frontend/design/html/
    // voleytrack-admin-ver-torneo.html, voleytrack-admin-ver-copa.html and
    // voleytrack-admin-editar-torneo.html).
    const tournamentOverviewRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id",
    );
    expect(tournamentOverviewRoute?.options?.component).toBe(AdminTournamentOverviewPage);

    const tournamentBracketRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id/bracket",
    );
    expect(tournamentBracketRoute?.options?.component).toBe(AdminTournamentBracketPage);

    const tournamentEditRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id/edit",
    );
    expect(tournamentEditRoute?.options?.component).toBe(AdminTournamentEditPage);

    const tournamentStatsRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/tournaments/$id/stats",
    );
    expect(tournamentStatsRoute?.options?.component).toBe(AdminTournamentStatsPage);
  });

  it("renders the loading state when the real router receives a representative state override", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/tournaments", search: { state: "loading" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/tournaments");
    expect(window.location.search).toBe("?state=loading");
    expect(container.textContent).toContain("Cargando contenido");
    expect(container.textContent).not.toContain("Lista de torneos");

    await act(async () => root.unmount());
    container.remove();
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

  it("renders the point entry action step when the real router navigates to its canonical URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({
        to: "/admin/matches/$id/point-entry",
        params: { id: "match-1" },
        search: { step: "point-step-action" },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/matches/match-1/point-entry");
    expect(window.location.search).toBe("?step=point-step-action");
    expect(container.textContent).toContain("Registrar acción");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the staff management screen when the real router navigates to its canonical URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/staff/register" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/staff/register");
    // The design's staff screen is the table plus the create/edit dialog on one page, so the
    // old register-only assertion moves onto what the screen now renders.
    expect(container.textContent).toContain("Staff & gestión");
    expect(container.textContent).toContain(ADMIN.staff[0].fullName);
    expect(container.textContent).toContain("+ Nuevo integrante");

    // The dialog's own search contract: `?editar=<id>` opens it on the record.
    await act(async () => {
      await router.navigate({ to: "/admin/staff/register", search: { editar: ADMIN.staff[0].id } });
    });

    expect(window.location.search).toBe(`?editar=${ADMIN.staff[0].id}`);
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(container.textContent).toContain("Editar integrante");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders create player through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/players/create" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/players/create");
    expect(container.textContent).toContain("Crear jugador");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders create tournament through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/tournaments/create" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/tournaments/create");
    expect(container.textContent).toContain("Nuevo torneo");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders create team through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams/create" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/teams/create");
    expect(container.textContent).toContain("Crear equipo");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the create-team player dialog from component state without a modal URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams/create" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/teams/create");
    // The route declares no search contract, so the old modal query is not a destination and
    // the dialog is closed until the roster button opens it.
    expect(window.location.search).toBe("");
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    await act(async () => {
      [...container.querySelectorAll("button")]
        .find((button) => button.textContent === "Agregar jugador")
        ?.click();
    });

    expect(container.querySelector('[role="dialog"]')?.textContent).toContain("Crear jugador");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders create match through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/matches/create" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/matches/create");
    expect(container.textContent).toContain("Crear partido");
    expect(container.querySelector('a[href="/admin/matches"]')).not.toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the five-state board through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/ui-states" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/ui-states");
    expect(container.querySelector('a[href="/admin"]')).not.toBeNull();
    expect(container.textContent).toContain("Estados de interfaz");
    expect(container.querySelectorAll('[data-testid="ui-state"]')).toHaveLength(5);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin matches through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/matches" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/matches");
    expect(container.textContent).toContain("Consulta la programación y gestiona los partidos creados.");
    expect(container.textContent).toContain(ADMIN.matches[0].homeTeamName);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin teams through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/teams");
    expect(container.textContent).toContain("Listado de equipos. Seleccioná un equipo para ver su detalle.");
    expect(container.textContent).toContain(ADMIN.teams[0].name);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the admin team detail and its tab routes through the real router", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const team = ADMIN.teams[0];

    await act(async () => {
      await router.navigate({ to: "/admin/teams/$id", params: { id: team.id } });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/admin/teams/${team.id}`);
    expect(container.textContent).toContain(team.name);
    expect(container.textContent).toContain("Perfil");
    // The admin navigation's team entry is the destination this detail belongs to, and it is
    // the one the sidebar marks current.
    expect(container.querySelector('aside a[aria-current="page"][href="/admin/teams"]')).not.toBeNull();

    await act(async () => {
      await router.navigate({ to: "/admin/teams/$id/roster", params: { id: team.id } });
    });
    expect(window.location.pathname).toBe(`/admin/teams/${team.id}/roster`);
    expect(container.textContent).toContain("Altura");

    await act(async () => {
      await router.navigate({ to: "/admin/teams/$id/matches", params: { id: team.id } });
    });
    expect(window.location.pathname).toBe(`/admin/teams/${team.id}/matches`);
    expect(container.textContent).toContain("Partidos");

    await act(async () => {
      await router.navigate({ to: "/admin/teams/$id/stats", params: { id: team.id } });
    });
    expect(window.location.pathname).toBe(`/admin/teams/${team.id}/stats`);
    expect(container.textContent).toContain("Jugadores");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the unknown admin team fallback when the real router navigates to its URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams/$id", params: { id: "missing-team" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/teams/missing-team");
    expect(container.textContent).toContain("Equipo no encontrado");
    expect(container.querySelector('a[href="/admin/teams"]')).not.toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin players through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/players" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/players");
    expect(container.textContent).toContain("Jugadores registrados, con su equipo, posición, altura y puntos.");
    expect(container.textContent).toContain(ADMIN.players[0].fullName);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin tournaments through the real admin router shell", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/tournaments" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/tournaments");
    expect(container.textContent).toContain("Administrá y consultá los torneos registrados.");
    expect(container.textContent).toContain(ADMIN.tournaments[0].name);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin tournament matches when the real router navigates to the known fixture URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const tournament = ADMIN.tournaments[0];

    await act(async () => {
      await router.navigate({
        to: "/admin/tournaments/$id/matches",
        params: { id: tournament.id },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}/matches`);
    expect(container.textContent).toContain(tournament.name);
    expect(container.textContent).toContain("Partidos programados");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin tournament standings when the real router navigates to the known fixture URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const tournament = ADMIN.tournaments[0];

    await act(async () => {
      await router.navigate({
        to: "/admin/tournaments/$id/standings",
        params: { id: tournament.id },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}/standings`);
    expect(container.textContent).toContain(tournament.name);
    expect(container.textContent).toContain("Clasificación");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders admin tournament stats when the real router navigates to the known fixture URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const tournament = ADMIN.tournaments[0];

    await act(async () => {
      await router.navigate({
        to: "/admin/tournaments/$id/stats",
        params: { id: tournament.id },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}/stats`);
    expect(container.textContent).toContain(tournament.name);
    expect(container.textContent).toContain("Ranking de Jugadores · Puntos Totales");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the admin tournament overview, bracket and edit routes through the real router", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const tournament = ADMIN.tournaments[0];

    await act(async () => {
      await router.navigate({ params: { id: tournament.id }, to: "/admin/tournaments/$id" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}`);
    expect(container.textContent).toContain(tournament.name);
    expect(container.textContent).toContain("Clasificación");

    await act(async () => {
      await router.navigate({ params: { id: tournament.id }, to: "/admin/tournaments/$id/bracket" });
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}/bracket`);
    expect(container.textContent).toContain("Llaves de playoffs");

    await act(async () => {
      await router.navigate({ params: { id: tournament.id }, to: "/admin/tournaments/$id/edit" });
    });

    expect(window.location.pathname).toBe(`/admin/tournaments/${tournament.id}/edit`);
    expect(container.textContent).toContain("Editar torneo");
    expect(container.textContent).toContain(tournament.name);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the unknown tournament fallback when the real router navigates to its URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({
        to: "/admin/tournaments/$id/matches",
        params: { id: "missing-tournament" },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/tournaments/missing-tournament/matches");
    expect(container.textContent).toContain("Torneo no encontrado");
    expect(container.querySelector('a[href="/admin/tournaments"]')).not.toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the post-match summary when the real router navigates to the known fixture URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({
        to: "/admin/matches/$id/summary",
        params: { id: "match-liga-rosarina-04" },
      });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/matches/match-liga-rosarina-04/summary");
    expect(container.textContent).toContain("Resumen del partido");
    expect(container.textContent).toContain("Finalizado");

    await act(async () => root.unmount());
    container.remove();
  });

  it.each([
    { route: "/", content: "Dashboard espectador", activeHref: "/", activeLabel: "Dashboard" },
    { route: "/matches", content: "Todos", activeHref: "/matches", activeLabel: "Partidos" },
    { route: "/matches?status=live", content: "En vivo", activeHref: "/matches", activeLabel: "Partidos" },
    { route: "/matches?status=today", content: "Hoy", activeHref: "/matches", activeLabel: "Partidos" },
    { route: "/matches?status=upcoming", content: "Próximos", activeHref: "/matches", activeLabel: "Partidos" },
    { route: "/matches?status=finished", content: "Finalizados", activeHref: "/matches", activeLabel: "Partidos" },
    { route: "/tournaments", content: "Todos", activeHref: "/tournaments", activeLabel: "Torneos" },
    { route: "/tournaments?status=todos", content: "Todos", activeHref: "/tournaments", activeLabel: "Torneos" },
    { route: "/tournaments?status=en-curso", content: "En curso", activeHref: "/tournaments", activeLabel: "Torneos" },
    { route: "/tournaments?status=proximos", content: "Próximos", activeHref: "/tournaments", activeLabel: "Torneos" },
    { route: "/tournaments?status=finalizados", content: "Finalizados", activeHref: "/tournaments", activeLabel: "Torneos" },
    { route: "/teams", content: "PG / PP", activeHref: "/teams", activeLabel: "Equipos" },
    { route: "/players", content: "Ver ficha →", activeHref: "/players", activeLabel: "Jugadores" },
    { route: "/live", content: "Historial de sets", activeHref: "/live", activeLabel: "En vivo" },
  ])("renders public artboard route $route with its active sidebar navigation", async ({ route, content, activeHref, activeLabel }) => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const [pathname, searchString] = route.split("?");
    const search = Object.fromEntries(new URLSearchParams(searchString));

    await act(async () => {
      await router.navigate({ to: pathname as string, search });
      root.render(<RouterProvider router={router} />);
    });

    expect(`${window.location.pathname}${window.location.search}`).toBe(route);
    expect(container.textContent).toContain(content);
    expect(container.querySelector(`a[aria-current="page"][href="${activeHref}"]`)?.textContent).toContain(activeLabel);

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the live presentation at /live inside the public shell, with the nav still present", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/live" });
      root.render(<RouterProvider router={router} />);
    });

    // The resolution of the nav tension: `En vivo` must not land on the standalone,
    // chrome-less detail route, because that would delete the navigation the user just
    // clicked. /live keeps the public shell and renders the same presentation.
    expect(window.location.pathname).toBe("/live");
    const sidebar = container.querySelector("aside");
    expect(sidebar).not.toBeNull();
    expect(container.querySelector('[aria-label="Navegación Público"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="live-now-content"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="live-match-scoreboard"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="set-history-card"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="court-rotations"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="live-events"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="match-metadata"]')).not.toBeNull();
    expect(
      container.querySelector('a[aria-current="page"][href="/live"]')?.textContent,
    ).toContain("En vivo");

    await act(async () => root.unmount());
    container.remove();
  });

  it("exposes the design's six public destinations, including En vivo", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/" });
      root.render(<RouterProvider router={router} />);
    });

    // The design's sidebar-public-nav is Dashboard / Partidos / Torneos / Equipos /
    // Jugadores / En vivo (frontend/design/html/voleytrack-live.html, which is the screen
    // whose own markup carries the group). Equipos and Jugadores joined it with their real
    // screens; `En vivo` is the last one, and it now points at `/live` rather than at the
    // standalone `/matches/$id/live`, so no destination leads nowhere.
    const labels = [...container.querySelectorAll("aside nav a")].map(
      (link) => link.querySelector("span:last-child")?.textContent,
    );
    expect(labels).toEqual([
      "Dashboard",
      "Partidos",
      "Torneos",
      "Equipos",
      "Jugadores",
      "En vivo",
    ]);
    const liveLink = container.querySelector('aside nav a[href="/live"]');
    expect(liveLink).not.toBeNull();
    // Every destination resolves to a real route (no placeholder wiring left behind).
    const publicPaths = routePaths(router.routeTree);
    for (const href of [...container.querySelectorAll("aside nav a")].map((link) =>
      link.getAttribute("href"),
    )) {
      expect(publicPaths).toContain(href);
    }

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the public audit routes from local fixtures without runtime requests", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    for (const route of ARTBOARD_MANIFEST.filter((entry) => entry.index >= 3 && entry.index <= 13)) {
      const [pathname, searchString] = route.route.split("?");
      await act(async () => {
        await router.navigate({
          to: pathname as string,
          search: Object.fromEntries(new URLSearchParams(searchString)),
        });
        root.render(<RouterProvider router={router} />);
      });
    }

    expect(fetchSpy).not.toHaveBeenCalled();

    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("updates and resets public match filters when the real router changes search", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/matches", search: { status: "live" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(container.textContent).toContain(PUBLIC_MATCHES.live[0].scheduledLabel);

    await act(async () => {
      await router.navigate({ to: "/matches", search: { status: "finished" } });
    });

    expect(container.textContent).toContain(PUBLIC_MATCHES.finished[0].scheduledLabel);
    expect(container.textContent).not.toContain(PUBLIC_MATCHES.live[0].scheduledLabel);

    await act(async () => {
      await router.navigate({ to: "/matches" });
    });

    expect(container.textContent).toContain(PUBLIC_MATCHES.live[0].scheduledLabel);
    expect(container.textContent).toContain(PUBLIC_MATCHES.finished[0].scheduledLabel);

    await act(async () => root.unmount());
    container.remove();
  });

  it("updates and resets public tournament filters when the real router changes search", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/tournaments", search: { status: "en-curso" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(container.textContent).toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);

    await act(async () => {
      await router.navigate({ to: "/tournaments", search: { status: "finalizados" } });
    });

    expect(container.textContent).toContain(PUBLIC_TOURNAMENTS.finished[0].name);
    expect(container.textContent).not.toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);

    await act(async () => {
      await router.navigate({ to: "/tournaments" });
    });

    expect(container.textContent).toContain(PUBLIC_TOURNAMENTS.inProgress[0].name);
    expect(container.textContent).toContain(PUBLIC_TOURNAMENTS.finished[0].name);

    await act(async () => root.unmount());
    container.remove();
  });

  it("traverses public fixture links through their canonical routes", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/" });
      root.render(<RouterProvider router={router} />);
    });

    await act(async () => {
      container.querySelector('a[href="/matches?status=live"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    expect(`${window.location.pathname}${window.location.search}`).toBe("/matches?status=live");
    expect(container.textContent).toContain(PUBLIC_MATCHES.live[0].scheduledLabel);

    // The dashboard's own tournament link left with the design-less metrics block; the
    // tournaments list is the screen whose fixtures actually link to a tournament.
    await act(async () => {
      await router.navigate({ to: "/tournaments" });
    });

    const tournamentLink = container.querySelector(
      `a[href="/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}"]`,
    );
    expect(tournamentLink).not.toBeNull();

    await act(async () => {
      tournamentLink?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    expect(window.location.pathname).toBe(`/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}`);
    expect(container.textContent).toContain(PUBLIC_TOURNAMENTS.all[0].name);

    await act(async () => root.unmount());
    container.remove();
  });

  it("traverses canonical public detail tabs and entity links through the real router", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const tournament = PUBLIC_TOURNAMENTS.all[0];
    const team = PUBLIC_TEAMS[0];
    const player = PUBLIC_PLAYERS[0];
    const match = PUBLIC_MATCHES.live[0];

    async function navigate(to: string) {
      await act(async () => {
        await router.navigate({ to });
        root.render(<RouterProvider router={router} />);
      });
    }

    async function follow(href: string) {
      const link = container.querySelector(`a[href="${href}"]`);
      expect(link).not.toBeNull();
      await act(async () => {
        link?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      });
      expect(window.location.pathname).toBe(href);
    }

    for (const suffix of ["/matches", "/standings", "/stats", "/bracket"]) {
      await navigate(`/tournaments/${tournament.id}`);
      await follow(`/tournaments/${tournament.id}${suffix}`);
    }

    for (const suffix of ["/roster", "/matches", "/stats"]) {
      await navigate(`/teams/${team.id}`);
      await follow(`/teams/${team.id}${suffix}`);
    }

    await navigate("/tournaments");
    await follow(`/tournaments/${tournament.id}`);

    await navigate(`/tournaments/${tournament.id}/matches`);
    await follow(`/matches/${match.id}/live`);

    await navigate(`/tournaments/${tournament.id}/stats`);
    await follow(`/players/${player.id}`);

    await navigate(`/tournaments/${tournament.id}/bracket`);
    await follow(`/teams/${team.id}`);

    await navigate(`/teams/${team.id}`);
    await follow(`/players/${player.id}`);

    await navigate(`/players/${player.id}`);
    await follow(`/teams/${team.id}`);

    await act(async () => root.unmount());
    container.remove();
  });

  it("exposes every canonical manifest route path", () => {
    const paths = new Set(routePaths(router.routeTree));
    const expectedPaths = new Set(ARTBOARD_MANIFEST.map((entry) => manifestPath(entry.route)));

    expect([...expectedPaths].filter((path) => !paths.has(path))).toEqual([]);
  });
});
