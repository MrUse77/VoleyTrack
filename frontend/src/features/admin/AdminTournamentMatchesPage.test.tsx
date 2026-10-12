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
  Link: ({ activeOptions: _exactMarking, children, to, ...props }: { activeOptions?: unknown; children: ReactNode; to: string; "aria-current"?: "page" }) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a href={to} {...props}>{children}</a>;
  },
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
    // Design: the cup detail's panel is titled "Partidos programados"
    // (voleytrack-admin-ver-copa.html); this screen's former "Partidos del torneo" title was
    // the app's own wording and is gone.
    expect(html).toContain("Partidos programados");
    for (const match of ADMIN.matches.filter((item) => item.tournamentId === tournament.id)) {
      expect(html).toContain(match.homeTeamName);
      expect(html).toContain(match.awayTeamName);
      expect(html).toContain(match.scheduledLabel);
      expect(html).toContain(match.statusLabel);
    }
  });

  it("renders the shared admin tournament tabs with Partidos active", () => {
    const tournament = ADMIN.tournaments[0];
    const html = renderTournamentMatches(tournament.id);

    expect(html).toContain(`href="/admin/tournaments/${tournament.id}"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/matches"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/standings"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/stats"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/bracket"`);
    expect(html).toContain(`href="/admin/tournaments/${tournament.id}/edit"`);
    expect(html).toContain("Resumen");
    expect(html).toContain("Partidos");
    // The design's own label for the standings panel (voleytrack-admin-ver-torneo.html) —
    // this tab used to read "Tabla".
    expect(html).toContain("Clasificación");
    expect(html).toContain("Estadísticas");
    expect(html).toContain("Llaves");
    expect(html).toContain('href="/admin/tournaments/' + tournament.id + '/matches" aria-current="page"');
    expect(html).not.toContain('href="/admin/tournaments/' + tournament.id + '/standings" aria-current="page"');
    expect(html).not.toContain('href="/admin/tournaments/' + tournament.id + '/stats" aria-current="page"');
  });

  it("renders an explicit Spanish empty state for a known tournament without matches", () => {
    const html = renderTournamentMatches(emptyTournamentId);

    expect(html).toContain("Torneo sin partidos");
    // Design: the cup detail's `#cup-matches-empty` copy (voleytrack-admin-ver-copa.html).
    expect(html).toContain("Aún no hay partidos programados");
    expect(html).not.toContain('data-testid="admin-tournament-match-row"');
  });

  it("renders an explicit fallback without match data for an unknown tournament", () => {
    const html = renderTournamentMatches("missing-tournament");

    expect(html).toContain("Torneo no encontrado");
    expect(html).toContain('href="/admin/tournaments"');
    expect(html).not.toContain(ADMIN.matches[0].homeTeamName);
  });
});
