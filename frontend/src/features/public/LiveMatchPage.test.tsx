import type { AnchorHTMLAttributes, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_DASHBOARD, PUBLIC_MATCHES } from "../../fixtures";
import { LiveMatchPage } from "./LiveMatchPage";

let matchId = PUBLIC_MATCHES.live[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...props
  }: { children: ReactNode; to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ search: {} }),
  useParams: () => ({ id: matchId }),
}));

function renderLiveMatch(id = PUBLIC_MATCHES.live[0].id) {
  matchId = id;
  return renderToStaticMarkup(<LiveMatchPage />);
}

function classFor(html: string, testId: string) {
  const openingTag = html.match(
    new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`),
  )?.[0];

  return openingTag?.match(/class="([^"]*)"/)?.[1];
}

function classesFor(html: string, testId: string) {
  return [...html.matchAll(
    new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`, "g"),
  )].map(([openingTag]) => openingTag.match(/class="([^"]*)"/)?.[1]);
}

const dashboardLiveMatches = [
  PUBLIC_DASHBOARD.live.featured,
  ...PUBLIC_DASHBOARD.live.compact,
];

describe("public live match detail", () => {
  beforeEach(() => {
    matchId = PUBLIC_MATCHES.live[0].id;
  });

  it("owns the standalone canonical header and compact live scoreboard", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const headerClass = classFor(html, "live-match-header");
    const headerContentClass = classFor(html, "live-match-header-content");
    const backClass = classFor(html, "live-match-back-control");
    const statusClass = classFor(html, "live-match-header-status");

    expect(html).toContain('data-testid="live-match-shell"');
    expect(headerClass).toContain("min-[1440px]:h-[72px]");
    expect(headerContentClass).toContain("min-[1440px]:grid-cols-[120px_minmax(0,1fr)_204px]");
    expect(headerContentClass).toContain("min-[1440px]:gap-x-11");
    expect(backClass).toContain("min-[1440px]:h-8");
    expect(backClass).toContain("min-[1440px]:w-[120px]");
    expect(statusClass).toContain("min-[1440px]:w-[204px]");
    expect(html).toContain('href="/matches"');
    expect(html).toContain("← Volver");
    expect(html).toContain("River Plate vs Boca Juniors");
    expect(html).toContain("EN VIVO");
    expect(html).toContain('data-testid="live-match-scoreboard"');
    expect(html).toContain('data-testid="current-score-home">21<');
    expect(html).toContain('data-testid="current-score-away">18<');
    expect(html).toContain("Set 3 · 21-18 · Saque: River Plate");
    expect(html).not.toContain('data-testid="set-history-item"');
    expect(html).not.toContain("Historial de sets");
  });

  it("renders two read-only rotations with 12 labelled positions, a net, and attack lines", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const courtClass = classFor(html, "court-graphic");
    const rotationGridClasses = classesFor(html, "court-position-grid");
    const positionClasses = classesFor(html, "court-position");
    const responsiveCoordinates = positionClasses.map((classes) =>
      classes?.split(" ").filter(
        (token) => token.startsWith("col-start-") || token.startsWith("row-start-"),
      ),
    );

    expect(html).toContain('aria-labelledby="court-rotations-heading"');
    expect(positionClasses).toHaveLength(12);
    expect(html.match(/data-testid="volleyball-net"/g)).toHaveLength(1);
    expect(html.match(/data-testid="attack-line"/g)).toHaveLength(2);
    expect(courtClass).toContain("grid-cols-2");
    expect(rotationGridClasses).toHaveLength(2);
    for (const rotationClass of rotationGridClasses) {
      expect(rotationClass).toContain("grid-cols-2");
      expect(rotationClass).toContain("grid-rows-3");
    }
    expect(responsiveCoordinates).toEqual([
      ["col-start-2", "row-start-1"],
      ["col-start-2", "row-start-2"],
      ["col-start-2", "row-start-3"],
      ["col-start-1", "row-start-1"],
      ["col-start-1", "row-start-2"],
      ["col-start-1", "row-start-3"],
      ["col-start-1", "row-start-1"],
      ["col-start-1", "row-start-2"],
      ["col-start-1", "row-start-3"],
      ["col-start-2", "row-start-1"],
      ["col-start-2", "row-start-2"],
      ["col-start-2", "row-start-3"],
    ]);
    expect(html).toContain('aria-label="River Plate, posición 1: Mateo Silva, número 10"');
    expect(html).toContain('aria-label="Boca Juniors, posición 6: Alan Gómez, número 8"');
    expect(html).not.toContain("Registrar punto");
  });

  it("encodes the canonical local surfaces, headings, status, and event-row geometry", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const scoreboardClass = classFor(html, "live-match-scoreboard");

    for (const testId of [
      "live-match-header",
      "live-match-scoreboard",
      "team-statistics",
      "player-statistics",
      "live-events",
    ]) {
      expect(classFor(html, testId)).toContain("bg-vt-surface");
    }
    expect(scoreboardClass?.split(" ")).not.toContain("border");
    expect(scoreboardClass).not.toContain("border-vt-");
    expect(classFor(html, "court-rotations")?.split(" ")).toContain("border-vt-raised");
    expect(classFor(html, "court-rotations")).toContain("bg-vt-surface");
    expect(classFor(html, "court-graphic")).toContain("border-vt-raised-border");
    expect(classFor(html, "court-graphic")).toContain("bg-vt-raised");
    expect(classFor(html, "live-match-header-status")).toContain("text-xs");
    expect(html.match(/text-lg font-black leading-\[22px\] text-vt-text/g)).toHaveLength(3);
    expect(classFor(html, "live-event")).toContain(
      "min-[1400px]:grid-cols-[120px_240px_840px_108px]!",
    );
    expect(classFor(html, "live-event")).toContain("min-[1440px]:px-0");
  });

  it("renders recent live events with type, player, team, score, and set context", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(html).toContain('id="live-events-heading"');
    expect(html.match(/data-testid="live-event"/g)).toHaveLength(3);
    expect(html).toContain("Ataque punto");
    expect(html).toContain("Mateo Silva · River Plate");
    expect(html).toContain("Set 3 · 21-18");
    expect(html).toContain("Error no forzado");
    expect(html).toContain("Bruno Herrera · Boca Juniors");
    expect(html).toContain("Bloqueo punto");
    expect(html).toContain("Iván Molina · River Plate");
    expect(html.indexOf("21:45")).toBeLessThan(html.indexOf("21:43"));
    expect(html.indexOf("21:43")).toBeLessThan(html.indexOf("21:41"));
  });

  it("renders canonical player leaders and comparative team-stat categories", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(html).toContain('data-testid="player-statistics"');
    expect(html).toContain("Mejores jugadores");
    expect(html).toContain("Mateo Silva");
    expect(html).toContain("28 pts");
    expect(html).toContain("Bruno Herrera");
    expect(html).toContain("24 pts");
    expect(html).toContain("Iván Molina");
    expect(html).toContain("18 pts");
    expect(html).toContain('data-testid="team-statistics"');
    for (const category of [
      "Ataques punto",
      "Bloqueos punto",
      "Saques punto",
      "Errores no forzados",
    ]) {
      expect(html).toContain(category);
    }
    expect(html).toContain("45");
    expect(html).toContain("38");
  });

  it.each(dashboardLiveMatches)(
    "resolves dashboard live fixture $match.id to one coherent public detail projection",
    ({ match, tournamentName }) => {
      const html = renderLiveMatch(match.id);

      expect(html).toContain(`data-match-id="${match.id}"`);
      expect(html).toContain('data-testid="live-match-scoreboard"');
      expect(html).toContain(match.homeTeamName);
      expect(html).toContain(match.awayTeamName);
      expect(html).toContain(tournamentName);
      expect(html).toContain(match.venue);
      expect(html).toContain(`href="/teams/${match.homeTeamId}"`);
      expect(html).toContain(`href="/teams/${match.awayTeamId}"`);
    },
  );

  it("keeps metadata while encoding the exact standalone 1440 geometry with fixed heights", () => {
    const match = PUBLIC_MATCHES.live.find(
      ({ id }) => id === "match-liga-a1-river-boca",
    )!;
    const html = renderLiveMatch(match.id);
    const contentClass = classFor(html, "live-match-content");
    const scoreboardClass = classFor(html, "live-match-scoreboard");
    const courtClass = classFor(html, "court-rotations");
    const courtGraphicClass = classFor(html, "court-graphic");
    const statsClass = classFor(html, "live-statistics-grid");
    const teamStatsClass = classFor(html, "team-statistics");
    const playerStatsClass = classFor(html, "player-statistics");
    const eventsClass = classFor(html, "live-events");

    expect(html).toContain(match.venue);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain("Información del partido");
    expect(html).toContain("Estado");
    expect(html).toContain("Horario");
    expect(contentClass).toContain("w-full");
    expect(contentClass).toContain("max-w-[1368px]");
    expect(contentClass).toContain("min-[1440px]:w-[1368px]");
    expect(contentClass).not.toContain("max-w-[1104px]");
    expect(scoreboardClass).toContain("min-[1440px]:h-[180px]");
    expect(scoreboardClass).not.toContain("min-h-[180px]");
    expect(courtClass).toContain("mt-[30px]");
    expect(courtClass).toContain("min-[1440px]:h-[510px]");
    expect(courtClass).not.toContain("min-h-[510px]");
    expect(courtGraphicClass).toContain("min-[1440px]:h-[400px]");
    expect(courtGraphicClass).toContain("min-[1440px]:w-[1320px]");
    expect(statsClass).toContain("mt-[30px]");
    expect(statsClass).toContain("min-[1440px]:grid-cols-[660px_660px]");
    expect(statsClass).toContain("min-[1440px]:gap-12");
    expect(teamStatsClass).toContain("min-[1440px]:h-[280px]");
    expect(playerStatsClass).toContain("min-[1440px]:h-[280px]");
    expect(eventsClass).toContain("mt-[30px]");
    expect(eventsClass).toContain("min-[1440px]:h-[250px]");
  });

  it("uses canonical danger and leader accent color semantics", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(classFor(html, "team-stat-errors-home")).toContain("text-vt-danger");
    expect(classFor(html, "team-stat-errors-away")).toContain("text-vt-danger");
    expect(classFor(html, "player-leader-rank-1")).toContain("text-vt-accent");
    expect(classFor(html, "player-leader-points-1")).toContain("text-vt-accent");
    expect(classFor(html, "player-leader-rank-2")).toContain("text-vt-text");
    expect(classFor(html, "player-leader-points-2")).toContain("text-vt-text");
    expect(classFor(html, "player-leader-rank-3")).toContain("text-vt-text");
    expect(classFor(html, "player-leader-points-3")).toContain("text-vt-text");
  });

  it("renders an honest scheduled-match state when no live projection exists", () => {
    const match = PUBLIC_MATCHES.upcoming[0];
    const html = renderLiveMatch(match.id);

    expect(html).toContain(match.homeTeamName);
    expect(html).toContain(match.awayTeamName);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain(match.venue);
    expect(html).toContain("La cobertura en vivo todavía no está disponible para este partido.");
    expect(html).toContain('data-testid="live-match-shell"');
    expect(html).toContain('data-testid="live-match-header"');
    expect(html).not.toContain('data-testid="live-match-scoreboard"');
  });

  it("renders an unknown-match fallback", () => {
    const html = renderLiveMatch("unknown-match");

    expect(html).toContain("Partido no encontrado");
    expect(html).toContain("No existe un partido público con este identificador.");
    expect(html).toContain('href="/matches"');
    expect(html).toContain('data-testid="live-match-shell"');
    expect(html).toContain('data-testid="live-match-header"');
    expect(html).not.toContain('data-testid="live-match-scoreboard"');
  });
});
