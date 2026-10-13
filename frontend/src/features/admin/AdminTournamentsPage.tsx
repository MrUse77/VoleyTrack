import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "../../components/primitives/Badge";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminTournamentFixture } from "../../fixtures";
import { badgeVariantByStatus } from "../public/tournamentTabs";

/**
 * Design: frontend/design/html/voleytrack-admin-torneos.html — the `tournaments` view is a
 * `.page-head` ("Torneos") whose actions are a `Filtros` toggle and the accent "Crear torneo"
 * link, a collapsible `.card` filter panel (`Tipo` and `Estado` selects, the
 * `#tournaments-results-count` aria-live line and "Limpiar filtros"), and the `.cards-grid`
 * (three columns, two below 1200px, one below 720px, voleytrack-admin.css:109-111) of
 * `a.card.clickable.tournament-card`s: a mono uppercase `TIPO · ESTADO` eyebrow, the name, a
 * `equipos · partidos · fechas` line and a badge row. An empty result swaps the grid for the
 * design's `#tournaments-empty-state` status card.
 *
 * Three departures from the prototype, each forced by the data rather than chosen:
 * 1. The design's `#tournaments-future-card` ("Z.18 BRACKET — FUTURO", "Diseño exploratorio,
 *    no en V1") is not rendered: it is the prototype's own note that the card is out of scope.
 * 2. The design's row actions do not exist — its card IS the link to the tournament detail, so
 *    the app's hand-rolled `Ver` / `Editar` / `Borrar` buttons and their view-local removal are
 *    gone. Editing now has a real destination (the detail's "Editar torneo" action), which is
 *    the design's own entry point for it.
 * 3. The design's meta line ends in "Finaliza 12 dic"; the app's fixture carries a prose date
 *    range ("Marzo a julio de 2026"), so the third segment is that range instead of a date the
 *    fixture does not have.
 *
 * PROTOTYPE DATA — NOT REAL: the `matchesLabel` / `teamsLabel` figures the meta line and the
 * second badge print are the design's own card numbers written as fixed labels (see
 * `src/fixtures/admin.ts`). They must be replaced by real counts.
 */
const allTypes = "todos";
const allStatuses = "todos";

function tournamentCard(tournament: AdminTournamentFixture) {
  return (
    <li key={tournament.id}>
      <Link
        aria-label={`Ver detalle de ${tournament.name}`}
        className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
        data-testid="admin-tournament-card"
        to={`/admin/tournaments/${tournament.id}` as string}
      >
        <Card
          className="h-full transition group-hover:-translate-y-0.5 group-hover:border-vt-accent group-hover:shadow-lg motion-reduce:transition-none"
          padded={false}
        >
          <CardBody data-testid="admin-tournament-card-body">
            <small className="font-mono text-[10px] font-extrabold tracking-[0.08em] text-vt-muted uppercase">
              {tournament.detail.typeLabel} · {tournament.statusLabel}
            </small>
            <h3 className="mt-2 mb-1.5 text-[16px] font-bold text-vt-text group-hover:text-vt-accent">
              {tournament.name}
            </h3>
            <p className="text-[13px] text-vt-muted">
              {tournament.teamsLabel} · {tournament.matchesLabel} · {tournament.dateLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={badgeVariantByStatus[tournament.status]}>
                {tournament.statusLabel}
              </Badge>
              <Badge>{tournament.matchesLabel}</Badge>
            </div>
          </CardBody>
        </Card>
      </Link>
    </li>
  );
}

export function AdminTournamentsPage() {
  const tournaments = ADMIN.tournaments;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [type, setType] = useState<string>(allTypes);
  const [status, setStatus] = useState<string>(allStatuses);

  const visibleTournaments = tournaments.filter(
    (tournament) =>
      (type === allTypes || tournament.detail.typeLabel === type) &&
      (status === allStatuses || tournament.statusLabel === status),
  );

  const typeOptions = [...new Set(tournaments.map((tournament) => tournament.detail.typeLabel))];
  const statusOptions = [...new Set(tournaments.map((tournament) => tournament.statusLabel))];

  return (
    <div>
      <PageHeader
          actions={
            <>
              <button
                aria-controls="tournaments-filter-panel"
                aria-expanded={isFilterOpen}
                className={buttonClasses("surface")}
                onClick={() => setIsFilterOpen((current) => !current)}
                type="button"
              >
                Filtros
              </button>
              <Link className={buttonClasses("primary")} to={"/admin/tournaments/create" as string}>
                Crear torneo
              </Link>
            </>
          }
          className="mb-[22px]"
          description="Administrá y consultá los torneos registrados."
          title="Torneos"
        />

        {/* Design: `#tournaments-filter-panel` is a `.card` (16px below, `match-filters` in
            the matches screen) that starts `hidden` and is toggled by
            `#tournaments-filter-button` through `aria-expanded`; it stays in the DOM so
            `aria-controls` always resolves. */}
        <Card className="mb-4" hidden={!isFilterOpen} id="tournaments-filter-panel" padded={false}>
          <CardBody data-testid="tournaments-filter-card-body">
            {/* Design: the filter panel uses the same `.form-grid` as every other admin form
                (voleytrack-admin.css:175) — two columns. */}
            <div className="grid gap-[18px] min-[901px]:grid-cols-2">
              <Field id="tournaments-type-filter" label="Tipo">
                <select
                  className={fieldControlClasses}
                  onChange={(event) => setType(event.target.value)}
                  value={type}
                >
                  <option value={allTypes}>Todos los tipos</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
              <Field id="tournaments-status-filter" label="Estado">
                <select
                  className={fieldControlClasses}
                  onChange={(event) => setStatus(event.target.value)}
                  value={status}
                >
                  <option value={allStatuses}>Todos los estados</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="m-0 text-[12px] text-vt-muted" id="tournaments-results-count">
                {visibleTournaments.length} {visibleTournaments.length === 1 ? "torneo" : "torneos"}
              </p>
              <Button
                onClick={() => {
                  setType(allTypes);
                  setStatus(allStatuses);
                }}
                variant="ghost"
              >
                Limpiar filtros
              </Button>
            </div>
          </CardBody>
        </Card>

        {visibleTournaments.length === 0 ? (
          <Card padded={false}>
            {/* Design: `#tournaments-empty-state` copy, word for word. */}
            <EmptyState
              description="Prueba con otro tipo o estado."
              title="No se encontraron torneos"
            />
          </Card>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-4 p-0 min-[721px]:grid-cols-2 min-[1201px]:grid-cols-3">
            {visibleTournaments.map(tournamentCard)}
          </ul>
        )}
    </div>
  );
}
