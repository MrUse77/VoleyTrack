import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { FormField } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";
import { ADMIN } from "../../fixtures";

type MatchForm = {
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: string;
  venue: string;
};

const initialForm: MatchForm = {
  tournamentId: "",
  homeTeamId: "",
  awayTeamId: "",
  scheduledAt: "",
  venue: "",
};

export function CreateMatchPage() {
  const [form, setForm] = useState<MatchForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof MatchForm>(field: Field, value: MatchForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  return (
    <SectionShell
      description="Programa un encuentro para el torneo seleccionado."
      eyebrow="Administración"
      title="Crear Partido"
    >
      <form
        className="max-w-3xl rounded-2xl border border-vt-border bg-vt-raised p-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (Object.values(form).every(Boolean)) setIsSubmitted(true);
        }}
      >
        <div className="grid gap-5">
          <SelectField
            id="match-tournament"
            label="Torneo"
            onChange={(value) => updateField("tournamentId", value)}
            options={ADMIN.tournaments.map((tournament) => ({ label: tournament.name, value: tournament.id }))}
            placeholder="Seleccionar torneo"
            value={form.tournamentId}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              id="match-home-team"
              label="Equipo Local"
              onChange={(value) => updateField("homeTeamId", value)}
              options={ADMIN.teams.map((team) => ({ label: team.name, value: team.id }))}
              placeholder="Seleccionar equipo"
              value={form.homeTeamId}
            />
            <SelectField
              id="match-away-team"
              label="Equipo Visitante"
              onChange={(value) => updateField("awayTeamId", value)}
              options={ADMIN.teams.map((team) => ({ label: team.name, value: team.id }))}
              placeholder="Seleccionar equipo"
              value={form.awayTeamId}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="match-scheduled-at"
              label="Fecha y Hora"
              onChange={(event) => updateField("scheduledAt", event.target.value)}
              type="datetime-local"
              value={form.scheduledAt}
            />
            <FormField
              id="match-venue"
              label="Sede"
              onChange={(event) => updateField("venue", event.target.value)}
              placeholder="Ej: Polideportivo Municipal"
              value={form.venue}
            />
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button type="submit">Crear Partido</Button>
          <Link
            className="inline-flex h-10 items-center justify-center rounded-lg border border-vt-border px-4 text-sm font-semibold text-vt-text hover:bg-vt-surface"
            to={"/admin/matches" as string}
          >
            Cancelar
          </Link>
          {isSubmitted ? <p className="text-sm text-vt-success sm:col-span-2" role="status">Partido preparado localmente</p> : null}
        </div>
      </form>
    </SectionShell>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
  placeholder: string;
  value: string;
};

function SelectField({ id, label, onChange, options, placeholder, value }: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-vt-text" htmlFor={id}>{label}</label>
      <select
        className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </div>
  );
}
