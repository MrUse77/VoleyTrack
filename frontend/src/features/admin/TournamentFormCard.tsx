import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Field, fieldControlClasses, fieldTextareaClasses } from "../../components/primitives/Field";
import type { TournamentFormValues } from "./tournamentFormValues";

/**
 * The tournament data form the create and edit screens share.
 *
 * Design: frontend/design/html/voleytrack-admin-nuevo-torneo.html and
 * voleytrack-admin-editar-torneo.html render the same `.form-grid` — Nombre del torneo (full
 * width), Temporada, Sistema de competencia, Estado, Cantidad de equipos, Fecha de inicio,
 * Fecha de finalización and Descripción (full width, textarea), closed by the `.form-actions`
 * row. Only the card's eyebrow (`NUEVO` / `FORMULARIO`), the submit label ("Crear torneo" /
 * "Guardar cambios"), the cancel destination and the starting values differ, so the grid is
 * written once and both screens pass those four things in.
 *
 * Behaviour is the app's existing one, not the prototype's: the form keeps its values locally,
 * submitting shows a local "prepared" status that claims nothing was saved, and any edit
 * clears that status. The prototype's own fields carry no validation either, so no validation
 * is invented here beyond the `min`/`step` the number input declares.
 */
type TournamentFormField = keyof TournamentFormValues;

const fieldIds: Record<TournamentFormField, string> = {
  competitionSystem: "tournament-competition-system",
  description: "tournament-description",
  endDate: "tournament-end-date",
  name: "tournament-name",
  season: "tournament-season",
  startDate: "tournament-start-date",
  status: "tournament-status",
  teamCount: "tournament-team-count",
};

/** The design's own option lists, in its order. */
const seasonOptions = ["2026/27", "2025/26", "2024/25"] as const;
const competitionSystemOptions = [
  "Liga regular",
  "Liga + playoffs",
  "Eliminación directa",
  "Fase de grupos",
] as const;
const statusOptions = ["Programado", "En curso", "Finalizado", "Suspendido"] as const;

export function TournamentFormCard({
  cancelTo,
  eyebrow,
  initialValues,
  statusText,
  submitLabel,
}: {
  cancelTo: string;
  eyebrow: ReactNode;
  initialValues: TournamentFormValues;
  statusText: ReactNode;
  submitLabel: string;
}) {
  const [form, setForm] = useState<TournamentFormValues>(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends TournamentFormField>(field: Field, value: TournamentFormValues[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <Card padded={false}>
      <CardHeader>
        Datos del torneo
        <small>{eyebrow}</small>
      </CardHeader>
      <CardBody data-testid="tournament-form-card-body">
        <form className="grid gap-[18px]" noValidate onSubmit={handleSubmit}>
          {isSubmitted ? (
            /* Design: voleytrack-admin.css:191-192 `.form-status.success`. */
            <p
              aria-live="polite"
              className="rounded-vt-md border border-vt-success-soft-border bg-vt-success-soft px-[14px] py-3 text-[13px] font-bold text-vt-success-soft-text"
              role="status"
              tabIndex={-1}
            >
              {statusText}
            </p>
          ) : null}

          {/* Design: voleytrack-admin.css:175-176 `.form-grid` — two columns with an 18px gap,
              one column below 900px; `.field.full` spans both. */}
          <div className="grid gap-[18px] min-[901px]:grid-cols-2">
            <Field full id={fieldIds.name} label="Nombre del torneo">
              <input
                className={fieldControlClasses}
                name="name"
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Ej: Liga Argentina A1"
                required
                value={form.name}
              />
            </Field>
            <Field id={fieldIds.season} label="Temporada">
              <select
                className={fieldControlClasses}
                name="season"
                onChange={(event) => updateField("season", event.target.value)}
                value={form.season}
              >
                <option value="">Seleccionar temporada</option>
                {seasonOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field id={fieldIds.competitionSystem} label="Sistema de competencia">
              <select
                className={fieldControlClasses}
                name="competitionSystem"
                onChange={(event) => updateField("competitionSystem", event.target.value)}
                value={form.competitionSystem}
              >
                <option value="">Seleccionar sistema</option>
                {competitionSystemOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field id={fieldIds.status} label="Estado">
              <select
                className={fieldControlClasses}
                name="status"
                onChange={(event) => updateField("status", event.target.value)}
                value={form.status}
              >
                <option value="">Seleccionar estado</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field id={fieldIds.teamCount} label="Cantidad de equipos">
              <input
                className={fieldControlClasses}
                min="2"
                name="teamCount"
                onChange={(event) => updateField("teamCount", event.target.value)}
                step="1"
                type="number"
                value={form.teamCount}
              />
            </Field>
            <Field id={fieldIds.startDate} label="Fecha de inicio">
              <input
                className={fieldControlClasses}
                name="startDate"
                onChange={(event) => updateField("startDate", event.target.value)}
                type="date"
                value={form.startDate}
              />
            </Field>
            <Field id={fieldIds.endDate} label="Fecha de finalización">
              <input
                className={fieldControlClasses}
                name="endDate"
                onChange={(event) => updateField("endDate", event.target.value)}
                type="date"
                value={form.endDate}
              />
            </Field>
            <Field full id={fieldIds.description} label="Descripción">
              <textarea
                className={fieldTextareaClasses}
                name="description"
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Descripción breve del torneo"
                value={form.description}
              />
            </Field>
          </div>

          {/* Design: voleytrack-admin.css:187 `.form-actions` — 22px above, an 18px --border-2
              rule, a 10px gap and right alignment; below 600px it reverses into a full-width
              column. */}
          <div className="flex flex-wrap justify-end gap-2.5 border-t border-vt-border-2 pt-[18px] max-[600px]:flex-col-reverse">
            <Link className={buttonClasses("ghost")} to={cancelTo as string}>
              Cancelar
            </Link>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
