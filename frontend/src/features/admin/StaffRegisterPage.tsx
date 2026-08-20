import { useState, type FormEvent } from "react";
import { Button } from "../../components/primitives/Button";
import { FormField } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";

type StaffRole = "scorer" | "assistant" | "coordinator";

type StaffForm = {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  role: StaffRole;
};

type StaffField = keyof StaffForm;
type StaffErrors = Partial<Record<StaffField, string>>;

const initialForm: StaffForm = {
  firstName: "",
  lastName: "",
  dni: "",
  phone: "",
  email: "",
  role: "scorer",
};

const fieldIds: Record<StaffField, string> = {
  firstName: "staff-first-name",
  lastName: "staff-last-name",
  dni: "staff-dni",
  phone: "staff-phone",
  email: "staff-email",
  role: "staff-role",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStaffForm(form: StaffForm): StaffErrors {
  const errors: StaffErrors = {};

  if (!form.firstName.trim()) {
    errors.firstName = "Ingresá el nombre.";
  }

  if (!form.lastName.trim()) {
    errors.lastName = "Ingresá el apellido.";
  }

  if (!form.dni.trim()) {
    errors.dni = "Ingresá el DNI.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Ingresá el teléfono.";
  }

  if (!form.email.trim()) {
    errors.email = "Ingresá el email.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }

  return errors;
}

function fieldMessage(error: string | undefined, hint: string) {
  return error ? <span role="alert">{error}</span> : hint;
}

export function StaffRegisterPage() {
  const [form, setForm] = useState<StaffForm>(initialForm);
  const [errors, setErrors] = useState<StaffErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends StaffField>(field: Field, value: StaffForm[Field]) => {
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
    const nextErrors = validateStaffForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSubmitted(false);
      const firstInvalidField = Object.keys(nextErrors)[0] as StaffField;
      event.currentTarget.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
      return;
    }

    setIsSubmitted(true);
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <SectionShell
      description="Completá los datos para preparar el registro del personal de planilla."
      eyebrow="Administración"
      title="Registrar Nuevo Planillero"
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
          <FormField
            autoComplete="given-name"
            id={fieldIds.firstName}
            label="Nombre"
            aria-invalid={Boolean(errors.firstName)}
            helperText={fieldMessage(errors.firstName, "Nombre de pila")}
            name="firstName"
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder="Ej. Juan"
            required
            value={form.firstName}
          />
          <FormField
            autoComplete="family-name"
            id={fieldIds.lastName}
            label="Apellido"
            aria-invalid={Boolean(errors.lastName)}
            helperText={fieldMessage(errors.lastName, "Apellido de la persona")}
            name="lastName"
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder="Ej. Pérez"
            required
            value={form.lastName}
          />
          <FormField
            id={fieldIds.dni}
            inputMode="numeric"
            label="DNI"
            aria-invalid={Boolean(errors.dni)}
            helperText={fieldMessage(errors.dni, "Sin puntos ni espacios")}
            name="dni"
            onChange={(event) => updateField("dni", event.target.value)}
            placeholder="Ej. 32123456"
            required
            value={form.dni}
          />
          <FormField
            autoComplete="tel"
            id={fieldIds.phone}
            label="Teléfono"
            aria-invalid={Boolean(errors.phone)}
            helperText={fieldMessage(errors.phone, "Código de área + número")}
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="Ej. 1123456789"
            required
            type="tel"
            value={form.phone}
          />
          <FormField
            autoComplete="email"
            id={fieldIds.email}
            label="Email"
            aria-invalid={Boolean(errors.email)}
            helperText={fieldMessage(errors.email, "correo@ejemplo.com")}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="correo@ejemplo.com"
            required
            type="email"
            value={form.email}
          />
        </fieldset>

        <fieldset className="mt-5 grid gap-5 rounded-xl border border-vt-border p-4">
          <legend className="px-2 text-sm font-bold text-vt-text">Perfil operativo</legend>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-vt-text" htmlFor={fieldIds.role}>Rol</label>
            <select
              aria-invalid={Boolean(errors.role)}
              className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              id={fieldIds.role}
              name="role"
              onChange={(event) => updateField("role", event.target.value as StaffRole)}
              required
              value={form.role}
            >
              <option value="scorer">Planillero</option>
              <option value="assistant">Asistente de planilla</option>
              <option value="coordinator">Coordinador</option>
            </select>
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit">Registrar planillero</Button>
          {isSubmitted ? (
            <p className="text-sm text-vt-success" role="status">
              Registro preparado localmente. No se enviaron datos al servidor.
            </p>
          ) : null}
        </div>
      </form>
    </SectionShell>
  );
}
