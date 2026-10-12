import { useLocation, useNavigate } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import type { DataTableColumn } from "../../components/primitives/DataTable";
import { DataTable } from "../../components/primitives/DataTable";
import { Card } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Filter, FilterGroup } from "../../components/primitives/FilterGroup";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import { teamListRows, type TeamListRow } from "./teamList";

/**
 * Design: frontend/design/html/voleytrack-equipos.html — the `teams` view is a `.page-head`
 * ("Equipos") over a `.table-wrap` whose columns are `Equipo | Torneo | Jugadores | PG / PP`
 * (its `PG / PP` header is marked `.num`), plus a `.team-empty` status block for a filter
 * that matches nothing.
 *
 * The design's own filter is a collapsible `Filtros` panel of three `<select>`s
 * (`teams-filter-panel`: Torneo, Jugadores mínimos, Partidos ganados mínimos). This app models
 * a filter as the design's `.filter` pill inside a labelled group — the treatment the
 * dashboard, match and tournament screens already share (voleytrack.css:88-89,
 * `FilterGroup`/`Filter`) — because the two "mínimos" dimensions are numeric thresholds the
 * design expresses as a select, not as an enumerable option set. Recorded as an unbuilt
 * design region rather than silently dropped.
 *
 * The design's four rows carry prototype numbers (`14` players, `8 / 2`, `Liga A1`) that no
 * app fixture backs. `./teamList` derives the same columns from the fixtures the app does
 * have, preferring a team's own `TeamDetailFixture` and falling back to the league standings
 * for its record. A team with neither keeps an em dash rather than an invented figure — the
 * same honesty rule the standings and roster tables already follow.
 *
 * Design intent kept: the design's "· SJ" short city hint is carried as the team's `city`,
 * because the fixture stores the full name and abbreviating it would drop information.
 */
export function TeamsPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate();
  const tournament = typeof location.search.torneo === "string" ? location.search.torneo : "todos";
  const allRows = teamListRows();
  const rows = tournament === "todos"
    ? allRows
    : allRows.filter((row) => row.tournamentName === tournament);

  const tournamentFilters = [
    { label: "Todos", value: "todos" },
    ...[...new Set(allRows.flatMap((row) => (row.tournamentName ? [row.tournamentName] : [])))].map(
      (name) => ({ label: name, value: name }),
    ),
  ];

  const columns: DataTableColumn<TeamListRow>[] = [
    {
      header: "Equipo",
      key: "name",
      render: (row) => (
        // Design: `.table-wrap tbody tr[onclick]` opens the team detail; an anchor is the
        // same destination with link semantics instead of a click handler on a row.
        <Link
          className="font-bold text-vt-text hover:text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/teams/${row.id}` as string}
        >
          {row.name}
        </Link>
      ),
    },
    { header: "Torneo", key: "tournamentName", render: (row) => row.tournamentName ?? "—" },
    { header: "Jugadores", key: "playerCount" },
    { header: "PG / PP", key: "record", numeric: true, render: (row) => row.record ?? "—" },
  ];

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="teams-page-content">
        {/* Design: voleytrack-equipos.html:44 — `.page-head` h1 "Equipos" and its line. */}
        <PageHeader
          className="mb-[22px]"
          description="Equipos con su torneo, tamaño de plantel y récord de partidos."
          title="Equipos"
        />

        <FilterGroup aria-label="Filtrar equipos por torneo">
          {tournamentFilters.map((filter) => (
            <Filter
              isActive={tournament === filter.value}
              key={filter.value}
              onClick={() =>
                navigate({ to: ".", search: (current) => ({ ...current, torneo: filter.value }) })
              }
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        {/* Design: voleytrack-equipos.css:12-14 (.team-results-count) — the mono 11px count
            with the number in --fg. The design places it in the filter panel's footer; here
            it sits with the pills, like the match and tournament screens'. */}
        <p
          aria-live="polite"
          className="mb-4 font-mono text-[11px] font-bold text-vt-muted"
          data-testid="teams-results-count"
        >
          <strong className="text-vt-text">{rows.length}</strong>{" "}
          {rows.length === 1 ? "equipo" : "equipos"}
        </p>

        {rows.length === 0 ? (
          /* Design: voleytrack-equipos.css:15-19 (.team-empty) and its copy at
             voleytrack-equipos.html:60. */
          <Card padded={false}>
            <EmptyState
              description="Prueba a reducir los filtros o límpialos para ver todos los equipos."
              title="No hay equipos que coincidan"
            />
          </Card>
        ) : (
          /* Design: `.table-wrap` — the card paints the box and the table's own frame is
             flattened into it, exactly as the tournament standings panel does. */
          <Card padded={false}>
            <DataTable
              columns={columns}
              getRowKey={(row) => row.id}
              rows={[...rows]}
              wrapperClassName="rounded-none border-0 bg-transparent"
            />
          </Card>
        )}
      </div>
    </StateBoundary>
  );
}
