import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";
import { TeamDetailPage } from "./TeamDetailPage";

let teamId = PUBLIC_TEAMS[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: teamId }),
}));

function renderTeamDetail(id = PUBLIC_TEAMS[0].id) {
  teamId = id;
  return renderToStaticMarkup(<TeamDetailPage />);
}

describe("public team detail", () => {
  beforeEach(() => {
    teamId = PUBLIC_TEAMS[0].id;
  });

  it("renders selected team context and metadata", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderTeamDetail(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain(team.city);
    expect(html).toContain(team.coach);
    expect(html).toContain(team.category);
    expect(html).toContain("Resumen del equipo");
  });

  it("renders an immutable roster preview", () => {
    const team = PUBLIC_TEAMS[0];
    const playerId = team.rosterPlayerIds[0];
    const player = PUBLIC_PLAYERS.find((item) => item.id === playerId);
    expect(player).toBeDefined();
    const html = renderTeamDetail(team.id);
    expect(html).toContain("Plantel");
    expect(html).toContain(player!.fullName);
    expect(html).toContain(player!.position);
    expect(html).toContain(String(player!.number));
    for (const playerId of team.rosterPlayerIds) {
      expect(html).toContain(`href="/players/${playerId}"`);
    }
  });

  it("renders local tabs with the summary tab active", () => {
    const team = PUBLIC_TEAMS[0];
    const html = renderTeamDetail(team.id);
    expect(html).toContain(`href="/teams/${team.id}"`);
    expect(html).toContain(`href="/teams/${team.id}/roster"`);
    expect(html).toContain(`href="/teams/${team.id}/matches"`);
    expect(html).toContain(`href="/teams/${team.id}/stats"`);
    expect(html).toContain('aria-current="page"');
  });

  it("handles an unknown team", () => {
    const html = renderTeamDetail("missing-team");
    expect(html).toContain("Equipo no encontrado");
    expect(html).toContain('href="/teams"');
  });

  it("renders an alternate team without the first team context", () => {
    const team = PUBLIC_TEAMS[1];
    const playerId = team.rosterPlayerIds[0];
    const player = PUBLIC_PLAYERS.find((item) => item.id === playerId);
    expect(player).toBeDefined();
    const html = renderTeamDetail(team.id);
    expect(html).toContain(team.name);
    expect(html).toContain(player!.fullName);
    expect(html).not.toContain(PUBLIC_TEAMS[0].name);
  });
});
