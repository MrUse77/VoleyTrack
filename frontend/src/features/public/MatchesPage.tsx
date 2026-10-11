import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Filter, FilterGroup } from "../../components/primitives/FilterGroup";
import { Num } from "../../components/primitives/Num";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StatePill, type MatchStatus as PillStatus } from "../../components/primitives/StatePill";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_MATCHES,
  PUBLIC_TOURNAMENTS,
  type MatchFixture,
  type MatchStatus,
} from "../../fixtures";

type MatchesFilter = "all" | MatchStatus;

/**
 * The screen's pill group, in the design's order: its `.filters` row is the time window
 * (Todos / Hoy / Próximos, frontend/design/html/voleytrack-partidos.html) and the design's
 * status vocabulary adds the live and finished states it exposes in the filter panel
 * (`matches-status-filter`, same file: En vivo / Programado / Finalizado). The app's
 * fixture statuses are the union of both dimensions, and each one is a real button with
 * `aria-pressed` inside a labelled group.
 */
const filterTabs = [
  { label: "Todos", value: "all" },
  { label: "En vivo", value: "live" },
  { label: "Hoy", value: "today" },
  { label: "Próximos", value: "upcoming" },
  { label: "Finalizados", value: "finished" },
] as const satisfies readonly { label: string; value: MatchesFilter }[];

/**
 * The fixture's match status and the design's pill states are different vocabularies.
 * The fixture distinguishes a scheduled match that is already confirmed today ("today"),
 * which the design's visual language does not have — the design's `.state-pill` set is
 * programado / en vivo / finalizado (frontend/design/html/voleytrack.css:84-87) — so both
 * scheduled states render the design's "Programado" treatment instead of a fourth pill.
 */
const pillStatusByFixtureStatus: Record<MatchStatus, PillStatus> = {
  live: "envivo",
  today: "programado",
  upcoming: "programado",
  finished: "finalizado",
};

/**
 * The design's `.mcard-top small` carries the competition and the status word
 * ("LIGA A1 · EN VIVO", voleytrack-partidos.html:69), so the card needs the tournament's
 * name next to a status word the fixture already labels in Spanish.
 */
const statusWordByFixtureStatus: Record<MatchStatus, string> = {
  live: "En vivo",
  today: "Programado",
  upcoming: "Programado",
  finished: "Finalizado",
};

function matchFilter(value: unknown): MatchesFilter {
  return value === "live" || value === "today" || value === "upcoming" || value === "finished"
    ? value
    : "all";
}

function visibleMatches(status: MatchesFilter): readonly MatchFixture[] {
  return status === "all"
    ? [...PUBLIC_MATCHES.live, ...PUBLIC_MATCHES.today, ...PUBLIC_MATCHES.upcoming, ...PUBLIC_MATCHES.finished]
    : PUBLIC_MATCHES[status];
}

function tournamentName(match: MatchFixture): string {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === match.tournamentId)?.name
    ?? "Torneo no disponible";
}

/**
 * The design's `.mcard-score` is a mono `2:1` for a match in progress and an em dash for a
 * scheduled one (`—`, voleytrack-partidos.html:70-73), never a `0 - 0`.
 */
function scoreLabel(match: MatchFixture): string {
  return match.score ? `${match.score.home}:${match.score.away}` : "—";
}

/**
 * The design gives the finished card's pill the set score (`3-0`) and the live card's the
 * current set and score (`Set 3 · 18-21`); the fixture's `scheduledLabel` already carries
 * exactly that shape for every live or scheduled match.
 */
function statePillLabel(match: MatchFixture): string {
  return match.status === "finished" && match.score
    ? `${match.score.home}-${match.score.away}`
    : match.scheduledLabel;
}

