import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { FormField } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";

type TournamentForm = {
  name: string;
  format: string;
  startDate: string;
  endDate: string;
};

const initialForm: TournamentForm = {
  name: "",
  format: "",
  startDate: "",
  endDate: "",
};

export function CreateTournamentPage() {
  const [form, setForm] = useState<TournamentForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof TournamentForm>(field: Field, value: TournamentForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  return (
    <SectionShell
      description="Configura los parámetros iniciales de la competencia."
      eyebrow="Administración"
      title="Crear Torneo"
    >
      <form
        className="max-w-3xl rounded-2xl border border-vt-border bg-vt-raised p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSubmitted(true);
        }}
      >
        <div className="grid gap-5">
          <FormField
            id="tournament-name"
            label="Nombre del Torneo"
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ej: Liga Nacional 2026"
            value={form.name}
          />
          <FormField
            id="tournament-start-date"
            label="Fecha de Inicio"
            onChange={(event) => updateField("startDate", event.target.value)}
            placeholder="DD/MM/AAAA"
            type="date"
            value={form.startDate}
          />
          <FormField
            id="tournament-end-date"
            label="Fecha de Fin"
            onChange={(event) => updateField("endDate", event.target.value)}
            placeholder="DD/MM/AAAA"
            type="date"
            value={form.endDate}
          />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-vt-text" htmlFor="tournament-format">Tipo de Competición</label>
            <select
              className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              id="tournament-format"
              onChange={(event) => updateField("format", event.target.value)}
              value={form.format}
            >
              <option value="">Seleccionar (Liga Regular, Playoffs...)</option>
              <option value="regular-league">Liga Regular</option>
              <option value="playoffs">Playoffs</option>
              <option value="mixed">Liga Regular y Playoffs</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="submit">Crear Torneo</Button>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg border border-vt-border px-4 text-sm font-semibold text-vt-text hover:bg-vt-surface"
            to={"/admin/tournaments" as string}
          >
            Cancelar
          </Link>
          {isSubmitted ? <p className="text-sm text-vt-success sm:col-span-2" role="status">Torneo preparado localmente</p> : null}
        </div>
      </form>
    </SectionShell>
  );
}
