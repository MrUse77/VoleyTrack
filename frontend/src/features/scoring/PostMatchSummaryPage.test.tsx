import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SCORING } from "../../fixtures";
import { PostMatchSummaryPage } from "./PostMatchSummaryPage";

let matchId = SCORING.summary.matchId;

vi.mock("@tanstack/react-router", () => ({
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

  it("renders the fixture-driven final score, teams, finished status, and set details", () => {
    const summary = SCORING.summary;
    const html = renderSummary();

    expect(html).toContain(summary.title);
    expect(html).toContain(summary.statusLabel);
    expect(html).toContain(summary.homeTeamName);
    expect(html).toContain(summary.awayTeamName);
    expect(html).toContain(`${summary.finalScore.home} – ${summary.finalScore.away}`);
    for (const set of summary.sets) {
      expect(html).toContain(set.label);
      expect(html).toContain(`${set.home} – ${set.away}`);
    }
  });

  it("renders a clear fallback for an unknown match", () => {
    const html = renderSummary("unknown-match");

    expect(html).toContain("Partido no encontrado");
    expect(html).not.toContain(SCORING.summary.statusLabel);
  });
});
