import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { PageHeader } from "../../components/primitives/PageHeader";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { findAdminTournament } from "./adminTournamentLookup";
import { TournamentFormCard } from "./TournamentFormCard";
import type { TournamentFormValues } from "./tournamentFormValues";

/**
 * The admin tournament's edit screen.
 *
 * Design: frontend/design/html/voleytrack-admin-editar-torneo.html — a `.page-head` ("Editar
 * torneo" over "Modificar los datos del torneo <b>…</b> · Temporada …" with a `Volver` ghost
 * action that returns to the tournament detail) above the same `.form-grid` the create screen
 * renders, whose card eyebrow reads `FORMULARIO` and whose actions are Cancelar / "Guardar
 * cambios".
 *
 * Only the values the fixture genuinely carries are pre-filled: the name, the status word and
 * the team count. The fixture's date is a prose range ("Marzo a julio de 2026"), not a season
 * or an ISO date, and it carries no competition system, so Temporada, Sistema de competencia,
 * both dates and Descripción open empty with an explicit placeholder rather than a value parsed
 * out of a sentence. PROTOTYPE VALUE — NOT REAL: the pre-filled team count comes from the
 * design's own `teamsLabel` card figure (see `src/fixtures/admin.ts`) and must be replaced by a
 * real registration count.
 */
function initialValuesFor(teamsLabel: string, name: string, statusLabel: string): TournamentFormValues {
  const teamCount = Number.parseInt(teamsLabel, 10);

  return {
    competitionSystem: "",
    description: "",
    endDate: "",
    name,
    season: "",
    startDate: "",
    status: statusLabel,
    teamCount: Number.isFinite(teamCount) ? String(teamCount) : "",
  };
}

export function AdminTournamentEditPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  return (
    <div>
      <PageHeader
        actions={
          <Link className={buttonClasses("ghost")} to={`/admin/tournaments/${tournament.id}` as string}>
            <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        }
        className="mb-[22px]"
        description={`Modificar los datos del torneo ${tournament.name} · ${tournament.dateLabel}`}
        title="Editar torneo"
      />

      <TournamentFormCard
        cancelTo={`/admin/tournaments/${tournament.id}`}
        eyebrow="FORMULARIO"
        initialValues={initialValuesFor(tournament.teamsLabel, tournament.name, tournament.statusLabel)}
        statusText="Cambios preparados localmente. No se enviaron datos al servidor."
        submitLabel="Guardar cambios"
      />
    </div>
  );
}
