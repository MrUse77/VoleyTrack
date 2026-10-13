import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";
import { PlayersPage } from "./PlayersPage";

let search: Record<string, unknown> = {};

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useLocation: () => ({ search }),
  useNavigate: () => () => {},
}));

function renderPlayers(next: Record<string, unknown> = {}) {
  search = next;
  return renderToStaticMarkup(<PlayersPage />);
}

describe("public players list", () => {
  it("renders the design's table with column-header semantics and linked player cells", () => {
    const html = renderPlayers();

    expect(html).toContain('data-testid="players-page-content"');
    expect(html).toContain("<table");
    expect(html.match(/scope="col"/g)).toHaveLength(6);
    for (const heading of ["Jugador", "Equipo", "Posición", "Altura", "Pts", "Ficha"]) {
      expect(html).toContain(heading);
    }
    // Design: voleytrack-jugadores.html marks the `Pts` column `.num`.
    expect(html).toContain("font-mono tabular-nums text-right");

    for (const player of PUBLIC_PLAYERS) {
      const team = PUBLIC_TEAMS.find((item) => item.id === player.teamId)!;
      expect(html).toContain(player.fullName);
      expect(html).toContain(`#${player.number}`);
      expect(html).toContain(player.position);
      expect(html).toContain(team.name);
      expect(html).toContain(`href="/players/${player.id}"`);
      expect(html).toContain(`href="/teams/${team.id}"`);
    }
    expect(html).toContain("1.95m");
    expect(html).toContain("1.86m");
    expect(html).toContain("Ver ficha →");
  });

  it("reports the filtered result count with the design's own footer copy", () => {
    expect(renderPlayers()).toMatch(
      /data-testid="players-results-count"><strong[^>]*>2<\/strong> jugadores/,
    );
    expect(renderPlayers({ posicion: "Armadora" })).toMatch(
      /data-testid="players-results-count"><strong[^>]*>1<\/strong> jugador</,
    );
  });

  it("filters by the enumerable equipo and posición dimensions", () => {
    const byTeam = renderPlayers({ equipo: "Rosario Central Vóley" });
    expect(byTeam).toContain('aria-pressed="true"');
    expect(byTeam).toContain("Camila Sosa");
    expect(byTeam).not.toContain("Valentina Ruiz");

    const byPosition = renderPlayers({ posicion: "Armadora" });
    expect(byPosition).toContain("Valentina Ruiz");
    expect(byPosition).not.toContain("Camila Sosa");
  });

  it("renders the design's empty state when a filter matches no player", () => {
    const html = renderPlayers({ equipo: "Obras San Juan" });

    expect(html).toContain("No hay jugadores que coincidan");
    expect(html).toContain("Prueba a reducir los filtros o límpialos para ver todos los jugadores.");
    expect(html).toContain('role="status"');
    expect(html).not.toContain("<table");
  });
});
