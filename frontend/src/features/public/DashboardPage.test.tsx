import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar, type SidebarNavigationGroup } from "../../components/navigation/Sidebar";
import { DashboardPage } from "./DashboardPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, search, to }: { children: ReactNode; className?: string; search?: Record<string, string>; to: string }) => (
    <a className={className} href={search ? `${to}?${new URLSearchParams(search)}` : to}>{children}</a>
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

/**
 * The screen was rewritten against the design's dashboard
 * (frontend/design/html/voleytrack-dashboard.html). The assertions below were moved from the
 * old structure — a metrics grid of four `dashboard-metric-card`s, a "Partidos en vivo"
 * section heading with its own "Ver todos", two `dashboard-live-compact` rails and an
 * upcoming `<table>` with FECHA/PARTIDO/TORNEO/SEDE/ESTADO columns — onto the design's three
 * regions. Every assertion that encoded the old structure was replaced on purpose, and the
 * copy the design does not have (the metrics block, "Partidos en vivo", "Última acción",
 * "Confirmado") is asserted absent so it cannot come back silently.
 */
describe("public dashboard", () => {
  it("renders the design's page head and none of the copy the design does not have", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    // Design source: frontend/design/html/voleytrack-dashboard.html:44-46 —
    // `<h1>Dashboard espectador</h1>` plus one description line, under the single
    // `.page-head` treatment of frontend/design/html/voleytrack.css:65-67.
    expect(html).toContain("Dashboard espectador");
    expect(html).toContain("Vista pública principal — partido en vivo y próximos encuentros.");
    expect(html).toMatch(/<h1 class="[^"]*text-\[28px\][^"]*font-black[^"]*leading-none[^"]*tracking-\[-0\.02em\][^"]*">Dashboard espectador<\/h1>/);
    expect(html).toMatch(/<p class="[^"]*mt-1\.5[^"]*max-w-\[60ch\][^"]*text-\[13px\][^"]*text-vt-muted[^"]*">Vista pública principal — partido en vivo y próximos encuentros\.<\/p>/);

    // Removed copy, each with no counterpart in the design: the old description named
    // torneos and estadísticas, the metrics block ("EN VIVO 3", "PUNTOS REGISTRADOS 1.248")
    // has no design region at all, and the old live section heading, "Última acción" footer
    // and the app-only "Confirmado" status word do not exist in the design either.
    expect(html).not.toContain("Dashboard público");
    expect(html).not.toContain("torneos activos y estadísticas generales");
    expect(html).not.toContain("PUNTOS REGISTRADOS");
    expect(html).not.toContain("Partidos en vivo");
    expect(html).not.toContain("Última acción");
    expect(html).not.toContain("Confirmado");
    expect(html).not.toContain('data-testid="dashboard-metric-card"');
    expect(html).not.toContain('data-testid="dashboard-live-compact"');
  });

  it("splits the live grid 1.6fr by 0.9fr with the structural Card form", () => {
    const html = renderToStaticMarkup(<DashboardPage />);
    const gridClass = html.match(/class="([^"]*)" data-testid="dashboard-live-grid"/)?.[1];

    // Design source: frontend/design/html/voleytrack.css:79
    //   .live-grid{display:grid;grid-template-columns:1.6fr .9fr;gap:16px;margin-bottom:16px}
    // collapsing to one column below 1100px (voleytrack-dashboard.css:3).
    expect(gridClass).toContain("grid-cols-1");
    expect(gridClass).toContain("min-[1100px]:grid-cols-[1.6fr_0.9fr]");
    expect(gridClass).toContain("gap-4");
    expect(gridClass).toContain("mb-4");

    // The screen now uses `Card padded={false}` only, so the transitional uniform `p-6`
    // box must not appear anywhere on it, and the design's own paddings must. (`\bp-6\b`
    // rather than the bare substring, which `gap-6` also contains.)
    expect(html).not.toMatch(/\bp-6\b/);
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("px-5 py-[18px]");
    expect(html).toContain("px-5 pt-[18px]");
    expect(html.match(/data-testid="dashboard-live-featured"/g)).toHaveLength(1);
    expect(html.match(/data-testid="dashboard-highlights"/g)).toHaveLength(1);
    expect(html.match(/data-testid="dashboard-upcoming"/g)).toHaveLength(1);
  });

  it("renders the design's featured live match from the dashboard fixture", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    // Design source: frontend/design/html/voleytrack-dashboard.html:50-63. The design's
    // prototype depicts UPCN San Juan vs Bolívar; the app's canonical featured fixture is
    // River Plate vs Boca Juniors, so the structure and its treatments come from the design
    // and the values come from the fixture.
    expect(html).toContain("EN VIVO · SET 3");
    expect(html).toContain("Estadio Monumental · Liga A1");
    expect(html).toContain("21:42");
    expect(html).toContain("Árbitro: P. López");
    expect(html).toContain("River Plate");
    expect(html).toContain("Boca Juniors");
    expect(html).toContain(">R</span>");
    expect(html).toContain(">B</span>");
    expect(html).toContain("Local · 2 sets");
    expect(html).toContain("Visitante · 1 set");
    expect(html).toContain("al mejor de 5");
    expect(html).toContain("2 <small");
    expect(html).toContain("</small> 1");
    expect(html).toContain('21 <span class="text-vt-muted">—</span> 18');
    expect(html).toContain('style="width:60%"');
    expect(html).toContain("Ver partido en vivo →");
    expect(html).toContain('href="/matches/match-liga-a1-river-boca/live"');

    // Design source: voleytrack-dashboard.css:16-19 — the score is `.score`, mono at
    // 36px/800, which is the `Num` treatment plus the design's size.
    expect(html).toMatch(/class="font-mono tabular-nums text-right text-\[36px\] font-extrabold tracking-\[-0\.02em\]"/);
    // Design source: voleytrack.css:61 and dashboard.html:51 — the live pill is the
    // primitive's announced status region, not a decorative dot.
    expect(html).toMatch(/<span aria-live="polite" class="[^"]*bg-vt-danger[^"]*" role="status"/);
  });

  it("renders the design's highlight rail with its dashed link to the matches list", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    // Design source: frontend/design/html/voleytrack-dashboard.html:64-67 — a `.card` whose
    // `.card-h` reads "Próximos destacados" with a mono "HOY" eyebrow, two highlighted
    // fixtures, then a full-width dashed ghost button to the matches list.
    expect(html).toContain("Próximos destacados");
    expect(html).toContain("<small>HOY</small>");
    expect(html.match(/data-testid="dashboard-highlight"/g)).toHaveLength(2);
    expect(html).toContain("River Plate vs Ciudad Voley");
    expect(html).toContain("MIÉ 9 JUL · 20:00 · Estadio Monumental");
    expect(html).toContain("UPCN San Juan vs Bolívar");
    expect(html).toContain("JUE 10 JUL · 18:30 · Aldo Cantoni");
    expect(html).toContain("border-dashed");
    expect(html).toContain(">Ver todos los partidos →</a>");
    expect(html).toContain('href="/matches"');
  });

  it("renders the upcoming matches as a list with the design's state pills", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    // Design source: frontend/design/html/voleytrack-dashboard.html:70-78 — an
    // `.upcoming-head` row over `.row-match` rows of
    // `140px 1fr 160px 170px 100px` at a 12px gap and 14px 20px padding
    // (voleytrack-dashboard.css:9-17).
    expect(html).toContain("<ul>");
    expect(html.match(/data-testid="dashboard-upcoming-row"/g)).toHaveLength(3);
    expect(html.match(/<li /g)).toHaveLength(3);
    expect(html).toContain("Próximos partidos");
    expect(html).toContain(">Ver todos</a>");

    const rowClass = html.match(/<li class="([^"]*)"/)?.[1];
    expect(rowClass).toContain("min-[980px]:grid-cols-[140px_1fr_160px_170px_100px]");
    expect(rowClass).toContain("min-[980px]:gap-3");
    expect(rowClass).toContain("border-vt-border-2");
    expect(rowClass).toContain("px-5 py-3.5");

    expect(html).toContain("MIÉ 9 JUL · 20:00");
    expect(html).toContain("UPCN San Juan vs Bolívar");
    expect(html).toContain("Aldo Cantoni");
    expect(html).toContain("JUE 10 JUL · 21:00");
    expect(html).toContain("Boca Juniors vs Monteros");
    expect(html).toContain("La Bombonerita");
    expect(html).toContain('href="/matches/match-liga-a1-river-ciudad/live"');
    expect(html).toContain('href="/matches/match-liga-a1-upcn-bolivar/live"');
    expect(html).toContain('href="/matches/match-copa-nacional-boca-monteros/live"');

    // Design source: frontend/design/html/voleytrack.css:84-87 — the design's pill set is
    // programado / en vivo / finalizado. The fixture's "today" status (its own "Confirmado"
    // label) has no design counterpart and therefore renders the programado treatment.
    expect(html.match(/data-status="programado"/g)).toHaveLength(3);
    expect(html.match(/Estado: <\/span>Programado/g)).toHaveLength(3);
    expect(html).not.toContain("data-status=\"confirmado\"");

    // The head's "Ver todos" is the design's one 32px/.btn form (dashboard.html:71).
    expect(html).toContain("h-8");
    expect(html).toContain("text-[12px]");
  });

  it("renders the explicit error state override without dashboard content", () => {
    search = { state: "error" };
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("No pudimos mostrar esta información");
    expect(html).not.toContain("Próximos partidos");
    expect(html).not.toContain("Dashboard espectador");
    search = {};
  });

  it("keeps Dashboard active in the public sidebar at the root route", () => {
    const html = renderToStaticMarkup(
      <Sidebar currentPath="/" navigation={publicNavigation} roleLabel="Público" />,
    );

    expect(html).toMatch(/aria-current="page"[^>]*href="\/"/);
  });
});
