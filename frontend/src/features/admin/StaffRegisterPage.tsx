import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { FormField } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";

type StaffRole = "scorer" | "assistant" | "coordinator";

type StaffForm = {
  fullName: string;
  email: string;
  role: StaffRole;
};

const initialForm: StaffForm = {
  fullName: "",
  email: "",
  role: "scorer",
};

export function StaffRegisterPage() {
  const [form, setForm] = useState<StaffForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof StaffForm>(field: Field, value: StaffForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  return (
    <SectionShell
      description="Completá los datos para preparar el registro del personal de planilla."
      eyebrow="Administración"
      title="Registrar planillero"
    >
      <form
        className="max-w-2xl rounded-2xl border border-vt-border bg-vt-raised p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitted(true);
        }}
      >
        <div className="grid gap-5">
          <FormField
            id="staff-full-name"
            label="Nombre completo"
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Nombre y apellido"
            value={form.fullName}
          />
          <FormField
            id="staff-email"
            label="Correo electrónico"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="correo@ejemplo.com"
            type="email"
            value={form.email}
          />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-vt-text" htmlFor="staff-role">Rol</label>
            <select
              className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              id="staff-role"
              onChange={(event) => updateField("role", event.target.value as StaffRole)}
              value={form.role}
            >
              <option value="scorer">Planillero</option>
              <option value="assistant">Asistente de planilla</option>
              <option value="coordinator">Coordinador</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Button type="submit">Registrar planillero</Button>
          {isSubmitted ? <p className="text-sm text-vt-success" role="status">Registro preparado localmente</p> : null}
        </div>
      </form>
    </SectionShell>
  );
}
