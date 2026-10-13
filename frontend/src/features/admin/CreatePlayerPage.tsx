import { Link } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN } from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-admin-crear-jugador.html — a `.page-head`
 * ("Crear jugador") over the `.form-card` (max-width 760px): a `.card-h` reading
 * "Datos del jugador" with the `Estado automático: Activo` eyebrow, then the form's
 * `.card-b` holding a `.form-grid` of Nombre | Apellido | Fecha de nacimiento | Posición |
 * Equipo | Dorsal and a `.form-actions` row (Cancelar | Crear jugador).
 *
 * The design's Equipo select carries the hint "El dorsal debe ser único dentro del equipo
 * seleccionado." and its prototype enforces it, so the rule is implemented against the
 * fixture roster instead of shipping a hint that nothing checks.
 *
 * The design groups its fields in one two-column grid with no fieldset, so the app's
 * "Datos personales" / "Datos deportivos" groupings are gone.
 */
type PlayerForm = {
  birthDate: string;
  firstName: string;
  lastName: string;
  number: string;
  position: string;
  teamName: string;
};

type PlayerField = keyof PlayerForm;
type PlayerErrors = Partial<Record<PlayerField, string>>;

const initialForm: PlayerForm = {
  birthDate: "",
  firstName: "",
  lastName: "",
  number: "",
  position: "",
  teamName: "",
};

const fieldIds: Record<PlayerField, string> = {
  birthDate: "player-birth-date",
  firstName: "player-first-name",
  lastName: "player-last-name",
  number: "player-number",
  position: "player-position",
  teamName: "player-team",
};

/** The design's own option list, in its order. */
const positionOptions = ["Armador", "Central", "Líbero", "Opuesto", "Punta"] as const;

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

  if (!form.position) {
    errors.position = "Seleccioná una posición.";
  }

  if (!form.teamName) {
    errors.teamName = "Seleccioná un equipo.";
  }

  if (!form.number.trim()) {
    errors.number = "Ingresá el dorsal.";
  } else if (!Number.isInteger(Number(form.number)) || Number(form.number) < 1) {
    errors.number = "Ingresá un dorsal válido.";
  } else if (Number(form.number) > 99) {
    errors.number = "Ingresá un dorsal entre 1 y 99.";
  } else if (
    ADMIN.players.some(
      (player) => player.teamName === form.teamName && player.number === Number(form.number),
    )
  ) {
    errors.number = "Dorsal duplicado, ingresar otro valor";
  }

  return errors;
}

/**
 * `Field` renders an optional hint and an optional error as two separate slots, so a field
 * with both has to choose one: passing both would put two ids in `aria-describedby`. The
 * error keeps its `role="alert"` wrapper, and `Field` derives `aria-invalid` from `error`
 * being present.
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

  return (
    <div>
      <PageHeader
        className="mb-[22px]"
        description="Completá los datos deportivos para incorporar al jugador al equipo."
        title="Crear jugador"
      />

      <Card className="max-w-[760px]" padded={false}>
        <CardHeader>
          Datos del jugador
          <small>Estado automático: Activo</small>
        </CardHeader>
        <CardBody data-testid="create-player-card-body">
          <form className="grid gap-[18px]" noValidate onSubmit={handleSubmit}>
            {isSubmitted ? (
              /* Design: voleytrack-admin.css:191-192 `.form-status.success`. */
              <p
                aria-live="polite"
                className="rounded-vt-md border border-vt-success-soft-border bg-vt-success-soft px-[14px] py-3 text-[13px] font-bold text-vt-success-soft-text"
                role="status"
                tabIndex={-1}
              >
                Jugador preparado localmente. No se enviaron datos al servidor.
              </p>
            ) : null}

            {/* Design: voleytrack-admin.css:175-176 `.form-grid` — two columns with an 18px
                gap, one column below 901px. */}
            <div className="grid gap-[18px] min-[901px]:grid-cols-2">
              <Field
                id={fieldIds.firstName}
                label="Nombre"
                {...feedbackProps(errors.firstName, "Nombre de pila")}
              >
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
              <Field
                id={fieldIds.lastName}
                label="Apellido"
                {...feedbackProps(errors.lastName, "Apellido del jugador")}
              >
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
              <Field
                id={fieldIds.birthDate}
                label="Fecha de nacimiento"
                {...feedbackProps(errors.birthDate, "Formato de fecha local")}
              >
                <input
                  className={fieldControlClasses}
                  name="birthDate"
                  onChange={(event) => updateField("birthDate", event.target.value)}
                  required
                  type="date"
                  value={form.birthDate}
                />
              </Field>
              <Field
                id={fieldIds.position}
                label="Posición"
                {...feedbackProps(errors.position, "Elegí la posición habitual del jugador.")}
              >
                <select
                  className={fieldControlClasses}
                  name="position"
                  onChange={(event) => updateField("position", event.target.value)}
                  required
                  value={form.position}
                >
                  <option value="">Seleccionar posición</option>
                  {positionOptions.map((position) => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </Field>
              <Field
                id={fieldIds.teamName}
                label="Equipo"
                {...feedbackProps(errors.teamName, "El dorsal debe ser único dentro del equipo seleccionado.")}
              >
                <select
                  className={fieldControlClasses}
                  name="teamName"
                  onChange={(event) => updateField("teamName", event.target.value)}
                  required
                  value={form.teamName}
                >
                  <option value="">Seleccionar equipo</option>
                  {ADMIN.teams.map((team) => (
                    <option key={team.id} value={team.name}>{team.name}</option>
                  ))}
                </select>
              </Field>
              <Field
                id={fieldIds.number}
                label="Dorsal"
                {...feedbackProps(errors.number, "Número de camiseta (ej. 10)")}
              >
                <input
                  className={fieldControlClasses}
                  inputMode="numeric"
                  max="99"
                  min="1"
                  name="number"
                  onChange={(event) => updateField("number", event.target.value)}
                  placeholder="10"
                  required
                  step="1"
                  type="number"
                  value={form.number}
                />
              </Field>
            </div>

            {/* Design: voleytrack-admin.css:187 `.form-actions` — 22px above, an 18px
                --border-2 rule, a 10px gap and right alignment; below 600px it reverses into
                a full-width column. */}
            <div className="mt-[22px] flex flex-wrap justify-end gap-2.5 border-t border-vt-border-2 pt-[18px] max-[600px]:flex-col-reverse">
              <Link className={buttonClasses("ghost")} to={"/admin/players" as string}>
                Cancelar
              </Link>
              <Button type="submit">Crear jugador</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
