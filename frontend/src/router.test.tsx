// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ARTBOARD_MANIFEST } from "./artboardManifest";
import { LiveMatchPage } from "./features/public/LiveMatchPage";
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
import { ADMIN, PUBLIC_DASHBOARD, PUBLIC_MATCHES, PUBLIC_PLAYERS, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "./fixtures";
import { PlayerDetailPage } from "./features/public/PlayerDetailPage";
import { TeamMatchesPage } from "./features/public/TeamMatchesPage";
import { TeamRosterPage } from "./features/public/TeamRosterPage";
import { TeamStatsPage } from "./features/public/TeamStatsPage";
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

  it("exposes the auth route and shell subtree", () => {
    const topLevelRoutes = router.routeTree.children ?? [];
    const topLevelPaths = topLevelRoutes.map((route) => route.path);
    const shellRoute = topLevelRoutes.find((route) => route.id === "/shell");
    const shellChildren = shellRoute?.children as
      | Array<{ path: string }>
      | undefined;
    const shellPaths = shellChildren?.map((route) => route.path) ?? [];

    expect(topLevelPaths).toContain("login");
    expect(shellPaths).not.toContain("admin");
    expect(shellPaths).not.toContain("planillero");
    expect(shellPaths).not.toContain("matches");
    expect(shellPaths).toContain("results");
    expect(shellPaths).not.toContain("stats");
    expect(shellPaths).toContain("gallery");
    expect(shellPaths).toContain("fantasy");
    expect(shellPaths).not.toContain("players");
    expect(shellPaths).not.toContain("teams");

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
    // The design defines /teams and /players, so they stay as PlaceholderPage routes until
    // the tasks that build their real screens (T14/T15) land; only /stats had no design
    // counterpart and no working screen, so it is the one that was removed.
    expect(allPaths).toContain("/teams");
    expect(allPaths).toContain("/players");
    expect(publicPaths).not.toContain("matches/$id/live");
    expect(publicPaths).toContain("teams/$id");
    expect(publicPaths).toContain("teams/$id/roster");
    expect(publicPaths).toContain("teams/$id/stats");
    const rosterRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/roster",
    );
    const matchesRoute = publicChildren?.find(
      (route) => route.fullPath === "/teams/$id/matches",
    );
    const liveMatchRoute = topLevelRoutes.find(
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
    expect(staffRegisterRoute?.options?.component).toBe(StaffRegisterPage);

    const createPlayerRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/players/create",
    );
    expect(createPlayerRoute?.options?.component).toBe(CreatePlayerPage);

    const createTeamRoute = adminChildren?.find(
      (route) => route.fullPath === "/admin/teams/create",
    );
    expect(createTeamRoute?.options?.component).toBe(CreateTeamPage);
    expect(createTeamRoute?.options?.validateSearch?.({ modal: "player" })).toEqual({
      modal: "player",
    });
    expect(createTeamRoute?.options?.validateSearch?.({ modal: "assign-player" })).toEqual({
      modal: "assign-player",
    });
    expect(createTeamRoute?.options?.validateSearch?.({ modal: "unexpected" })).toEqual({});

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

  it("renders staff registration when the real router navigates to its canonical URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/staff/register" });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/staff/register");
    expect(container.textContent).toContain("Registrar planillero");

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
    expect(container.textContent).toContain("Crear Torneo");

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
    expect(container.textContent).toContain("Crear Nuevo Equipo");

    await act(async () => root.unmount());
    container.remove();
  });

  it("renders the add-player dialog for the canonical create-team modal URL", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams/create", search: { modal: "player" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.pathname).toBe("/admin/teams/create");
    expect(window.location.search).toBe("?modal=player");
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain("Agregar Jugador al Equipo");

    await act(async () => root.unmount());
    container.remove();
  });

  it("does not render the add-player dialog for invalid create-team modal URLs", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    await act(async () => {
      await router.navigate({ to: "/admin/teams/create", search: { modal: "unexpected" } });
      root.render(<RouterProvider router={router} />);
    });

    expect(window.location.search).toBe("?modal=unexpected");
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    await act(async () => {
      await router.navigate({ to: "/admin/teams/create", search: { modal: "unknown" } });
    });

    expect(window.location.search).toBe("?modal=unknown");
    expect(container.querySelector('[role="dialog"]')).toBeNull();

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
    expect(container.textContent).toContain("Crear Partido");
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
    expect(container.textContent).toContain("Administrá y consultá los partidos registrados.");
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
    expect(container.textContent).toContain("Administrá y consultá los equipos registrados.");
    expect(container.textContent).toContain(ADMIN.teams[0].name);

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
    expect(container.textContent).toContain("Administrá y consultá los jugadores registrados.");
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
    expect(container.textContent).toContain("Partidos del torneo");

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
    expect(container.textContent).toContain("Tabla de posiciones");

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
    { route: "/", content: "Dashboard público", activeHref: "/", activeLabel: "Dashboard" },
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

    await act(async () => {
      await router.navigate({ to: "/" });
    });

    await act(async () => {
      container.querySelector(`a[href="/tournaments/${PUBLIC_TOURNAMENTS.all[0].id}"]`)?.dispatchEvent(
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
