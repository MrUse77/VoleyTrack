import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { PageHeader } from "../../components/primitives/PageHeader";
import { TournamentFormCard } from "./TournamentFormCard";
import { emptyTournamentForm } from "./tournamentFormValues";

/**
 * Design: frontend/design/html/voleytrack-admin-nuevo-torneo.html — a `.page-head`
 * ("Nuevo torneo" with "Crear un torneo nuevo y configurar su sistema de competencia." and a
 * `Volver` ghost action) over the shared tournament form card, whose eyebrow reads `NUEVO`.
 *
 * Two deliberate differences from the prototype:
 * 1. The prototype's "volver" and "cancelar" both leave for the management screen, and its
 *    "crear torneo" link leaves for that same screen without submitting anything. Here
 *    Cancelar returns to the tournaments list — the screen this form belongs to — and
 *    "Crear torneo" is a real submit button.
 * 2. The prototype's Cantidad de equipos starts at 16 and its Estado at Programado. The app's
 *    form starts empty, which is the behaviour its test pins.
 */
export function CreateTournamentPage() {
  return (
    <div>
      <PageHeader
        actions={
          <Link className={buttonClasses("ghost")} to={"/admin/tournaments" as string}>
            <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        }
        className="mb-[22px]"
        description="Crear un torneo nuevo y configurar su sistema de competencia."
        title="Nuevo torneo"
      />

      <TournamentFormCard
        cancelTo="/admin/tournaments"
        eyebrow="NUEVO"
        initialValues={emptyTournamentForm}
        statusText="Torneo preparado localmente. No se enviaron datos al servidor."
        submitLabel="Crear torneo"
      />
    </div>
  );
}
