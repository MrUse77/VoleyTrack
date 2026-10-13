import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardBody } from "../../components/primitives/Card";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { EmptyState } from "../../components/primitives/EmptyState";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StatePill, type MatchStatus as PillStatus } from "../../components/primitives/StatePill";
import { ADMIN, type MatchStatus } from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-admin-partidos.html — the `.page-head` ("Partidos")
 * with a `Filtros` toggle and the accent "Crear partido" link, the collapsible `.card` filter
 * panel (Torneo | Equipo | Estado, the `#matches-count` line and "Limpiar filtros"), and the
 * `.match-list` of `.match-card`s: a bold "Local vs Visitante" title, the
 * `Torneo · fecha` meta, the `.match-source` eyebrow and a `.state-pill`. An empty result
 * swaps the list for the design's `#matches-empty` status card.
 *
 * The design's prototype labels its own rows "Datos de referencia" and locally created ones
 * "Creado en administración"; this screen only has fixture rows, so the source eyebrow reads
 * the fixture label. PROTOTYPE DATA — NOT REAL: that label must be replaced by a real origin
 * once matches are created through the real backend.
 */
const pillStatusByFixtureStatus: Record<MatchStatus, PillStatus> = {
  live: "envivo",
  today: "programado",
  upcoming: "programado",
  finished: "finalizado",
};

const statusWordByFixtureStatus: Record<MatchStatus, string> = {
  live: "En vivo",
  today: "Programado",
  upcoming: "Programado",
  finished: "Finalizado",
};

const sourceLabel = "Datos de referencia";
const allTournaments = "todos";
const allTeams = "todos";
const allStatuses = "todos";

export function AdminMatchesPage() {
  const matches = ADMIN.matches;
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tournamentId, setTournamentId] = useState(allTournaments);
  const [teamId, setTeamId] = useState(allTeams);
  const [status, setStatus] = useState(allStatuses);

  const visibleMatches = matches.filter(
    (match) =>
      (tournamentId === allTournaments || match.tournamentId === tournamentId) &&
      (teamId === allTeams || match.homeTeamId === teamId || match.awayTeamId === teamId) &&
      (status === allStatuses || match.status === status),
  );

  const statusOptions = [...new Set(matches.map((match) => match.status))];

  return (
    <div>
      <PageHeader
        actions={
          <>
            <button
              aria-controls="matches-filter-panel"
              aria-expanded={isFilterOpen}
              className={buttonClasses("surface")}
              onClick={() => setIsFilterOpen((current) => !current)}
              type="button"
            >
              Filtros
            </button>
            <Link className={buttonClasses("primary")} to={"/admin/matches/create" as string}>
              Crear partido
            </Link>
          </>
        }
        className="mb-[22px]"
        description="Consulta la programación y gestiona los partidos creados."
        title="Partidos"
      />

      {/* Design: `#matches-filter-panel` is a `.card.match-filters` (16px below) that starts
          `hidden` and is toggled by `#matches-filter-button` through `aria-expanded`; it stays
          in the DOM so `aria-controls` always resolves. */}
      <Card className="mb-4" hidden={!isFilterOpen} id="matches-filter-panel" padded={false}>
        <CardBody data-testid="matches-filter-card-body">
          {/* Design: the filter panel uses the same `.form-grid` as every other admin form
              (voleytrack-admin.css:175) — two columns, so the third select wraps onto the next
              row exactly as the design renders it. */}
          <div className="grid gap-[18px] min-[901px]:grid-cols-2">
            <Field id="filter-tournament" label="Torneo">
              <select
                className={fieldControlClasses}
                onChange={(event) => setTournamentId(event.target.value)}
                value={tournamentId}
              >
                <option value={allTournaments}>Todos los torneos</option>
                {ADMIN.tournaments.map((tournament) => (
                  <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                ))}
              </select>
            </Field>
            <Field id="filter-team" label="Equipo">
              <select
                className={fieldControlClasses}
                onChange={(event) => setTeamId(event.target.value)}
                value={teamId}
              >
                <option value={allTeams}>Todos los equipos</option>
                {ADMIN.teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </Field>
            <Field id="filter-status" label="Estado">
              <select
                className={fieldControlClasses}
                onChange={(event) => setStatus(event.target.value)}
                value={status}
              >
                <option value={allStatuses}>Todos los estados</option>
                {statusOptions.map((value) => (
                  <option key={value} value={value}>{statusWordByFixtureStatus[value]}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="m-0 text-[12px] text-vt-muted">
              {visibleMatches.length} {visibleMatches.length === 1 ? "partido" : "partidos"}
            </p>
            <button
              className={buttonClasses("ghost")}
              onClick={() => {
                setTournamentId(allTournaments);
                setTeamId(allTeams);
                setStatus(allStatuses);
              }}
              type="button"
            >
              Limpiar filtros
            </button>
          </div>
        </CardBody>
      </Card>

      {visibleMatches.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            description="Cambia los filtros o crea un nuevo partido."
            title="No hay partidos para mostrar"
          />
        </Card>
      ) : (
        /* Design: voleytrack-admin.css:197-198 `.match-list` is a 12px-gap grid of
           `.match-card`s, each a `minmax(0,1fr) auto auto` row at an 18px gap with
           `padding:16px 18px`, a 1px --border edge and a 14px radius; below 700px the card
           collapses to one column at an 8px gap. */
        <ul className="grid list-none gap-3 p-0">
          {visibleMatches.map((match) => (
            <li key={match.id}>
              <article className="grid gap-2 rounded-[14px] border border-vt-border bg-vt-surface px-[18px] py-4 min-[701px]:grid-cols-[minmax(0,1fr)_auto_auto] min-[701px]:items-center min-[701px]:gap-[18px]">
                <div className="min-w-0">
                  {/* The design's `.match-card h2` is 15px at line-height 1.3 and keeps the
                      heading's default weight, which Tailwind's preflight resets to 400, so
                      the weight is restated. */}
                  <h2 className="m-0 text-[15px] font-bold leading-[1.3] text-vt-text">
                    {match.homeTeamName} vs {match.awayTeamName}
                  </h2>
                  <p className="mb-0 mt-1 text-[12px] text-vt-muted">
                    {match.tournamentName} · {match.scheduledLabel}
                  </p>
                </div>
                <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.06em] text-vt-muted-2">
                  {sourceLabel}
                </span>
                <StatePill status={pillStatusByFixtureStatus[match.status]} />
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
