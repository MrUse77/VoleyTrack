import { useLocation, useNavigate } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import type { DataTableColumn } from "../../components/primitives/DataTable";
import { DataTable } from "../../components/primitives/DataTable";
import { Card } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Filter, FilterGroup } from "../../components/primitives/FilterGroup";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
  PUBLIC_PLAYER_DETAILS,
  PUBLIC_PLAYERS,
  PUBLIC_TEAMS,
  type PlayerDetailFixture,
} from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-jugadores.html — the `players` view is a
 * `.page-head` ("Jugadores") over a `.table-wrap` whose columns are
 * `Jugador | Equipo | Posición | Altura | Pts` plus a trailing "Ver ficha →" action
 * (`Pts` is marked `.num`), and a `.player-empty` status block for an empty result.
 *
 * The design's filter is the collapsible `players-filter-panel` of four `<select>`s
 * (Equipo, Posición, Altura mínima, Puntos mínimos) whose options are a men's-league roster
 * ("Punta / Central / Opuesto"). This app's two public players are women's-league fixtures,
 * so the enumerable dimensions — Equipo and Posición — are the design's `.filter` pills
 * inside labelled groups (the shared treatment at voleytrack.css:88-89), their options are
 * derived from the fixtures instead of copied, and the two height/points thresholds are
 * recorded as unbuilt rather than rendered as dead selects.
 */
type PlayerListRow = Readonly<{
  id: string;
  fullName: string;
  number: number;
  teamId: string;
  teamName: string;
  position: string;
  heightLabel: string | null;
  points: string | null;
}>;

/**
 * The design's rows carry prototype men's-league data. This derives the same columns from
 * the app's two public player fixtures: `Altura` from the player's detail projection and
 * `Pts` from that projection's "Puntos" KPI, both em-dashed when a player has no public
 * detail rather than filled with an invented value. Only players with a public profile are
 * listed — the same set `TeamRosterPage` links — so every row's "Ver ficha →" resolves.
 */
function playerListRows(): readonly PlayerListRow[] {
  return PUBLIC_PLAYERS.flatMap((player) => {
    const team = PUBLIC_TEAMS.find((item) => item.id === player.teamId);
    if (!team) return [];

    const detail: PlayerDetailFixture | undefined = PUBLIC_PLAYER_DETAILS.find(
      (item) => item.playerId === player.id,
    );

    return [{
      id: player.id,
      fullName: player.fullName,
      number: player.number,
      teamId: team.id,
      teamName: team.name,
      position: player.position,
      heightLabel: detail?.heightLabel ?? null,
      points: detail?.kpis.find((kpi) => kpi.label === "Puntos")?.value ?? null,
    } satisfies PlayerListRow];
  });
}

function searchValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value !== "" ? value : fallback;
}

export function PlayersPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate();
  const equipo = searchValue(location.search.equipo, "todos");
  const posicion = searchValue(location.search.posicion, "todas");
  const allRows = playerListRows();
  const rows = allRows.filter(
    (row) =>
      (equipo === "todos" || row.teamName === equipo) &&
      (posicion === "todas" || row.position === posicion),
  );

  const equipoFilters = [
    { label: "Todos los equipos", value: "todos" },
    ...[...new Set(allRows.map((row) => row.teamName))].map((name) => ({ label: name, value: name })),
  ];
  const posicionFilters = [
    { label: "Todas las posiciones", value: "todas" },
    ...[...new Set(allRows.map((row) => row.position))].map((name) => ({ label: name, value: name })),
  ];

  const columns: DataTableColumn<PlayerListRow>[] = [
    {
      header: "Jugador",
      key: "fullName",
      render: (row) => (
        // Design: `tbody tr[onclick]` opens the player card; an anchor carries the same
        // destination with link semantics.
        <Link
          className="font-bold text-vt-text hover:text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/players/${row.id}` as string}
        >
          {row.fullName} #{row.number}
        </Link>
      ),
    },
    {
      header: "Equipo",
      key: "teamName",
      render: (row) => (
        <Link
          className="text-vt-muted hover:text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/teams/${row.teamId}` as string}
        >
          {row.teamName}
        </Link>
      ),
    },
    { header: "Posición", key: "position" },
    { header: "Altura", key: "heightLabel", render: (row) => row.heightLabel ?? "—" },
    { header: "Pts", key: "points", numeric: true, render: (row) => row.points ?? "—" },
    {
      header: "Ficha",
      key: "id",
      render: (row) => (
        <Link
          aria-label={`Ver ficha de ${row.fullName}`}
          className="font-bold text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/players/${row.id}` as string}
        >
          Ver ficha →
        </Link>
      ),
    },
  ];

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="players-page-content">
        {/* Design: voleytrack-jugadores.html:44 — `.page-head` h1 "Jugadores" and its line. */}
        <PageHeader
          className="mb-[22px]"
          description="Jugadores con perfil público, su equipo y su posición en cancha."
          title="Jugadores"
        />

        <FilterGroup aria-label="Filtrar jugadores por equipo">
          {equipoFilters.map((filter) => (
            <Filter
              isActive={equipo === filter.value}
              key={filter.value}
              onClick={() =>
                navigate({ to: ".", search: (current) => ({ ...current, equipo: filter.value }) })
              }
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        <FilterGroup aria-label="Filtrar jugadores por posición">
          {posicionFilters.map((filter) => (
            <Filter
              isActive={posicion === filter.value}
              key={filter.value}
              onClick={() =>
                navigate({ to: ".", search: (current) => ({ ...current, posicion: filter.value }) })
              }
            >
              {filter.label}
            </Filter>
          ))}
        </FilterGroup>

        {/* Design: voleytrack-jugadores.css:12-14 (.player-results-count). */}
        <p
          aria-live="polite"
          className="mb-4 font-mono text-[11px] font-bold text-vt-muted"
          data-testid="players-results-count"
        >
          <strong className="text-vt-text">{rows.length}</strong>{" "}
          {rows.length === 1 ? "jugador" : "jugadores"}
        </p>

        {rows.length === 0 ? (
          /* Design: voleytrack-jugadores.css:15-19 (.player-empty) and its copy at
             voleytrack-jugadores.html:60. */
          <Card padded={false}>
            <EmptyState
              description="Prueba a reducir los filtros o límpialos para ver todos los jugadores."
              title="No hay jugadores que coincidan"
            />
          </Card>
        ) : (
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
