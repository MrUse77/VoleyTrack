import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card, CardBody } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Filter, FilterGroup } from "../../components/primitives/FilterGroup";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import { PUBLIC_TOURNAMENTS, type TournamentFixture, type TournamentType } from "../../fixtures";
import { badgeVariantByStatus } from "./tournamentTabs";

type TournamentStageFilter = "todos" | "en-curso" | "proximos" | "finalizados";
type TournamentTypeFilter = "todos" | "liga" | "copa";

/**
 * Design: frontend/design/html/voleytrack-torneos.html — the `tournaments-type-filter`
 * select's options are "Todos", "Liga" and "Copa", and the app keeps its own `status`
 * query (the same one `src/artboardManifest.ts` pins for /tournaments) as the design's
 * "Etapa" dimension, whose options there are "En curso" / "Próximo" / "Futuro". The
 * design's third dimension, "Equipos mínimos" (16 / 18), is not modelled: no tournament
 * fixture carries a minimum team count, and printing one would invent a number.
 */
const typeFilters = [
  { label: "Todos", value: "todos" },
  { label: "Liga", value: "liga" },
  { label: "Copa", value: "copa" },
] as const satisfies readonly { label: string; value: TournamentTypeFilter }[];

const stageFilters = [
  { label: "Todas", value: "todos" },
  { label: "En curso", value: "en-curso" },
  { label: "Próximos", value: "proximos" },
  { label: "Finalizados", value: "finalizados" },
] as const satisfies readonly { label: string; value: TournamentStageFilter }[];

function stageFilter(value: unknown): TournamentStageFilter {
  return value === "en-curso" || value === "proximos" || value === "finalizados" ? value : "todos";
}

function typeFilter(value: unknown): TournamentTypeFilter {
  return value === "liga" || value === "copa" ? value : "todos";
}

function visibleTournaments(stage: TournamentStageFilter, type: TournamentTypeFilter): readonly TournamentFixture[] {
  const byStage = stage === "en-curso"
    ? PUBLIC_TOURNAMENTS.inProgress
    : stage === "proximos"
      ? PUBLIC_TOURNAMENTS.upcoming
      : stage === "finalizados"
        ? PUBLIC_TOURNAMENTS.finished
        : PUBLIC_TOURNAMENTS.all;

  if (type === "todos") return byStage;

  const wanted: TournamentType = type === "liga" ? "Liga" : "Copa";
  return byStage.filter((tournament) => tournament.type === wanted);
}

export function TournamentsPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate();
  const stage = stageFilter(location.search.status);
  const type = typeFilter(location.search.type);

  const setFilter = (next: Partial<{ status: TournamentStageFilter; type: TournamentTypeFilter }>) => {
    navigate({
      to: ".",
      search: (current) => ({ ...current, ...next }),
    });
  };

  const tournaments = visibleTournaments(stage, type);

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="tournaments-page-content">
        {/* Design: voleytrack-torneos.html:44 — the `.page-head` h1 "Torneos" and its line. */}
        <PageHeader
          className="mb-[22px]"
          description="Explorá torneos activos, posiciones, próximos partidos y resultados recientes."
          title="Torneos"
        />

        {/*
         * Design: the `tournaments-filter-grid` holds the "Tipo" and "Etapa" selects in one
         * panel. Both dimensions are rendered here as the design's own `.filter` pill
         * (voleytrack.css:88-89) inside a labelled group with `aria-pressed`, because a
         * filter in this app is a real button, never a bare select.
         */}
        <FilterGroup aria-label="Filtrar torneos por tipo">
          {typeFilters.map((filter) => (
            <Filter
              isActive={type === filter.value}
              key={filter.value}
              onClick={() => setFilter({ type: filter.value })}
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        <FilterGroup aria-label="Filtrar torneos por etapa">
          {stageFilters.map((filter) => (
            <Filter
              isActive={stage === filter.value}
              key={filter.value}
              onClick={() => setFilter({ status: filter.value })}
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        {/* Design: voleytrack-torneos.css:12-14 (.tournament-results-count). */}
        <p
          aria-live="polite"
          className="mb-4 font-mono text-[11px] font-bold text-vt-muted"
          data-testid="tournaments-results-count"
        >
          <strong className="text-vt-text">{tournaments.length}</strong>{" "}
          {tournaments.length === 1 ? "torneo" : "torneos"}
        </p>

        {tournaments.length === 0 ? (
          /* Design: voleytrack-torneos.css:16-20 (.tournament-empty) and its copy at
             voleytrack-torneos.html:60. */
          <Card padded={false}>
            <EmptyState
              description="Prueba a reducir los filtros o límpialos para ver todos los torneos."
              title="No hay torneos que coincidan"
            />
          </Card>
        ) : (
          /*
           * Design: the same `.cards-grid` as the matches screen (voleytrack.css:91-93:
           * three columns, 16px gap, two below 1200px, one below 720px). The design's
           * tournament card is a clickable `.card` with a `.card-arrow` chevron and
           * `role="button"`; here it is a real link to the tournament, which is the same
           * destination with the browser's own link semantics.
           */
          <ul
            className="grid grid-cols-1 gap-4 min-[721px]:grid-cols-2 min-[1201px]:grid-cols-3"
            data-testid="tournaments-grid"
          >
            {tournaments.map((tournament) => (
              <li key={tournament.id}>
                <Link
                  aria-label={`Ver detalle de ${tournament.name}`}
                  className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                  data-testid="public-tournament-card"
                  to={`/tournaments/${tournament.id}` as string}
                >
                  <Card
                    className="h-full transition group-hover:-translate-y-0.5 group-hover:border-vt-accent group-hover:shadow-lg motion-reduce:transition-none"
                    padded={false}
                  >
                    {/* Design: `padding:16px;padding-right:52px` on the card, which is
                        `CardBody`'s 18px 20px with a wider right edge for the chevron. */}
                    <CardBody className="relative pr-[52px]" data-testid="tournament-card-body">
                      <span
                        aria-hidden="true"
                        className="absolute top-[14px] right-[14px] grid size-[26px] place-items-center rounded-full border border-vt-border-2 bg-vt-background text-vt-muted transition group-hover:border-vt-accent group-hover:bg-vt-accent group-hover:text-vt-background"
                      >
                        <svg
                          fill="none"
                          height="14"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="14"
                        >
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </span>

                      <small className="font-mono text-[10px] font-extrabold tracking-[0.08em] text-vt-muted uppercase">
                        {tournament.typeLabel} · {tournament.statusLabel}
                      </small>
                      <h3 className="mt-2 mb-1.5 text-[16px] font-bold text-vt-text">
                        {tournament.name}
                      </h3>
                      <p className="text-[13px] text-vt-muted">
                        {tournament.standings.length} equipos · {tournament.dateLabel} · {tournament.location}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant={badgeVariantByStatus[tournament.status]}>
                          {tournament.statusLabel}
                        </Badge>
                        <Badge>{tournament.standings.length} equipos</Badge>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StateBoundary>
  );
}
