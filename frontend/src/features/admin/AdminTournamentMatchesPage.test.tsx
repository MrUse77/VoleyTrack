import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentMatchesPage } from "./AdminTournamentMatchesPage";

const { emptyTournamentId } = vi.hoisted(() => ({ emptyTournamentId: "empty-tournament" }));

vi.mock("../../fixtures", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../fixtures")>();

  return {
    ...actual,
    ADMIN: {
      ...actual.ADMIN,
      tournaments: [
        ...actual.ADMIN.tournaments,
        { ...actual.ADMIN.tournaments[0], id: emptyTournamentId, name: "Torneo sin partidos" },
      ],
    },
  };
});

let tournamentId = ADMIN.tournaments[0].id;

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: { children: ReactNode; to: string; "aria-current"?: "page" }) => (
    <a href={to} {...props}>{children}</a>
  ),
  useParams: () => ({ id: tournamentId }),
}));

function renderTournamentMatches(id = ADMIN.tournaments[0].id) {
  tournamentId = id;
  return renderToStaticMarkup(<AdminTournamentMatchesPage />);
}

describe("admin tournament matches", () => {
  beforeEach(() => {
    tournamentId = ADMIN.tournaments[0].id;
  });

  it("renders the selected tournament context and fixture-driven match list", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderTournamentMatches(tournament.id);

    expect(html).toContain(tournament.name);
    expect(html).toContain(tournament.category);
    expect(html).toContain("Partidos del torneo");
    for (const match of ADMIN.matches.filter((item) => item.tournamentId === tournament.id)) {
      expect(html).toContain(match.homeTeamName);
      expect(html).toContain(match.awayTeamName);
      expect(html).toContain(match.scheduledLabel);
      expect(html).toContain(match.statusLabel);
    }
  });

  it("renders local admin tournament tabs with Matches active", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderTournamentMatches(tournament.id);

    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/stats"`);
    expect(html).toContain("Partidos");
    expect(html).toContain("Tabla");
    expect(html).toContain("Estadísticas");
    expect(html).toContain('href="/admin/tournaments/' + tournament.id + '/matches" aria-current="page"');
    expect(html).toContain('href="/admin/tournaments/' + tournament.id + '/standings"');
    expect(html).toContain('href="/admin/tournaments/' + tournament.id + '/stats"');
    expect(html).not.toContain('href="/admin/tournaments/' + tournament.id + '/standings" aria-current="page"');
    expect(html).not.toContain('href="/admin/tournaments/' + tournament.id + '/stats" aria-current="page"');
  });

  it("renders an explicit Spanish empty state for a known tournament without matches", () => {
    const html = renderTournamentMatches(emptyTournamentId);

    expect(html).toContain("Torneo sin partidos");
    expect(html).toContain("Este torneo todavía no tiene partidos programados.");
    expect(html).not.toContain('data-testid="admin-tournament-match-row"');
  });

  it("renders an explicit fallback without match data for an unknown tournament", () => {
    const html = renderTournamentMatches("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/admin/tournaments"');
    expect(html).not.toContain(ADMIN.matches[0].homeTeamName);
  });
});
