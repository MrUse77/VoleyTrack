import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_MATCHES,
  PUBLIC_TOURNAMENTS,
  type MatchFixture,
  type MatchStatus,
} from "../../fixtures";

type MatchesFilter = "all" | MatchStatus;

const filterCards = [
  { detail: "Jugándose", label: "EN VIVO", status: "live", value: "12" },
  { detail: "Partidos de hoy", label: "HOY", status: "today", value: "24" },
  { detail: "Por empezar", label: "PRÓXIMOS", status: "upcoming", value: "8" },
  { detail: "Terminados", label: "FINALIZ.", status: "finished", value: "32" },
] as const;

const filterLabels: Record<MatchesFilter, string> = {
  all: "Todos",
  finished: "Finalizados",
  live: "En vivo",
  today: "Hoy",
  upcoming: "Próximos",
};

const badgeVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
} as const;

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

function scoreLabel(match: MatchFixture): string {
  return match.score ? `${match.score.home} - ${match.score.away}` : "Sin marcador";
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
      <div
        className="w-full max-w-[1104px] min-[1416px]:ml-1 min-[1416px]:mt-2"
        data-testid="matches-page-content"
      >
        <section
          aria-label="Resumen de estados"
          className="grid gap-6 sm:grid-cols-2 min-[1416px]:grid-cols-[repeat(4,258px)]"
          data-testid="matches-status-summary"
        >
          <p className="sr-only">Filtro actual: {filterLabels[status]}</p>
          {filterCards.map((filter) => {
            const active = status === filter.status;
            return (
              <button
                aria-pressed={active}
                className={`h-[86px] rounded-[14px] text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${active ? "ring-1 ring-vt-accent" : ""}`}
                key={filter.status}
                onClick={() => setStatus(active ? "all" : filter.status)}
                type="button"
              >
                <Card className="h-full p-[18px]">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className={`text-xs font-bold tracking-[0.08em] ${active ? "text-vt-accent" : "text-vt-muted"}`}>{filter.label}</p>
                      <p className="mt-4 text-3xl font-black text-vt-text">{filter.value}</p>
                    </div>
                    <p className={filter.status === "live" ? "text-xs font-bold text-vt-success" : "text-xs font-bold text-vt-muted"}>{filter.detail}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </section>

        <MatchesMasterDetail key={status} matches={matches} />
      </div>
    </StateBoundary>
  );
}

function MatchesMasterDetail({ matches }: { matches: readonly MatchFixture[] }) {
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id ?? null);
  const selectedMatch = matches.find((match) => match.id === selectedMatchId) ?? matches[0];

  if (!selectedMatch) {
    return (
      <Card>
        <p className="text-sm text-vt-muted">No hay partidos para este filtro.</p>
      </Card>
    );
  }

  return (
    <section
      className="mt-10 grid gap-6 min-[1416px]:grid-cols-[736px_340px] min-[1416px]:items-start min-[1416px]:gap-7"
      data-testid="matches-master-detail"
    >
      <section aria-label="Calendario de partidos">
        <Card
          className="overflow-hidden p-0 min-[1416px]:max-h-[482px] min-[1416px]:overflow-y-auto"
          data-testid="matches-list"
        >
          <header className="sticky top-0 z-10 flex min-h-[50px] items-center justify-between gap-4 border-b border-vt-border bg-vt-panel px-5">
            <h2 className="text-sm font-bold text-vt-text">Calendario de partidos</h2>
            <p className="text-[11px] text-vt-muted">
              {matches.length} {matches.length === 1 ? "resultado" : "resultados"}
            </p>
          </header>

          <ol className="space-y-3 p-5">
            {matches.map((match) => {
              const selected = match.id === selectedMatch.id;
              return (
                <li key={match.id}>
                  <button
                    aria-controls="selected-match-detail"
                    aria-pressed={selected}
                    className={`grid min-h-[74px] w-full gap-3 rounded-xl border px-4 py-3 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${selected ? "border-vt-accent bg-vt-accent/10" : "border-vt-border bg-vt-panel hover:border-vt-accent/70"}`}
                    data-testid="public-match-row"
                    onClick={() => setSelectedMatchId(match.id)}
                    type="button"
                  >
                    <span className="flex min-w-[94px] flex-col items-start gap-2">
                      <Badge variant={badgeVariants[match.status]}>{match.badgeLabel}</Badge>
                      <span className="text-[11px] font-bold text-vt-muted">{match.scheduledLabel}</span>
                    </span>

                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-vt-text">
                        {match.homeTeamName} vs {match.awayTeamName}
                      </span>
                      <span className="mt-1 block truncate text-[11px] text-vt-muted">
                        {tournamentName(match)} · {match.venue}
                      </span>
                    </span>

                    <span className={`text-base font-black sm:min-w-[86px] sm:text-right ${match.score ? "text-vt-accent" : "text-vt-muted"}`}>
                      {scoreLabel(match)}
                    </span>
                    {selected ? <span className="sr-only">Seleccionado</span> : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>
      </section>

      <section
        aria-label="Detalle del partido seleccionado"
        aria-live="polite"
        className="min-[1416px]:sticky min-[1416px]:top-6"
        id="selected-match-detail"
      >
        <Card className="p-5">
          <h2 className="text-[15px] font-black text-vt-text">Detalle del partido</h2>

          <div className="mt-4 rounded-[14px] border border-vt-border bg-vt-panel p-4">
            <Badge variant={badgeVariants[selectedMatch.status]}>{selectedMatch.badgeLabel}</Badge>
            <p className="mt-4 text-lg font-black text-vt-text">{selectedMatch.homeTeamName}</p>
            <p className="mt-1 text-xs text-vt-muted">vs {selectedMatch.awayTeamName}</p>
            {selectedMatch.score ? (
              <p aria-label="Marcador" className="mt-4 text-2xl font-black text-vt-accent">
                {scoreLabel(selectedMatch)}
              </p>
            ) : (
              <p className="mt-4 text-sm font-semibold text-vt-muted">Marcador aún no disponible</p>
            )}
          </div>

          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 min-[1416px]:grid-cols-1">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">Torneo</dt>
              <dd className="mt-1 font-semibold text-vt-text">{tournamentName(selectedMatch)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">Sede</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedMatch.venue}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">Horario</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedMatch.scheduledLabel}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">Estado</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedMatch.badgeLabel}</dd>
            </div>
          </dl>

          <Link
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] bg-vt-accent px-4 text-sm font-bold text-vt-background transition hover:bg-[#ff9b59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            to={`/matches/${selectedMatch.id}/live` as string}
          >
            Ir al partido →
          </Link>
        </Card>
      </section>
    </section>
  );
}
