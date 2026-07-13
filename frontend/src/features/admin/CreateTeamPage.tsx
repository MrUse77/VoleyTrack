import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { FormField } from "../../components/primitives/FormField";

type TeamForm = {
  clubName: string;
  coach: string;
};

const initialForm: TeamForm = {
  clubName: "",
  coach: "",
};

export function CreateTeamPage() {
  const [form, setForm] = useState<TeamForm>(initialForm);
  const { search } = useLocation();
  const isPlayerModalOpen = search.modal === "assign-player";

  const updateField = <Field extends keyof TeamForm>(field: Field, value: TeamForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="max-w-[800px] rounded-2xl border border-slate-800 bg-vt-raised p-10">
      <header className="border-b border-slate-800 pb-6">
        <h2 className="text-2xl font-black text-white">Crear Nuevo Equipo</h2>
        <p className="mt-2 text-sm text-vt-muted">Da de alta un club y conforma su plantel.</p>
      </header>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <FormField
          className="h-12"
          id="team-club-name"
          label="Nombre del Club"
          onChange={(event) => updateField("clubName", event.target.value)}
          placeholder="Ej: Club Atlético River Plate"
          value={form.clubName}
        />
        <FormField
          className="h-12"
          id="team-coach"
          label="Entrenador (Coach)"
          onChange={(event) => updateField("coach", event.target.value)}
          placeholder="Nombre del director técnico"
          value={form.coach}
        />
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 px-4 py-10 text-center text-sm text-slate-500">
          Aún no hay jugadores. Haz clic en &quot;Agregar Jugador&quot;.
        </div>
        <Link
          className="mt-1 flex h-10 w-50 items-center justify-center rounded-lg border border-blue-500 text-sm font-bold text-blue-500"
          search={{ modal: "assign-player" }}
          to={"/admin/teams/create" as string}
        >
          + Agregar Jugador
        </Link>
        <div className="mt-7 grid grid-cols-2 gap-5">
          <button className="h-12 rounded-lg bg-vt-accent text-sm font-bold text-black" type="submit">
            Registrar Equipo
          </button>
          <Link
            className="flex h-12 items-center justify-center rounded-lg border border-slate-700 text-sm font-bold text-white"
            to={"/admin/teams" as string}
          >
            Cancelar
          </Link>
        </div>
      </form>
      {isPlayerModalOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6"
          role="dialog"
        >
          <section
            aria-labelledby="add-player-modal-title"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-vt-raised p-6"
          >
            <h3 id="add-player-modal-title" className="text-xl font-black text-white">
              Agregar Jugador
            </h3>
            <p className="mt-2 text-sm text-vt-muted">
              La incorporación de jugadores estará disponible próximamente.
            </p>
            <Link
              className="mt-6 flex h-10 items-center justify-center rounded-lg border border-slate-700 text-sm font-bold text-white"
              to={"/admin/teams/create" as string}
            >
              Cancelar
            </Link>
          </section>
        </div>
      ) : null}
    </section>
  );
}
