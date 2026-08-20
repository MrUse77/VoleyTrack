import type { AnchorHTMLAttributes, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    search,
    to,
    ...props
  }: { children: ReactNode; search?: Record<string, string>; to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={search ? `${to}?${new URLSearchParams(search).toString()}` : to} {...props}>
      {children}
    </a>
  ),
  Outlet: () => <div data-route-content="true">Route content</div>,
}));

import { AdminShell } from "./AdminShell";
import * as adminShellExports from "./AdminShell";
import { PublicShell } from "./PublicShell";
import { Sidebar, type SidebarNavigationGroup } from "../components/navigation/Sidebar";

const publicNavigation: SidebarNavigationGroup[] = [
  {
    items: [
      { href: "/", icon: "01", label: "Dashboard" },
      { href: "/matches", icon: "02", label: "Partidos" },
      { href: "/tournaments", icon: "03", label: "Torneos" },
      { href: "/stats", icon: "04", label: "Estadísticas" },
    ],
  },
];

const adminNavigation = [
  {
    label: "GESTIÓN DE COMPETICIÓN",
    items: [
      { href: "/admin", icon: "📊", label: "Dashboard" },
      { href: "/admin/matches", icon: "📋", label: "Partidos" },
      { href: "/admin/players", icon: "🏃", label: "Jugadores" },
    ],
  },
  {
    label: "ADMINISTRACIÓN",
    items: [
      { href: "/admin/staff/register", icon: "👥", label: "Staff / Planilleros" },
      { href: "/admin/settings", icon: "⚙️", label: "Configuración" },
    ],
  },
];

describe("application shells", () => {
  it("renders the design-aligned public shell and accessible live controls", () => {
    const html = renderToStaticMarkup(
      <PublicShell
        currentPath="/"
        navigation={publicNavigation}
        roleLabel="Público"
      />,
    );

    expect(html).toContain("w-[248px]");
    expect(html).toMatch(/<aside[^>]*class="[^"]*bg-vt-surface/);
    expect(html).toMatch(/class="[^"]*bg-vt-accent[^"]*"[^>]*href="\/"/);
    expect(html).not.toContain("min-w-[1440px]");
    expect(html).toContain("VoleyTrack");
    expect(html).toContain("Resultados en vivo");
    expect(html).toContain("Vista pública para espectadores");
    expect(html).toContain('role="search"');
    expect(html).toContain('type="search"');
    expect(html).toContain("Buscar partido, torneo o equipo");
    expect(html).toMatch(
      /class="[^"]*focus-visible:outline-2[^"]*"[^>]*id="public-shell-search"/,
    );
    expect(html).toContain('href="/matches?status=live"');
    expect(html).toContain("Ver en vivo");
    expect(html).toContain("COBERTURA");
    expect(html).toContain("3 partidos en vivo");
    expect(html).toContain("01");
    expect(html).toContain("04");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Route content");
  });

  it("renders the designed grouped admin shell with context-specific navigation", () => {
    const html = renderToStaticMarkup(
      <AdminShell
        currentPath="/admin/players"
        navigation={adminNavigation}
        roleLabel="ADMIN"
      />,
    );

    expect(html).toContain("w-[248px]");
    expect(html).toMatch(/<aside[^>]*class="[^"]*bg-vt-background/);
    expect(html).toMatch(
      /class="[^"]*bg-vt-raised[^"]*"[^>]*href="\/admin\/players"/,
    );
    expect(html).not.toContain("min-w-[1440px]");
    expect(html).toContain("VoleyTrack");
    expect(html).toContain("ADMIN");
    expect(html).toContain("GESTIÓN DE COMPETICIÓN");
    expect(html).toContain("ADMINISTRACIÓN");
    expect(html).toContain("Staff / Planilleros");
    expect(html).toContain("Configuración");
    expect(html).toContain('role="search"');
    expect(html).toContain("Buscar...");
    expect(html).toMatch(
      /class="[^"]*focus-visible:outline-2[^"]*"[^>]*id="admin-shell-search"/,
    );
    expect(html).toContain("Jugadores");
    expect(html).toContain('href="/admin/players"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Route content");
  });

  it("uses scorer metadata and classification for parameterized match workflow routes", () => {
    const scoring = renderToStaticMarkup(
      <AdminShell
        currentPath="/admin/matches/match-42/scoring"
        navigation={adminNavigation}
        roleLabel="PLANILLERO"
      />,
    );
    const summary = renderToStaticMarkup(
      <AdminShell
        currentPath="/admin/matches/match-42/summary"
        navigation={adminNavigation}
        roleLabel="PLANILLERO"
      />,
    );
    const isScorerPath = (
      adminShellExports as typeof adminShellExports & {
        isScorerPath?: (path: string) => boolean;
      }
    ).isScorerPath;

    expect(scoring).toContain("Registrar puntuación");
    expect(scoring).toContain("Planillero / Partido en vivo");
    expect(summary).toContain("Resumen del partido");
    expect(summary).toContain("Admin / Resultados");
    expect(isScorerPath?.("/admin/matches/match-42/scoring")).toBe(true);
    expect(isScorerPath?.("/admin/matches/match-42/summary")).toBe(true);
    expect(isScorerPath?.("/admin/matches/match-42/summary-extra")).toBe(false);
  });

  it("keeps the public navigation numbered while deriving the active link from the route", () => {
    const dashboard = renderToStaticMarkup(
      <Sidebar
        currentPath="/"
        navigation={publicNavigation}
        roleLabel="Público"
      />,
    );
    const matches = renderToStaticMarkup(
      <Sidebar
        currentPath="/matches"
        navigation={publicNavigation}
        roleLabel="Público"
      />,
    );
    const matchDetail = renderToStaticMarkup(
      <Sidebar
        currentPath="/matches/fixture-1"
        navigation={publicNavigation}
        roleLabel="Público"
      />,
    );

    for (const label of ["Dashboard", "Partidos", "Torneos", "Estadísticas"]) {
      expect(dashboard).toContain(label);
      expect(matches).toContain(label);
    }
    expect(dashboard).toContain("01");
    expect(matches).toContain("04");
    expect(dashboard).toMatch(/aria-current="page"[^>]*href="\/"/);
    expect(matches).toMatch(/aria-current="page"[^>]*href="\/matches"/);
    expect(matchDetail).toMatch(/aria-current="page"[^>]*href="\/matches"/);
  });
});
