import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_MATCHES, PUBLIC_TEAMS } from "../../fixtures";
import { TeamMatchesPage } from "./TeamMatchesPage";

let teamId = PUBLIC_TEAMS[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: teamId }),
}));

function renderMatches(id = PUBLIC_TEAMS[0].id) {
  teamId = id;
  return renderToStaticMarkup(<TeamMatchesPage />);
}

describe("public team matches", () => {
  beforeEach(() => { teamId = PUBLIC_TEAMS[0].id; });

  it("renders selected team context and only its matches in fixture order", () => {
    const html = renderMatches();
    expect(html).toContain(PUBLIC_TEAMS[0].name);
    expect(html).toContain(PUBLIC_MATCHES.upcoming[0].venue);
    expect(html).toContain("En vivo");
    expect(html).toContain("2 - 1");
    expect(html).toContain("Programado");
    expect(html.indexOf(PUBLIC_MATCHES.live[0].id)).toBeLessThan(html.indexOf(PUBLIC_MATCHES.today[0].id));
    expect(html.indexOf(PUBLIC_MATCHES.today[0].id)).toBeLessThan(html.indexOf(PUBLIC_MATCHES.upcoming[0].id));
    expect(html).toContain(PUBLIC_MATCHES.finished[0].venue);
    const expectedMatches = Object.values(PUBLIC_MATCHES).flat().filter((match) => match.homeTeamId === PUBLIC_TEAMS[0].id || match.awayTeamId === PUBLIC_TEAMS[0].id);
    expect((html.match(/data-testid="team-match-row"/g) ?? []).length).toBe(expectedMatches.length);
  });

  it("renders alternate team matches", () => {
    const html = renderMatches(PUBLIC_TEAMS[1].id);
    expect(html).toContain(PUBLIC_TEAMS[1].name);
    expect(html).toContain(PUBLIC_MATCHES.live[0].homeTeamName);
    expect(html).not.toContain("Equipo no encontrado");
  });

  it("renders local tabs with Partidos active and links", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderMatches(team.id);
    expect(html).toContain(`href="/teams/${team.id}"`);
    expect(html).toContain(`href="/teams/${team.id}/roster"`);
    expect(html).toContain(`href="/teams/${team.id}/matches"`);
    expect(html).toContain(`href="/teams/${team.id}/stats"`);
    expect(html).toContain(`href="/teams/${team.id}/matches" aria-current="page"`);
    expect(html).toContain(`href="/matches/${PUBLIC_MATCHES.live[0].id}/live"`);
  });

  it("handles an unknown team", () => {
    const html = renderMatches("missing-team");
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });
});
