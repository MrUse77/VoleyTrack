import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { EmptyState } from "../../components/primitives/EmptyState";
import { StatePill, type MatchStatus as PillStatus } from "../../components/primitives/StatePill";
import { ADMIN, type AdminMatchFixture, type MatchStatus } from "../../fixtures";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

/**
 * The admin tournament's `Partidos` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-copa.html — the "Partidos programados
 * <small>CREADOS EN ADMINISTRACIÓN</small>" card below the competition card, a `.match-list` of
 * `.match-card`s (a bold "Local vs Visitante" title, a `.match-meta` line, a `.state-pill`) and,
 * when there are none, the design's `#cup-matches-empty` status card ("Aún no hay partidos
 * programados"). voleytrack-admin-ver-torneo.html renders the same card for a league as
 * "Próximos partidos <small>JORNADA 15</small>" over a table; the app has no matchday number
 * for that eyebrow, so the panel reports the number of matches it actually has instead, and it
 * keeps the cup file's match-card treatment, which is the same treatment the admin matches list
 * already uses.
 *
 * PROTOTYPE DATA — NOT REAL: "Datos de referencia" is the design's own label for its prototype
 * rows (voleytrack-admin-partidos.html) and must be replaced by a real origin once matches are
 * created through the backend.
 */
const pillStatusByFixtureStatus: Record<MatchStatus, PillStatus> = {
  live: "envivo",
  today: "programado",
  upcoming: "programado",
  finished: "finalizado",
};

const sourceLabel = "Datos de referencia";

export function AdminTournamentMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  const matches = ADMIN.matches.filter((match) => match.tournamentId === tournament.id);

  return (
    <AdminTournamentShell activeTab="partidos" tournament={tournament}>
      <TournamentPanelHeader eyebrow={`${matches.length} PROGRAMADOS`}>
        Partidos programados
      </TournamentPanelHeader>

      {matches.length === 0 ? (
        /* Design: the cup detail's `#cup-matches-empty` status card. */
        <EmptyState
          description={`Crea el primer partido de ${tournament.name}.`}
          title="Aún no hay partidos programados"
        />
      ) : (
        /* Design: voleytrack-admin.css:197-198 `.match-list` — a 12px-gap grid of
           `.match-card`s, each a `minmax(0,1fr) auto auto` row at an 18px gap with
           `padding:16px 18px`, a 1px --border edge and a 14px radius; below 700px the card
           collapses to one column at an 8px gap. */
        <ul className="grid list-none gap-3 p-[18px]" data-testid="admin-tournament-match-list">
          {matches.map((match) => (
            <li key={match.id}>
              <MatchRow match={match} />
            </li>
          ))}
        </ul>
      )}

      <div className="px-[18px] pb-[18px]">
        <Link className={buttonClasses("ghost")} to={"/admin/matches/create" as string}>
          Crear partido
        </Link>
      </div>
    </AdminTournamentShell>
  );
}

function MatchRow({ match }: { match: AdminMatchFixture }) {
  return (
    <article
      className="grid gap-2 rounded-[14px] border border-vt-border bg-vt-surface px-[18px] py-4 min-[701px]:grid-cols-[minmax(0,1fr)_auto_auto] min-[701px]:items-center min-[701px]:gap-[18px]"
      data-testid="admin-tournament-match-row"
    >
      <div className="min-w-0">
        <h2 className="m-0 text-[15px] font-bold leading-[1.3] text-vt-text">
          {match.homeTeamName} vs {match.awayTeamName}
        </h2>
        <p className="mb-0 mt-1 text-[12px] text-vt-muted">
          {match.scheduledLabel} · {match.venue}
        </p>
      </div>
      <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.06em] text-vt-muted-2">
        {sourceLabel}
      </span>
      <StatePill status={pillStatusByFixtureStatus[match.status]} label={match.statusLabel} />
    </article>
  );
}
