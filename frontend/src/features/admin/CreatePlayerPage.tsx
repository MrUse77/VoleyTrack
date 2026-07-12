import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { FormField } from "../../components/primitives/FormField";
import { SectionShell } from "../../components/ui/SectionShell";

type PlayerPosition = "setter" | "outside-hitter" | "opposite" | "middle-blocker" | "libero";

type PlayerForm = {
  fullName: string;
  number: string;
  position: PlayerPosition;
};

const initialForm: PlayerForm = {
  fullName: "",
  number: "",
  position: "setter",
};

export function CreatePlayerPage() {
  const [form, setForm] = useState<PlayerForm>(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <Field extends keyof PlayerForm>(field: Field, value: PlayerForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setIsSubmitted(false);
  };

  return (
    <SectionShell
      description="Completá los datos para preparar el registro de un jugador."
      eyebrow="Administración"
      title="Crear jugador"
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
            id="player-full-name"
            label="Nombre completo"
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Nombre y apellido"
            value={form.fullName}
          />
          <FormField
            id="player-number"
            label="Número"
            min="0"
            onChange={(event) => updateField("number", event.target.value)}
            placeholder="7"
            type="number"
            value={form.number}
          />
          <div className="grid gap-2">
            <label className="text-sm font-medium text-vt-text" htmlFor="player-position">Posición</label>
            <select
              className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              id="player-position"
              onChange={(event) => updateField("position", event.target.value as PlayerPosition)}
              value={form.position}
            >
              <option value="setter">Armador</option>
              <option value="outside-hitter">Punta receptor</option>
              <option value="opposite">Opuesto</option>
              <option value="middle-blocker">Central</option>
              <option value="libero">Líbero</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Button type="submit">Crear jugador</Button>
              <Link className="text-sm font-semibold text-vt-muted hover:text-vt-text" to={"/admin/players" as string}>
                Cancelar
              </Link>
          {isSubmitted ? <p className="text-sm text-vt-success" role="status">Jugador preparado localmente</p> : null}
        </div>
      </form>
    </SectionShell>
  );
}
