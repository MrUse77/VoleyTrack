import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody } from "../../components/primitives/Card";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN } from "../../fixtures";
import { teamListExtras } from "../public/teamList";

/**
 * Design: frontend/design/html/voleytrack-admin-equipos.html — the `teams` view is a
 * `.page-head` ("Equipos") whose actions are a `Filtros` toggle and the accent
 * "Crear equipo" link, a collapsible `.card` filter panel (`#teams-filter-panel`: a
 * "Buscar por nombre" search, a "Torneo" select, the `#team-results-count` aria-live line and
 * "Limpiar filtros"), and a `.table-wrap` whose columns are `Equipo | Torneo | Jugadores |
 * PG / PP` (its `PG / PP` header is marked `.num`). An empty result swaps the table for the
 * design's `#teams-empty-state` status card.
 *
 * Three departures from the prototype, each forced by the data rather than chosen:
 * 1. The design's rows are `tr[onclick]`; an anchor is the same destination with link
 *    semantics instead of a click handler on a row, which is the call the public teams list
 *    already made.
 * 2. The design's row actions do not exist: its row IS the link to the team detail, so the
 *    app's hand-rolled `Ver` / `Editar` / `Borrar` buttons and their view-local removal are
 *    gone. Editing has a real destination (the detail's "Editar equipo" action), which is the
 *    design's own entry point for it.
 * 3. The design's "Torneo" filter and its two derived columns read `teamListExtras`; when no
 *    admin team row carries a tournament, the select is not rendered at all rather than
 *    shipped as a control whose only option is the current value.
 *
 * Fixture gap, not a design choice: `ADMIN.teams` carries no tournament assignment and no
 * record, so both columns print an em dash until the fixture gains them (see
 * `src/fixtures/admin.ts`).
 */
type AdminTeamRow = Readonly<{
  id: string;
  name: string;
  city: string;
  tournamentName: string | null;
  playerCount: number;
  record: string | null;
}>;

function adminTeamRows(): readonly AdminTeamRow[] {
  return ADMIN.teams.map((team) => ({
    id: team.id,
    name: team.name,
    city: team.city,
    playerCount: team.playerCount,
    ...teamListExtras(team.id, team.name),
  }));
}

/** The design's own `normalizeSearch`: strip accents, lower-case, trim. */
function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-ES")
    .trim();
}

const allTournaments = "";

export function AdminTeamsPage() {
  const rows = adminTeamRows();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [nameQuery, setNameQuery] = useState("");
  const [tournament, setTournament] = useState(allTournaments);

  const tournamentOptions = [
    ...new Set(rows.flatMap((row) => (row.tournamentName ? [row.tournamentName] : []))),
  ];
  const normalizedQuery = normalizeSearch(nameQuery);
  const visibleRows = rows.filter(
    (row) =>
      (!normalizedQuery || normalizeSearch(row.name).includes(normalizedQuery)) &&
      (tournament === allTournaments || row.tournamentName === tournament),
  );

  const columns: DataTableColumn<AdminTeamRow>[] = [
    {
      header: "Equipo",
      key: "name",
      render: (row) => (
        <Link
          className="font-bold text-vt-text hover:text-vt-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          to={`/admin/teams/${row.id}` as string}
        >
          {row.name}
          {/* Design: the cell is `<b>Name</b> <small>· SJ</small>`; the app's fixture stores
              the full city name, so abbreviating it would drop information. */}
          <small className="font-normal text-vt-muted"> · {row.city}</small>
        </Link>
      ),
    },
    { header: "Torneo", key: "tournamentName", render: (row) => row.tournamentName ?? "—" },
    { header: "Jugadores", key: "playerCount" },
    { header: "PG / PP", key: "record", numeric: true, render: (row) => row.record ?? "—" },
  ];

  return (
    <div>
      <PageHeader
        actions={
          <>
            <button
              aria-controls="teams-filter-panel"
              aria-expanded={isFilterOpen}
              className={buttonClasses("surface")}
              onClick={() => setIsFilterOpen((current) => !current)}
              type="button"
            >
              Filtros
            </button>
            <Link className={buttonClasses("primary")} to={"/admin/teams/create" as string}>
              Crear equipo
            </Link>
          </>
        }
        className="mb-[22px]"
        description="Listado de equipos. Seleccioná un equipo para ver su detalle."
        title="Equipos"
      />

      {/* Design: `#teams-filter-panel` is a `.card` that starts `hidden` and is toggled by
          `#teams-filter-button` through `aria-expanded`; it stays in the DOM so
          `aria-controls` always resolves. */}
      <Card
        aria-label="Filtros del listado de equipos"
        className="mb-4"
        hidden={!isFilterOpen}
        id="teams-filter-panel"
        padded={false}
      >
        <CardBody data-testid="teams-filter-card-body">
          {/* Design: the filter panel uses the same `.form-grid` as every other admin form
              (voleytrack-admin.css:175) — two columns. */}
          <div className="grid gap-[18px] min-[901px]:grid-cols-2">
            <Field id="team-name-filter" label="Buscar por nombre">
              <input
                autoComplete="off"
                className={fieldControlClasses}
                onChange={(event) => setNameQuery(event.target.value)}
                placeholder="Ej.: Ciudad Vóley"
                type="search"
                value={nameQuery}
              />
            </Field>
            {tournamentOptions.length > 0 ? (
              <Field id="team-tournament-filter" label="Torneo">
                <select
                  className={fieldControlClasses}
                  onChange={(event) => setTournament(event.target.value)}
                  value={tournament}
                >
                  <option value={allTournaments}>Todos los torneos</option>
                  {tournamentOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p
              aria-live="polite"
              className="m-0 text-[12px] text-vt-muted"
              id="team-results-count"
            >
              {visibleRows.length} {visibleRows.length === 1 ? "equipo" : "equipos"}
            </p>
            <Button
              onClick={() => {
                setNameQuery("");
                setTournament(allTournaments);
              }}
              variant="ghost"
            >
              Limpiar filtros
            </Button>
          </div>
        </CardBody>
      </Card>

      {visibleRows.length === 0 ? (
        <Card padded={false}>
          {/* Design: `#teams-empty-state` copy, word for word. */}
          <EmptyState
            description="Prueba con otro nombre o seleccioná un torneo diferente."
            title="No se encontraron equipos"
          />
        </Card>
      ) : (
        <section aria-label="Listado de equipos">
          <DataTable
            columns={columns}
            getRowKey={(row) => row.id}
            rows={[...visibleRows]}
          />
        </section>
      )}
    </div>
  );
}
