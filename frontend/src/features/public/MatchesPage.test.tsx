import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_MATCHES } from "../../fixtures";
import { MatchesPage } from "./MatchesPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useLocation: () => ({ search }),
}));

function renderMatches(status?: string) {
  search = status ? { status } : {};
  return renderToStaticMarkup(<MatchesPage />);
}

describe("public matches", () => {
  beforeEach(() => {
    search = {};
  });

  it("renders the main artboard with all fixture statuses and controlled status tabs", () => {
    const html = renderMatches();

    expect(html).toContain("Partidos");
    expect(html).toContain("Explorá partidos en vivo, próximos encuentros y resultados finalizados.");
    expect(html).toContain(PUBLIC_MATCHES.live[0].homeTeamName);
    expect(html).toContain(PUBLIC_MATCHES.today[0].scheduledLabel);
    expect(html).toContain(PUBLIC_MATCHES.upcoming[0].venue);
    expect(html).toContain(PUBLIC_MATCHES.finished[0].badgeLabel);
    expect(html).toContain('aria-label="Filtrar partidos por estado"');
    expect(html).toContain('aria-selected="true"');
  });

  it("links fixture-driven match cards to their canonical live detail routes", () => {
    const html = renderMatches();

    expect(html).toContain(`href="/matches/${PUBLIC_MATCHES.live[0].id}/live"`);
    expect(html).toContain(`href="/matches/${PUBLIC_MATCHES.finished[0].id}/live"`);
  });

  it.each([
    ["live", PUBLIC_MATCHES.live[0]],
    ["today", PUBLIC_MATCHES.today[0]],
    ["upcoming", PUBLIC_MATCHES.upcoming[0]],
    ["finished", PUBLIC_MATCHES.finished[0]],
  ] as const)("initializes the %s artboard from its status query", (status, match) => {
    const html = renderMatches(status);

    expect(html).toContain(match.homeTeamName);
    expect(html).toContain(match.awayTeamName);
    expect(html).toContain(match.scheduledLabel);
    expect(html).toContain('aria-selected="true"');
  });
});
