import { renderToStaticMarkup } from "react-dom/server";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SCORING } from "../../fixtures";
import { PostMatchSummaryPage } from "./PostMatchSummaryPage";

let matchId = SCORING.summary.matchId;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string } & ComponentPropsWithoutRef<"a">) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  },
  useParams: () => ({ id: matchId }),
}));

function renderSummary(id = SCORING.summary.matchId) {
  matchId = id;
  return renderToStaticMarkup(<PostMatchSummaryPage />);
}

describe("PostMatchSummaryPage", () => {
  beforeEach(() => {
    matchId = SCORING.summary.matchId;
  });

  it("renders the fixture-driven final scoreboard and completed set history", () => {
    const summary = SCORING.summary;
    const html = renderSummary();

    expect(html).toContain(summary.title);
    expect(html).toContain(summary.statusLabel);
    expect(html).toContain(summary.homeTeamName);
    expect(html).toContain(summary.awayTeamName);
    expect(html).toContain("Marcador final");
    expect(html).toContain(`${summary.finalScore.home} – ${summary.finalScore.away}`);
    expect(html).toContain("Resultados por set");
    for (const set of summary.sets) {
      expect(html).toContain(set.label);
      expect(html).toContain(`${set.home} – ${set.away}`);
    }
  });

  it("renders summary statistics for both teams", () => {
    const html = renderSummary();

    expect(html).toContain("Estadísticas del partido");
    expect(html).toContain("Ataques");
    expect(html).toContain("Bloqueos");
    expect(html).toContain("Saques directos");
    expect(html).toContain("Errores no forzados");
    expect(html).toContain("45");
    expect(html).toContain("38");
    expect(html).toContain("12");
    expect(html).toContain("9");
    expect(html).toContain("5");
    expect(html).toContain("3");
    expect(html).toContain("20");
    expect(html).toContain("24");
  });

  it("renders an explicit player-of-the-match panel", () => {
    const html = renderSummary();

    expect(html).toContain("Jugador del partido (MVP)");
    expect(html).toContain("Camila Sosa");
    expect(html).toContain("#11");
    expect(html).toContain("22 puntos");
  });

  it("renders honest local next actions", () => {
    const summary = SCORING.summary;
    const html = renderSummary();

    expect(html).toContain("Acciones de cierre");
    expect(html).toContain(`href="/admin/matches"`);
    expect(html).toContain("Volver a partidos");
    expect(html).toContain(`href="/matches/${summary.matchId}/live"`);
    expect(html).toContain("Abrir vista pública");
    expect(html).toContain("Finalizar revisión");
    expect(html).toContain("solo en esta sesión");
  });

  it("renders a clear fallback for an unknown match", () => {
    const html = renderSummary("unknown-match");

    expect(html).toContain("Partido no encontrado");
    expect(html).toContain(`href="/admin/matches"`);
    expect(html).not.toContain(SCORING.summary.statusLabel);
  });
});