export function MatchesPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate();
  const status = matchFilter(location.search.status);
  const setStatus = (nextStatus: MatchesFilter) => {
    navigate({
      to: ".",
      search: (current) => ({ ...current, status: nextStatus }),
    });
  };

  const matches = visibleMatches(status);

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="matches-page-content">
        {/*
         * Design: frontend/design/html/voleytrack.css:65-67 and
         * voleytrack-partidos.html:45 — `.page-head{margin-bottom:22px}` above the h1
         * "Partidos" and its single description line.
         */}
        <PageHeader
          className="mb-[22px]"
          description="Filtros, estados y acceso a detalle en vivo. Click en cualquier card abre el Live Detail (1.06)."
          title="Partidos"
        />

        {/*
         * Design: frontend/design/html/voleytrack.css:88-89
         *   .filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}
         *   .filter{height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--border);
         *           background:var(--surface);color:var(--muted);font-size:13px;font-weight:600}
         *   .filter.active{background:var(--fg);color:var(--bg);border-color:var(--fg)}
         * The inverted light pill is the design's own active treatment, not a mistake: it is
         * the same `.filter.active` rule the dashboard and the admin screens use.
         * `FilterGroup`/`Filter` are that rule as primitives (labelled `role="group"`, real
         * buttons, `aria-pressed`), so the group is not re-hand-rolled here.
         */}
        <FilterGroup aria-label="Filtrar partidos por estado">
          {filterTabs.map((filter) => (
            <Filter
              isActive={status === filter.value}
              key={filter.value}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        {/*
         * Design: voleytrack-partidos.css:18-19 (.match-results-count) — the panel footer's
         * mono 11px result count with the number in --fg. It is the design's only result
         * count, so it is kept as the design's own element; `aria-live="polite"` reports the
         * count changing with the filter.
         */}
        <p
          aria-live="polite"
          className="mb-4 font-mono text-[11px] font-bold text-vt-muted"
          data-testid="matches-results-count"
        >
          <strong className="text-vt-text">{matches.length}</strong>{" "}
          {matches.length === 1 ? "partido" : "partidos"}
        </p>

        {matches.length === 0 ? (
          /*
           * Design: voleytrack-partidos.css:22-26 (.match-empty) — a bordered, centred
           * status block reading "No hay partidos que coincidan" / "Prueba a reducir los
           * filtros o límpialos para ver todos los partidos." (voleytrack-partidos.html:78).
           * `EmptyState` is that block (role="status", h2 + p) inside the design's `.card`.
           */
          <Card padded={false}>
            <EmptyState
              description="Prueba a reducir los filtros o límpialos para ver todos los partidos."
              title="No hay partidos que coincidan"
            />
          </Card>
        ) : (
          /*
           * Design: frontend/design/html/voleytrack.css:91-93
           *   .cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
           *   @media(max-width:1200px){.cards-grid{grid-template-columns:repeat(2,1fr)}}
           *   @media(max-width:720px){.cards-grid{grid-template-columns:1fr}}
           * `ul`/`li` because the grid is a list of matches, not a decorative layout; each
           * card is the design's `.mcard`, which is an `<a>` to the live detail.
           */
          <ul
            className="grid grid-cols-1 gap-4 min-[721px]:grid-cols-2 min-[1201px]:grid-cols-3"
            data-testid="matches-grid"
          >
            {matches.map((match) => (
              <li key={match.id}>
                <Link
                  className="block h-full rounded-2xl border border-vt-border bg-vt-surface p-4 transition hover:-translate-y-px hover:border-vt-border-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                  data-testid="public-match-card"
                  to={`/matches/${match.id}/live` as string}
                >
                  {/* Design: voleytrack-partidos.css:3-4 (.mcard-top) — a flex row with the
                      mono 10px/800 uppercase eyebrow and the state pill, 12px apart. */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <small className="font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-vt-muted">
                      {tournamentName(match)} · {statusWordByFixtureStatus[match.status]}
                    </small>
                    <StatePill
                      label={statePillLabel(match)}
                      status={pillStatusByFixtureStatus[match.status]}
                    />
                  </div>

                  {/* Design: voleytrack-partidos.css:5-7 (.mcard-teams / .mcard-team /
                      .mcard-score) — a 12px-gap row of two 14px bold team names with the
                      18px/900 mono score between them, the away name right-aligned. */}
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-vt-text">
                        {match.homeTeamName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-vt-muted">Local</p>
                    </div>
                    <Num className="shrink-0 text-[18px] font-black text-vt-text">
                      {scoreLabel(match)}
                    </Num>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate text-[14px] font-bold text-vt-text">
                        {match.awayTeamName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-vt-muted">Visitante</p>
                    </div>
                  </div>

                  {/* Design: voleytrack-partidos.css:8 (.mcard-meta) — 12px above a 1px
                      --border-2 rule, a wrapped 8px-gap row of 12px --muted metadata. */}
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-vt-border-2 pt-3 text-[12px] text-vt-muted">
                    <span>{match.venue}</span>
                    <span aria-hidden="true">·</span>
                    <Num className="text-[12px]">{match.scheduledLabel}</Num>
                    <span aria-hidden="true">·</span>
                    <span>Ver detalle →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StateBoundary>
  );
}
