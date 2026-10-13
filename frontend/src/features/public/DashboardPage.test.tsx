import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarNavigationGroup } from "../../components/navigation/Sidebar";
import { DashboardPage } from "./DashboardPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, search, to }: { children: ReactNode; search?: Record<string, string>; to: string }) => (
    <a href={search ? `${to}?${new URLSearchParams(search)}` : to}>{children}</a>
  ),
  useLocation: () => ({ search }),
}));

const publicNavigation: SidebarNavigationGroup[] = [
  {
    items: [
      { href: "/", icon: "01", label: "Dashboard" },
      { href: "/matches", icon: "02", label: "Partidos" },
      { href: "/tournaments", icon: "03", label: "Torneos" },
    ],
  },
];

describe("public dashboard", () => {
  it("matches the canonical page hierarchy and four metric summaries", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("Dashboard público");
    expect(html).toContain("Seguí partidos en vivo, próximos encuentros, torneos activos y estadísticas generales.");
    // Design source: frontend/design/html/voleytrack.css:66-67 — the design defines one
    // .page-head for every screen: h1 28px/900/-0.02em at line-height 1, description 13px
    // in --muted with a 6px top margin and a 60ch measure. The previous expectation here
    // (26px/700) encoded the pre-design value.
    expect(html).toMatch(/<h1 class="[^"]*text-\[28px\][^"]*font-black[^"]*leading-none[^"]*tracking-\[-0\.02em\][^"]*">Dashboard público<\/h1>/);
    expect(html).toMatch(/<p class="[^"]*mt-1\.5[^"]*max-w-\[60ch\][^"]*text-\[13px\][^"]*text-vt-muted[^"]*">Seguí partidos en vivo, próximos encuentros, torneos activos y estadísticas generales.<\/p>/);
    expect(html.match(/data-testid="dashboard-metric-card"/g)).toHaveLength(4);
    expect(html).toContain("EN VIVO");
    expect(html).toContain("PRÓXIMOS");
    expect(html).toContain("7 días");
    expect(html).toContain("TORNEOS");
    expect(html).toContain("Activos");
    expect(html).toContain("PUNTOS REGISTRADOS");
    expect(html).toContain("1.248");
    expect(html).toContain("Semana");
    expect(html).not.toContain("EQUIPOS");
    expect(html).not.toContain('data-testid="dashboard-tournament-card"');
    expect(html).not.toContain('id="tournaments-heading"');

    const metricsIndex = html.indexOf('aria-label="Métricas del dashboard"');
    const liveIndex = html.indexOf('id="live-matches-heading"');
    const upcomingIndex = html.indexOf('id="upcoming-matches-heading"');
    expect(metricsIndex).toBeGreaterThan(-1);
    expect(liveIndex).toBeGreaterThan(metricsIndex);
    expect(upcomingIndex).toBeGreaterThan(liveIndex);
  });

  it("caps the page at 1104px and defers exact live tracks until the shell can fit them", () => {
    const html = renderToStaticMarkup(<DashboardPage />);
    const contentClass = html.match(/class="([^"]*)" data-testid="dashboard-content"/)?.[1];
    const liveGridClass = html.match(/class="([^"]*)" data-testid="dashboard-live-grid"/)?.[1];

    expect(contentClass).toContain("w-full");
    expect(contentClass).toContain("max-w-[1104px]");
    expect(liveGridClass).toContain("grid-cols-1");
    expect(liveGridClass).not.toContain("xl:grid-cols-[716px_364px]");
    expect(liveGridClass).toContain("min-[1416px]:grid-cols-[716px_364px]");
    expect(716 + 24 + 364).toBe(1104);
  });

  it("renders one featured and two compact canonical live matches with live routes", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html.match(/data-testid="dashboard-live-featured"/g)).toHaveLength(1);
    expect(html.match(/data-testid="dashboard-live-compact"/g)).toHaveLength(2);
    expect(html).toContain("River Plate");
    expect(html).toContain("Boca Juniors");
    expect(html).toContain("Liga A1 · Set 3 · 21-18");
    expect(html).toContain("Sets ganados: 2");
    expect(html).toContain("Sets ganados: 1");
    expect(html).toContain("Última acción: Ataque punto");
    expect(html).toContain("Ciudad Voley vs UPCN");
    expect(html).toContain("Liga A1 · Set 1");
    expect(html).toContain("15-10");
    expect(html).toContain("Bolívar vs Monteros");
    expect(html).toContain("Copa Nacional · Set 5");
    expect(html).toContain("8-6");
    expect(html).toContain('href="/matches?status=live"');
    expect(html).toContain('href="/matches/match-liga-a1-river-boca/live"');
    expect(html).toContain('href="/matches/match-liga-a1-ciudad-upcn/live"');
    expect(html).toContain('href="/matches/match-copa-nacional-bolivar-monteros/live"');
    expect(html).toMatch(/class="[^"]*rounded-2xl[^"]*"[^>]*data-testid="dashboard-live-featured"/);
  });

  it("renders the canonical upcoming match table with labelled columns and linked rows", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("<table");
    for (const column of ["FECHA", "PARTIDO", "TORNEO", "SEDE", "ESTADO"]) {
      expect(html).toContain(`scope="col">${column}</th>`);
    }
    expect(html.match(/data-testid="dashboard-upcoming-row"/g)).toHaveLength(3);
    expect(html).toContain("MIÉ 9 JUL · 20:00");
    expect(html).toContain("River Plate vs Ciudad Voley");
    expect(html).toContain("Estadio Monumental");
    expect(html).toContain("Confirmado");
    expect(html).toContain("JUE 10 JUL · 18:30");
    expect(html).toContain("UPCN San Juan vs Bolívar");
    expect(html).toContain("Aldo Cantoni");
    expect(html).toContain("JUE 10 JUL · 21:00");
    expect(html).toContain("Boca Juniors vs Monteros");
    expect(html).toContain("La Bombonerita");
    expect(html).toContain("Programado");
    expect(html).toContain('href="/matches/match-liga-a1-river-ciudad/live"');
    expect(html).toContain('href="/matches/match-liga-a1-upcn-bolivar/live"');
    expect(html).toContain('href="/matches/match-copa-nacional-boca-monteros/live"');
  });

  it("renders the explicit error state override without dashboard content", () => {
    search = { state: "error" };
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("No pudimos mostrar esta información");
    expect(html).not.toContain("Partidos en vivo");
    search = {};
  });

  it("keeps Dashboard active in the public sidebar at the root route", () => {
    const html = renderToStaticMarkup(
      <Sidebar currentPath="/" navigation={publicNavigation} roleLabel="Público" />,
    );

    expect(html).toMatch(/aria-current="page"[^>]*href="\/"/);
  });
});
