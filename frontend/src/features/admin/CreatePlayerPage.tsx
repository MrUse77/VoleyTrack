import { Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../components/primitives/Button";
import { Field, fieldControlClasses } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";

type PlayerPosition = "setter" | "outside-hitter" | "opposite" | "middle-blocker" | "libero";

type PlayerForm = {
  firstName: string;
  lastName: string;
  birthDate: string;
  number: string;
  position: PlayerPosition | "";
};

type PlayerField = keyof PlayerForm;
type PlayerErrors = Partial<Record<PlayerField, string>>;

const initialForm: PlayerForm = {
  firstName: "",
  lastName: "",
  birthDate: "",
  number: "",
  position: "",
};

const fieldIds: Record<PlayerField, string> = {
  firstName: "player-first-name",
  lastName: "player-last-name",
  birthDate: "player-birth-date",
  number: "player-number",
  position: "player-position",
};

const positionOptions: Array<{ label: string; value: PlayerPosition }> = [
  { label: "Armador", value: "setter" },
  { label: "Punta receptor", value: "outside-hitter" },
  { label: "Opuesto", value: "opposite" },
  { label: "Central", value: "middle-blocker" },
  { label: "Líbero", value: "libero" },
];

function validatePlayerForm(form: PlayerForm): PlayerErrors {
  const errors: PlayerErrors = {};

  if (!form.firstName.trim()) {
    errors.firstName = "Ingresá el nombre.";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Ingresá el apellido.";
  }

  if (!form.birthDate.trim()) {
    errors.birthDate = "Ingresá la fecha de nacimiento.";
  }

  if (!form.number.trim()) {
    errors.number = "Ingresá el dorsal.";
  } else if (!Number.isInteger(Number(form.number)) || Number(form.number) < 0) {
    errors.number = "Ingresá un dorsal válido.";
  } else if (Number(form.number) > 99) {
    errors.number = "Ingresá un dorsal entre 0 y 99.";
  }

  if (!form.position) {
    errors.position = "Seleccioná una posición.";
  }

  return errors;
}

/**
 * `Field` renders an optional hint and an optional error as two separate slots, so the
 * old single-message field has to choose one: passing both would put two ids in
 * `aria-describedby`. The error keeps its `role="alert"` wrapper, and `Field` derives
 * `aria-invalid` from `error` being present.
 */
function feedbackProps(error: string | undefined, hint: string): { error?: ReactNode; hint?: ReactNode } {
  return error ? { error: <span role="alert">{error}</span> } : { hint };
}

export function CreatePlayerPage() {
  const [form, setForm] = useState<PlayerForm>(initialForm);
  const [errors, setErrors] = useState<PlayerErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends PlayerField>(field: Field, value: PlayerForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
    setIsSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validatePlayerForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitted(false);
      const firstInvalidField = Object.keys(nextErrors)[0] as PlayerField;
      event.currentTarget.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
      return;
    }

    setIsSubmitted(true);
  };

  const hasErrors = Object.keys(errors).length > 0;
  const positionMessageId = errors.position ? `${fieldIds.position}-error` : `${fieldIds.position}-hint`;

  return (
    <SectionShell
      description="Completá los datos para preparar el registro de un jugador."
      eyebrow="Administración"
      title="Crear Nuevo Jugador"
    >
      <form
        className="max-w-2xl rounded-2xl border border-vt-border bg-vt-raised p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        {hasErrors ? (
          <p
            aria-live="assertive"
            className="mb-5 rounded-lg border border-vt-danger/60 bg-vt-danger/10 px-4 py-3 text-sm text-vt-danger"
            role="alert"
          >
            Revisá los campos marcados antes de continuar.
          </p>
        ) : null}

        <fieldset className="grid gap-5 rounded-xl border border-vt-border p-4">
          <legend className="px-2 text-sm font-bold text-vt-text">Datos personales</legend>
          <Field id={fieldIds.firstName} label="Nombre" {...feedbackProps(errors.firstName, "Nombre de pila")}>
            <input
              autoComplete="given-name"
              className={fieldControlClasses}
              name="firstName"
              onChange={(event) => updateField("firstName", event.target.value)}
              placeholder="Nombre del jugador"
              required
              value={form.firstName}
            />
          </Field>
          <Field id={fieldIds.lastName} label="Apellido" {...feedbackProps(errors.lastName, "Apellido del jugador")}>
            <input
              autoComplete="family-name"
              className={fieldControlClasses}
              name="lastName"
              onChange={(event) => updateField("lastName", event.target.value)}
              placeholder="Apellido del jugador"
              required
              value={form.lastName}
            />
          </Field>
          <Field id={fieldIds.birthDate} label="Fecha de nacimiento" {...feedbackProps(errors.birthDate, "Formato de fecha local")}>
            <input
              className={fieldControlClasses}
              name="birthDate"
              onChange={(event) => updateField("birthDate", event.target.value)}
              required
              type="date"
              value={form.birthDate}
            />
          </Field>
        </fieldset>

        <fieldset className="mt-5 grid gap-5 rounded-xl border border-vt-border p-4">
          <legend className="px-2 text-sm font-bold text-vt-text">Datos deportivos</legend>
          <Field id={fieldIds.number} label="Dorsal" {...feedbackProps(errors.number, "Número de camiseta (ej. 10)")}>
            <input
              className={fieldControlClasses}
              inputMode="numeric"
              max="99"
              min="0"
              name="number"
              onChange={(event) => updateField("number", event.target.value)}
              placeholder="10"
              required
              step="1"
              type="number"
              value={form.number}
            />
          </Field>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-vt-text" htmlFor={fieldIds.position}>Posición</label>
            <select
              aria-describedby={positionMessageId}
              aria-invalid={Boolean(errors.position)}
              className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              id={fieldIds.position}
              name="position"
              onChange={(event) => updateField("position", event.target.value as PlayerPosition | "")}
              required
              value={form.position}
            >
              <option disabled value="">Seleccioná una posición</option>
              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <p
              className={errors.position ? "text-sm text-vt-danger" : "text-sm text-vt-muted"}
              id={positionMessageId}
              role={errors.position ? "alert" : undefined}
            >
              {errors.position ?? "Elegí la posición habitual del jugador."}
            </p>
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit">Crear jugador</Button>
          <Link className="text-sm font-semibold text-vt-muted hover:text-vt-text" to={"/admin/players" as string}>
            Cancelar
          </Link>
          {isSubmitted ? (
            <p className="text-sm text-vt-success" role="status">
              Jugador preparado localmente. No se enviaron datos al servidor.
            </p>
          ) : null}
        </div>
      </form>
    </SectionShell>
  );
}
