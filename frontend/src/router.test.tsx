// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
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
import { AdminTournamentStandingsPage } from "./features/admin/AdminTournamentStandingsPage";
import { AdminTournamentStatsPage } from "./features/admin/AdminTournamentStatsPage";
import { UIStatesBoardPage } from "./features/admin/UIStatesBoardPage";
import { ADMIN } from "./fixtures";
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

  it("exposes every canonical manifest route path", () => {
    const paths = new Set(routePaths(router.routeTree));
    const expectedPaths = new Set(ARTBOARD_MANIFEST.map((entry) => manifestPath(entry.route)));

    expect([...expectedPaths].filter((path) => !paths.has(path))).toEqual([]);
  });
});
