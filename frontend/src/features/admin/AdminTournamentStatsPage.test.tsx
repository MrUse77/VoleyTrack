// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentStatsPage } from "./AdminTournamentStatsPage";

let tournamentId = ADMIN.tournaments[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string; "aria-current"?: "page" }) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a href={to} {...props}>{children}</a>;
  },
  useParams: () => ({ id: tournamentId }),
}));

function renderPage(id = ADMIN.tournaments[0].id) {
  tournamentId = id;
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminTournamentStatsPage />));
  return { container, root };
}

describe("admin tournament stats", () => {
  beforeEach(() => {
    tournamentId = ADMIN.tournaments[0].id;
  });

  it("renders the default Puntos leaderboard and local admin tabs", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderToStaticMarkup(<AdminTournamentStatsPage />);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.category);
    expect(html).toContain("Filtrar estadística");
    expect(html).toContain("Ranking de Jugadores · Puntos Totales");
    expect(html).toContain("Mateo Silva");
    expect(html).toContain("128 pts");
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/stats" aria-current="page"`);
  });

  it("updates the local leaderboard for Ataques and Bloqueos", () => {
    const { container, root } = renderPage();

    act(() => {
      [...container.querySelectorAll("button")].find((button) => button.textContent === "Ataques")?.click();
    });
    expect(container.textContent).toContain("Ranking de Jugadores · Ataques Totales");
    expect(container.textContent).toContain("82 ataques");
    expect(container.textContent).not.toContain("128 pts");

    act(() => {
      [...container.querySelectorAll("button")].find((button) => button.textContent === "Bloqueos")?.click();
    });
    expect(container.textContent).toContain("Ranking de Jugadores · Bloqueos Totales");
    expect(container.textContent).toContain("24 bloqueos");
    expect(container.textContent).not.toContain("82 ataques");

    act(() => root.unmount());
    container.remove();

    const remounted = renderPage();
    expect(remounted.container.textContent).toContain("Ranking de Jugadores · Puntos Totales");
    expect(remounted.container.textContent).toContain("128 pts");
    act(() => remounted.root.unmount());
    remounted.container.remove();
  });

  it("renders the existing-style unknown tournament fallback without rankings", () => {
    tournamentId = "missing-tournament";
    const html = renderToStaticMarkup(<AdminTournamentStatsPage />);

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/admin/tournaments"');
    expect(html).not.toContain("Ranking de Jugadores");
  });
});
