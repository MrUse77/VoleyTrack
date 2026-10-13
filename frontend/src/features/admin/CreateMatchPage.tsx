import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN } from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-admin-crear-partido.html — a `.page-head`
 * ("Crear partido") over the `.form-card`: a `.card-h` reading "Datos del partido" with the
 * `Estado automático: Programado` eyebrow, then the form's `.card-b` holding the
 * `.form-grid` (Torneo full width, Equipo local | Equipo visitante, the `.team-summary`
 * confirmation, Fecha | Horario disponible) and the `.form-actions` row.
 *
 * The design's choreography is kept: the team selects unlock once a tournament is chosen,
 * the date unlocks once two different teams are chosen, and the slot select unlocks once a
 * date is chosen. The design's "Horario disponible" options are the prototype's three slots;
 * UNBUILT — the design filters them against the matches already scheduled for that
 * tournament and date, and the app's admin match fixture carries no machine-readable
 * schedule (its single live match's label is the set clock "Set 3 · 18:42"), so the
 * availability rule has no data to run against and the three slots are offered as-is rather
 * than filtered by an invented calendar.
 */
type MatchForm = {
  awayTeamId: string;
  date: string;
  homeTeamId: string;
  time: string;
  tournamentId: string;
};

type MatchField = keyof MatchForm;
type MatchErrors = Partial<Record<MatchField, string>>;

const initialForm: MatchForm = {
  awayTeamId: "",
  date: "",
  homeTeamId: "",
  time: "",
  tournamentId: "",
};

const fieldIds: Record<MatchField, string> = {
  awayTeamId: "match-away-team",
  date: "match-date",
  homeTeamId: "match-home-team",
  time: "match-time",
  tournamentId: "match-tournament",
};

/** The design's prototype slots (`const slots=['18:00','19:30','21:00']`). */
const availableSlots = ["18:00", "19:30", "21:00"] as const;

/** The design builds its `min` from the local date parts, not from a UTC timestamp. */
function todayIsoDate(): string {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

/**
 * `Field` renders an optional hint and an optional error as two separate slots, so a field
 * with both has to choose one: passing both would put two ids in `aria-describedby`. The
 * error keeps its `role="alert"` wrapper, and `Field` derives `aria-invalid` from `error`
 * being present.
 */
function feedbackProps(error: string | undefined, hint?: string): { error?: ReactNode; hint?: ReactNode } {
  if (error) return { error: <span role="alert">{error}</span> };
  return hint ? { hint } : {};
}

export function CreateMatchPage() {
  const [form, setForm] = useState<MatchForm>(initialForm);
  const [errors, setErrors] = useState<MatchErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const tournament = ADMIN.tournaments.find((item) => item.id === form.tournamentId) ?? null;
  const homeTeam = ADMIN.teams.find((team) => team.id === form.homeTeamId) ?? null;
  const awayTeam = ADMIN.teams.find((team) => team.id === form.awayTeamId) ?? null;
  const teamsReady = Boolean(homeTeam && awayTeam && homeTeam.id !== awayTeam.id);

  const clearError = (field: MatchField) => {
    setErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const updateField = <Field extends MatchField>(field: Field, value: MatchForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    clearError(field);
    setIsSubmitted(false);
  };

  const handleTournamentChange = (value: string) => {
    // Design: choosing a tournament clears both team selects and the whole schedule.
    setForm((current) => ({ ...current, tournamentId: value, homeTeamId: "", awayTeamId: "", date: "", time: "" }));
    setErrors({});
    setIsSubmitted(false);
  };

  const handleTeamChange = (field: "homeTeamId" | "awayTeamId", value: string) => {
    setForm((current) => ({ ...current, [field]: value, date: "", time: "" }));
    clearError(field);
    clearError("awayTeamId");
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: MatchErrors = {};

    if (form.homeTeamId && form.homeTeamId === form.awayTeamId) {
      nextErrors.awayTeamId = "Un equipo no puede jugar contra sí mismo";
    }

    if (!form.tournamentId) nextErrors.tournamentId = "Seleccioná un torneo.";
    if (!form.homeTeamId) nextErrors.homeTeamId = "Seleccioná el equipo local.";
    if (!form.awayTeamId) nextErrors.awayTeamId = "Seleccioná el equipo visitante.";
    if (!form.date) {
      nextErrors.date = "Seleccioná la fecha del encuentro.";
    } else if (form.date < todayIsoDate()) {
      nextErrors.date = "Selecciona una fecha válida a partir de hoy.";
    }
    if (!form.time) nextErrors.time = "Seleccioná un horario disponible.";

    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as MatchField[])[0];
    if (firstInvalidField) {
      setIsSubmitted(false);
      event.currentTarget.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div>
      <PageHeader
        className="mb-[22px]"
        description="Programá un encuentro entre dos equipos activos."
        title="Crear partido"
      />

      <Card className="max-w-[760px]" padded={false}>
        <CardHeader>
          Datos del partido
          <small>Estado automático: Programado</small>
        </CardHeader>
        <CardBody data-testid="create-match-card-body">
          <form className="grid gap-[18px]" noValidate onSubmit={handleSubmit}>
            {isSubmitted ? (
              <p
                aria-live="polite"
                className="rounded-vt-md border border-vt-success-soft-border bg-vt-success-soft px-[14px] py-3 text-[13px] font-bold text-vt-success-soft-text"
                role="status"
                tabIndex={-1}
              >
                Partido preparado localmente. No se enviaron datos al servidor.
              </p>
            ) : null}

            <div className="grid gap-[18px] min-[901px]:grid-cols-2">
              <Field
                full
                id={fieldIds.tournamentId}
                label="Torneo"
                {...feedbackProps(errors.tournamentId)}
              >
                <select
                  className={fieldControlClasses}
                  name="tournamentId"
                  onChange={(event) => handleTournamentChange(event.target.value)}
                  required
                  value={form.tournamentId}
                >
                  <option value="">Seleccionar torneo</option>
                  {ADMIN.tournaments.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </Field>

              <Field
                id={fieldIds.homeTeamId}
                label="Equipo local"
                {...feedbackProps(errors.homeTeamId)}
              >
                <select
                  className={fieldControlClasses}
                  disabled={!tournament}
                  name="homeTeamId"
                  onChange={(event) => handleTeamChange("homeTeamId", event.target.value)}
                  required
                  value={form.homeTeamId}
                >
                  <option value="">Seleccionar equipo local</option>
                  {ADMIN.teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </Field>
              <Field
                id={fieldIds.awayTeamId}
                label="Equipo visitante"
                {...feedbackProps(errors.awayTeamId)}
              >
                <select
                  className={fieldControlClasses}
                  disabled={!tournament}
                  name="awayTeamId"
                  onChange={(event) => handleTeamChange("awayTeamId", event.target.value)}
                  required
                  value={form.awayTeamId}
                >
                  <option value="">Seleccionar equipo visitante</option>
                  {ADMIN.teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </Field>

              {/* Design: `.team-summary` — two `--border-2` tiles on the canvas fill that
                  confirm the pairing before the schedule unlocks. */}
              <div
                aria-live="polite"
                className="col-span-full grid gap-3 min-[701px]:grid-cols-2"
                data-testid="selected-teams-summary"
                hidden={!teamsReady}
              >
                {([["Local", homeTeam], ["Visitante", awayTeam]] as const).map(([role, team]) => (
                  <div className="rounded-vt-md border border-vt-border-2 bg-vt-background p-[14px]" key={role}>
                    <small className="mb-1 block font-mono text-[9px] font-extrabold uppercase tracking-[0.07em] text-vt-muted">
                      {role}
                    </small>
                    <b className="text-[13px] font-bold text-vt-text">{team?.name}</b>
                    <span className="mt-0.5 block text-[11px] text-vt-success-soft-text">{team?.statusLabel}</span>
                  </div>
                ))}
              </div>

              <Field
                id={fieldIds.date}
                label="Fecha"
                {...feedbackProps(
                  errors.date,
                  teamsReady
                    ? "Seleccioná la fecha del encuentro."
                    : "Seleccioná dos equipos diferentes para habilitar la fecha.",
                )}
              >
                <input
                  className={fieldControlClasses}
                  disabled={!teamsReady}
                  min={todayIsoDate()}
                  name="date"
                  onChange={(event) => {
                    setForm((current) => ({ ...current, date: event.target.value, time: "" }));
                    clearError("date");
                    clearError("time");
                    setIsSubmitted(false);
                  }}
                  required
                  type="date"
                  value={form.date}
                />
              </Field>
              <Field
                id={fieldIds.time}
                label="Horario disponible"
                {...feedbackProps(
                  errors.time,
                  form.date
                    ? "Solo se muestran horarios disponibles."
                    : "Seleccioná una fecha para consultar la disponibilidad.",
                )}
              >
                <select
                  className={fieldControlClasses}
                  disabled={!form.date}
                  name="time"
                  onChange={(event) => updateField("time", event.target.value)}
                  required
                  value={form.time}
                >
                  <option value="">Seleccionar horario</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-[22px] flex flex-wrap justify-end gap-2.5 border-t border-vt-border-2 pt-[18px] max-[600px]:flex-col-reverse">
              <Link className={buttonClasses("ghost")} to={"/admin/matches" as string}>
                Cancelar
              </Link>
              <Button type="submit">Crear partido</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
