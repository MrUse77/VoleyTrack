import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";
import { TeamRosterPage } from "./TeamRosterPage";

let teamId = PUBLIC_TEAMS[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: teamId }),
}));

function renderRoster(id = PUBLIC_TEAMS[0].id) {
  teamId = id;
  return renderToStaticMarkup(<TeamRosterPage />);
}

describe("public team roster", () => {
  beforeEach(() => { teamId = PUBLIC_TEAMS[0].id; });

  it("renders selected team context and joined roster rows", () => {
    const team = PUBLIC_TEAMS[0];
    const player = PUBLIC_PLAYERS.find((item) => item.id === team.rosterPlayerIds[0]);
    const html = renderRoster(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain(team.city);
    expect(html).toContain(team.category);
    expect(html).toContain(player!.fullName);
    expect(html).toContain(player!.position);
    expect(html).toContain(String(player!.number));
    for (const playerId of team.rosterPlayerIds) {
      expect(html).toContain(`href="/players/${playerId}"`);
    }
  });

  it("renders local tabs with Plantel active", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderRoster(team.id);
    expect(html).toContain(`href="/teams/${team.id}"`);
    expect(html).toContain(`href="/teams/${team.id}/roster"`);
    expect(html).toContain(`href="/teams/${team.id}/matches"`);
    expect(html).toContain(`href="/teams/${team.id}/stats"`);
    expect(html).toContain('aria-current="page"');
  });

  it("handles an unknown team", () => {
    const html = renderRoster("missing-team");
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });

  it("renders an alternate team roster", () => {
    const team = PUBLIC_TEAMS[1];
    const player = PUBLIC_PLAYERS.find((item) => item.id === team.rosterPlayerIds[0]);
    const html = renderRoster(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain(player!.fullName);
    expect(html).not.toContain(PUBLIC_TEAMS[0].name);
  });
});
