import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { useState } from "react";
import { Avatar } from "../../components/primitives/Avatar";
import { Card, CardBody } from "../../components/primitives/Card";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, PUBLIC_PLAYER_DETAILS } from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-admin-jugadores.html — the `players` view is a
 * `.page-head` ("Jugadores") whose actions are a `Filtros` toggle and the accent
 * "Crear jugador" link, a collapsible `.card` filter panel (`Equipo` and `Posición`
 * selects, the `#players-results-count` line and "Limpiar filtros"), and a `.table-wrap`
 * whose columns are Jugador | Equipo | Posición | Altura | Pts (`.num`) | Acción, with
 * "Ver ficha →" as the row action. An empty result swaps the table for the design's
 * `#players-empty-state` status card.
 *
 * The design's prototype rows are men's-league players with an avatar, height and points.
 * The app's two admin players have public profiles, so `Altura` and `Pts` are derived from
 * the same `PUBLIC_PLAYER_DETAILS` projection the public players list uses, and are printed
 * as an em dash rather than invented when a player has no public detail. The design's
 * thumbnail is the identity disc next to the name, which is the `Avatar` primitive.
 */
type PlayerListRow = Readonly<{
  heightLabel: string | null;
  id: string;
  initials: string;
  nameWithNumber: string;
  points: string | null;
  position: string;
  teamName: string;
}>;

/** The design's `.p-cell b` prints "Surname, M."; the disc beside it needs the initials. */
function initialsOf(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join("");
}

function playerListRows(): readonly PlayerListRow[] {
  return ADMIN.players.map((player) => {
    const detail = PUBLIC_PLAYER_DETAILS.find((item) => item.playerId === player.id);

    return {
      heightLabel: detail?.heightLabel ?? null,
      id: player.id,
      initials: initialsOf(player.fullName),
      nameWithNumber: `${player.fullName} #${player.number}`,
      points: detail?.kpis.find((kpi) => kpi.label === "Puntos")?.value ?? null,
      position: player.position,
      teamName: player.teamName,
    } satisfies PlayerListRow;
  });
}

const allTeams = "todos";
const allPositions = "todas";

export function AdminPlayersPage() {
  const rows = playerListRows();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [team, setTeam] = useState(allTeams);
  const [position, setPosition] = useState(allPositions);

  const visibleRows = rows.filter(
    (row) =>
      (team === allTeams || row.teamName === team) &&
      (position === allPositions || row.position === position),
  );

  const teamOptions = [...new Set(rows.map((row) => row.teamName))];
  const positionOptions = [...new Set(rows.map((row) => row.position))];

  const columns: DataTableColumn<PlayerListRow>[] = [
    {
      header: "Jugador",
      key: "nameWithNumber",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar initials={row.initials} />
          <Link
            className="font-bold text-vt-text hover:text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            to={`/players/${row.id}` as string}
          >
            {row.nameWithNumber}
          </Link>
        </div>
      ),
    },
    { header: "Equipo", key: "teamName" },
    { header: "Posición", key: "position" },
    { header: "Altura", key: "heightLabel", render: (row) => row.heightLabel ?? "—" },
    { header: "Pts", key: "points", numeric: true, render: (row) => row.points ?? "—" },
    {
      header: "Acciones",
      key: "id",
      render: (row) => (
        <Link
          aria-label={`Ver ficha de ${row.nameWithNumber}`}
          className="whitespace-nowrap text-[12px] font-bold text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/players/${row.id}` as string}
        >
          Ver ficha →
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        className="mb-[22px]"
        actions={
          <>
            <button
              aria-controls="players-filter-panel"
              aria-expanded={isFilterOpen}
              className={buttonClasses("surface")}
              onClick={() => setIsFilterOpen((current) => !current)}
              type="button"
            >
              Filtros
            </button>
            <Link className={buttonClasses("primary")} to={"/admin/players/create" as string}>
              Crear jugador
            </Link>
          </>
        }
        description="Jugadores registrados, con su equipo, posición, altura y puntos."
        title="Jugadores"
      />

      {/* Design: voleytrack-admin-jugadores.html — `#players-filter-panel` is a `.card`
          (`.card-b` padding) that starts `hidden` and is toggled by `#players-filter-button`
          through `aria-expanded`; it stays in the DOM so `aria-controls` always resolves. */}
      <Card className="mb-4" hidden={!isFilterOpen} id="players-filter-panel" padded={false}>
        <CardBody data-testid="players-filter-card-body">
          <div className="grid gap-[18px] min-[901px]:grid-cols-2">
            <Field id="players-team-filter" label="Equipo">
              <select
                className={fieldControlClasses}
                onChange={(event) => setTeam(event.target.value)}
                value={team}
              >
                <option value={allTeams}>Todos los equipos</option>
                {teamOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </Field>
            <Field id="players-position-filter" label="Posición">
              <select
                className={fieldControlClasses}
                onChange={(event) => setPosition(event.target.value)}
                value={position}
              >
                <option value={allPositions}>Todas las posiciones</option>
                {positionOptions.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="m-0 text-[12px] text-vt-muted">
              {visibleRows.length} {visibleRows.length === 1 ? "jugador" : "jugadores"}
            </p>
            <button
              className={buttonClasses("ghost")}
              onClick={() => {
                setTeam(allTeams);
                setPosition(allPositions);
              }}
              type="button"
            >
              Limpiar filtros
            </button>
          </div>
        </CardBody>
      </Card>

      {visibleRows.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            description="Prueba con otro equipo o una posición diferente."
            title="No se encontraron jugadores"
          />
        </Card>
      ) : (
        <section aria-label="Listado de jugadores">
          <DataTable columns={columns} getRowKey={(row) => row.id} rows={[...visibleRows]} />
        </section>
      )}
    </div>
  );
}
