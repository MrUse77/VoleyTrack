import type { AnchorHTMLAttributes, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_DASHBOARD, PUBLIC_LIVE_MATCH_DETAILS, PUBLIC_MATCHES } from "../../fixtures";
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

function tagFor(html: string, testId: string) {
  return html.match(new RegExp(`<[^>]*data-testid="${testId}"[^>]*>`))?.[0];
}

const dashboardLiveMatches = [
  PUBLIC_DASHBOARD.live.featured,
  ...PUBLIC_DASHBOARD.live.compact,
];

const riverBocaDetail = PUBLIC_LIVE_MATCH_DETAILS.find(
  ({ match }) => match.id === "match-liga-a1-river-boca",
)!;

describe("public live match detail", () => {
  beforeEach(() => {
    matchId = PUBLIC_MATCHES.live[0].id;
  });

  it("owns the standalone canonical header and the design's scoreboard", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const headerClass = classFor(html, "live-match-header");
    const headerContentClass = classFor(html, "live-match-header-content");
    const backClass = classFor(html, "live-match-back-control");
    const statusClass = classFor(html, "live-match-header-status");
    const scoreboardClass = classFor(html, "live-match-scoreboard");

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

    // The header status is the shared state pill (design: voleytrack.css:84-87), not this
    // screen's own hand-rolled chip, so the state word comes from one primitively defined
    // treatment. It is the pill's job to say "En vivo" in words.
    expect(html).toContain('data-testid="live-match-header-status"');
    expect(html.substring(html.indexOf('data-testid="live-match-header-status"'))).toContain(
      'data-status="envivo"',
    );
    expect(html).toContain("En vivo");

    // Design: `.scoreboard` (voleytrack-live.css:3) — a 16px-radius --border hairline with
    // `padding:22px` and the design system's two-layer surface fill.
    expect(html).toContain('data-testid="live-match-scoreboard"');
    expect(scoreboardClass).toContain("rounded-2xl");
    expect(scoreboardClass).toContain("border-vt-border");
    expect(scoreboardClass).toContain("p-[22px]");
    expect(scoreboardClass).toContain("from-vt-surface-2");
    expect(scoreboardClass).toContain("to-vt-surface");
    expect(scoreboardClass).toContain("min-[720px]:grid-cols-[1fr_auto_1fr]");

    // The score is the sets score; the current set's score is the mono line under it.
    expect(html).toContain('data-testid="current-score-home">21<');
    expect(html).toContain('data-testid="current-score-away">18<');
    expect(html).toContain("SET 3");
    expect(html).toContain('href="/teams/river-plate"');
    expect(html).toContain('href="/teams/boca-juniors"');
  });

  it("announces the score through one polite atomic live region with a spoken alternative", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const regionTag = tagFor(html, "live-score-region")!;

    expect(regionTag).toContain('aria-live="polite"');
    expect(regionTag).toContain('aria-atomic="true"');
    // A bare "1 : 1" is punctuation to a screen reader, so the region carries the full
    // sentence and the painted digits are hidden from assistive tech.
    expect(html).toContain(
      "River Plate 1 set, Boca Juniors 1 set. Set 3: 21 a 18. Saca River Plate.",
    );
    expect(html).toContain('data-testid="live-set-score"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('aria-live="polite"');
    // The design's mono score treatment (.num, voleytrack.css:100) is what makes the
    // changing figures line up.
    expect(html).toContain("font-mono tabular-nums");
  });

  it("renders the court as twelve labelled positions with the net, the 3m lines and a text alternative", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");
    const courtClass = classFor(html, "court-graphic");
    const rotationGridClasses = classesFor(html, "court-position-grid");
    const positionClasses = classesFor(html, "court-position");

    expect(html).toContain('id="court-rotations-heading"');
    expect(positionClasses).toHaveLength(12);
    expect(html.match(/data-testid="volleyball-net"/g)).toHaveLength(1);
    expect(html.match(/data-testid="attack-line"/g)).toHaveLength(2);
    expect(rotationGridClasses).toHaveLength(2);
    for (const rotationClass of rotationGridClasses) {
      expect(rotationClass).toContain("contents");
    }

    // Design: a --surface-2 court at `aspect-ratio:18/9` (voleytrack-live.html, the
    // `cancha-voley` card), with the player markers absolutely positioned on it.
    expect(courtClass).toContain("bg-vt-surface-2");
    expect(courtClass).toContain("aspect-[18/9]");
    expect(courtClass).toContain("rounded-[14px]");
    const courtTag = tagFor(html, "court-graphic")!;
    expect(courtTag).toContain('role="group"');
    expect(courtTag).toContain('aria-describedby="court-rotations-description"');

    // The court is not an unlabelled graphic: the description states the two formations and
    // who serves, and every marker names its team, slot, player and shirt number.
    const description = html.match(
      /<p class="sr-only" id="court-rotations-description">([^<]*)<\/p>/,
    )?.[1];
    expect(description).toContain("Cancha dividida por la red central.");
    expect(description).toContain("River Plate ocupa la mitad izquierda");
    expect(description).toContain("Boca Juniors ocupa la mitad derecha");
    expect(description).toContain("Saca River Plate.");
    expect(html).toContain('aria-label="River Plate, rotación actual"');
    expect(html).toContain('aria-label="Boca Juniors, rotación actual"');
    expect(html).toContain('aria-label="River Plate, posición 1: Mateo Silva, número 10"');
    expect(html).toContain('aria-label="Boca Juniors, posición 6: Alan Gómez, número 8"');
    // Home markers sit left of the net in the design's two columns, away markers mirrored.
    expect(positionClasses[0]).toContain("left-[40%]");
    expect(positionClasses[3]).toContain("left-[18%]");
    expect(positionClasses[6]).toContain("right-[40%]");
    expect(positionClasses[9]).toContain("right-[18%]");
    expect(positionClasses[0]).toContain("top-[20%]");
    expect(positionClasses[1]).toContain("top-[50%]");
    expect(positionClasses[2]).toContain("top-[80%]");

    // The side indicators the design uses: team badges, the formation lines and the serving
    // side as a chip.
    expect(html).toContain("12 jugadores");
    expect(html).toContain("River Plate: 3 delante 3m · 3 detrás");
    expect(html).toContain("Boca Juniors: 3 delante 3m · 3 detrás");
    expect(html).toContain("Saque: River Plate");
    expect(html).not.toContain("Registrar punto");
  });

  it("encodes the structural card form, the design's headings and the timeline geometry", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    for (const testId of [
      "set-history-card",
      "court-rotations",
      "live-events",
      "team-statistics",
      "top-scorers",
      "roster-home",
      "roster-away",
      "match-metadata",
    ]) {
      const cardClass = classFor(html, testId);
      expect(cardClass, `${testId} should be a structural Card`).toContain("overflow-hidden");
      expect(cardClass).not.toContain("p-6");
    }

    // The court card is the design's own --surface-2 court on the design's surface layer,
    // and the card itself is the design's --surface fill with its --border hairline
    // (voleytrack.css:75). Both are ratcheted globally in styles/tokens.test.ts, so this
    // screen pins what it now uses instead of re-spelling the app-only token names.
    expect(classFor(html, "court-rotations")).toContain("bg-vt-surface");
    expect(classFor(html, "court-rotations")).toContain("border-vt-border");
    expect(classFor(html, "court-graphic")).toContain("bg-vt-surface-2");

    // Design: `.card-b` (voleytrack.css:78) is `18px 20px`, so the applied padding proves
    // the structural form rather than the legacy uniform 24px box.
    for (const testId of ["court-card-body", "live-events-card-body"]) {
      expect(classFor(html, testId)).toContain("px-5");
      expect(classFor(html, testId)).toContain("py-[18px]");
    }

    // Design: the timeline is `.timeline > .tl-item` (voleytrack-live.css:4-7), rendered
    // here as a real ordered list so it reads as a list of events.
    expect(html).toContain('id="live-events-heading"');
    // "AUTO · 2s" is the design's own `.live-pill` in the events header.
    expect(html).toContain("AUTO · 2s");
    const listTag = tagFor(html, "live-event-list")!;
    expect(listTag.startsWith("<ol")).toBe(true);
    expect(html.match(/data-testid="live-event"/g)).toHaveLength(3);
    expect(classFor(html, "live-event")).toContain("last:mb-0");
  });

  it("renders the live events as a list with time, set, type, player, team and score", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(html).toContain('data-testid="live-event-list"');
    expect(html).toContain("Ataque punto");
    expect(html).toContain("Mateo Silva (River Plate)");
    expect(html).toContain("Error no forzado");
    expect(html).toContain("Bruno Herrera (Boca Juniors)");
    expect(html).toContain("Bloqueo punto");
    expect(html).toContain("Iván Molina (River Plate)");
    expect(html).toContain("<time>21:45</time>");
    expect(html).toContain("· Set 3");
    expect(html).toContain("21-18");
    // The most recent event is first, and it is labelled in words rather than only toned.
    expect(html.indexOf("21:45")).toBeLessThan(html.indexOf("21:43"));
    expect(html.indexOf("21:43")).toBeLessThan(html.indexOf("21:41"));
    expect(html).toContain("Evento más reciente.");
  });

  it("renders the set history, the comparative team statistics and the top scorers", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    // Design: `.set-history-card` with one `.set-result` per set and its state in words.
    expect(html).toContain("Historial de sets");
    expect(html).toContain("Resultado del partido · River Plate vs Boca Juniors");
    expect(html).toContain("SET 3 EN VIVO");
    expect(html.match(/data-testid="set-history-item"/g)).toHaveLength(3);
    expect(html).toContain("Finalizado");
    expect(html).toContain("Set 1");
    expect(html).toContain("Set 3");

    // Design: `.stat-row` / `.stat-value` (voleytrack-live.css:16-21).
    expect(html).toContain('data-testid="team-statistics"');
    expect(html).toContain("Estadísticas por equipo");
    expect(html).toContain("Comparativa del partido · Set 3");
    expect(html.match(/data-testid="team-stat-row"/g)).toHaveLength(4);
    for (const category of [
      "Ataques punto",
      "Bloqueos punto",
      "Saques punto",
      "Errores no forzados",
    ]) {
      expect(html).toContain(category);
    }
    // Every row carries a spoken sentence linking each figure to its team, so the number
    // pair and its colour-coded bar are never the only carrier.
    expect(html).toContain("Ataques punto: River Plate 45, Boca Juniors 38");
    expect(html).toContain("Errores no forzados: River Plate 15, Boca Juniors 18");

    // Design: `.scorer-list` / `.scorer-rank` / `.scorer-points` (voleytrack-live.css:23-34).
    expect(html).toContain("Top anotadores");
    expect(html).toContain("Puntos acumulados");
    expect(html).toContain("TOP 3");
    expect(html.match(/data-testid="top-scorer"/g)).toHaveLength(3);
    expect(html).toContain("01");
    expect(html).toContain("Mateo Silva");
    expect(html).toContain("28");
    expect(html).toContain("Bruno Herrera");
    expect(html).toContain("24");
    expect(html).toContain("Iván Molina");
    expect(html).toContain("18");
  });

  it("renders both teams' individual roster lines from the immutable rosters projection", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(html).toContain("Estadísticas individuales");
    expect(html).toContain("Rendimiento del partido · PTS, ATA, BLQ y ACE");
    expect(html).toContain("12 JUGADORES");
    expect(html).toContain('data-testid="roster-grid"');
    expect(html.match(/data-testid="roster-player"/g)).toHaveLength(12);
    expect(html).toContain('data-testid="roster-home"');
    expect(html).toContain('data-testid="roster-away"');
    expect(classFor(html, "roster-home")).toContain("border-t-vt-blue");
    expect(classFor(html, "roster-away")).toContain("border-t-vt-accent");
    expect(html).toContain("River Plate");
    expect(html).toContain("Boca Juniors");
    expect(html).toContain("6 jugadores");
    // Every stat cell prints its own label, so PTS / ATA / BLQ / ACE are readable per row.
    for (const label of ["PTS", "ATA", "BLQ", "ACE"]) {
      expect(html).toContain(`>${label}</small>`);
    }
    // The roles are the five volleyball positions the design's roster prints.
    for (const role of ["Punta", "Central", "Opuesto", "Líbero", "Armador"]) {
      expect(html).toContain(`>${role}</p>`);
    }
    const first = riverBocaDetail.rosters[0].players[0];
    expect(html).toContain(`${first.playerName} #${first.number}`);
    expect(html).toContain(`${first.points}<small`);
  });

  it("keeps the match metadata as label/value rows and the standalone content geometry", () => {
    const match = PUBLIC_MATCHES.live.find(
      ({ id }) => id === "match-liga-a1-river-boca",
    )!;
    const html = renderLiveMatch(match.id);
    const contentClass = classFor(html, "live-match-content");

    expect(html).toContain(match.venue);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain("Información del partido");
    expect(html).toContain("Estado");
    expect(html).toContain("Horario");
    expect(html).toContain("Identificador");
    // InfoRow's own design treatment (voleytrack-admin.css:119-122) is a bordered row.
    expect(classFor(html, "match-metadata")).toContain("overflow-hidden");
    expect(html).toContain("border-b border-vt-border-2");
    expect(contentClass).toContain("w-full");
    expect(contentClass).toContain("max-w-[1368px]");
    expect(contentClass).toContain("min-[1440px]:w-[1368px]");
    expect(contentClass).not.toContain("max-w-[1104px]");
  });

  it("lays the court and the timeline out as the design's two-column row", () => {
    const html = renderLiveMatch("match-liga-a1-river-boca");

    expect(classFor(html, "live-court-grid")).toContain(
      "min-[1180px]:grid-cols-[1.15fr_0.85fr]",
    );
    expect(classFor(html, "match-insights")).toContain(
      "min-[1180px]:grid-cols-[1.15fr_0.85fr]",
    );
    expect(classFor(html, "roster-grid")).toContain("min-[1180px]:grid-cols-2");
  });

  it.each(dashboardLiveMatches)(
    "resolves dashboard live fixture $match.id to one coherent public detail projection",
    ({ match, tournamentName }) => {
      const html = renderLiveMatch(match.id);

      expect(html).toContain(`data-match-id="${match.id}"`);
      expect(html).toContain('data-testid="live-match-scoreboard"');
      expect(html).toContain('data-testid="set-history-card"');
      expect(html).toContain('data-testid="court-rotations"');
      expect(html).toContain('data-testid="live-events"');
      expect(html).toContain(match.homeTeamName);
      expect(html).toContain(match.awayTeamName);
      expect(html).toContain(tournamentName);
      expect(html).toContain(match.venue);
      expect(html).toContain(`href="/teams/${match.homeTeamId}"`);
      expect(html).toContain(`href="/teams/${match.awayTeamId}"`);
    },
  );

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
    expect(html).toContain('data-status="programado"');
    expect(html).toContain("Sin datos");
    expect(html).not.toContain('data-testid="live-match-scoreboard"');
  });
});
