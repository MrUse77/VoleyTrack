import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FormField } from "../../components/primitives/FormField";
import { Modal } from "../../components/primitives/Modal";
import { PUBLIC_PLAYERS } from "../../fixtures";

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
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [rosterPlayerIds, setRosterPlayerIds] = useState<string[]>([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const isPlayerModalOpen = search.modal === "player" || search.modal === "assign-player";

  const updateField = <Field extends keyof TeamForm>(field: Field, value: TeamForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const closePlayerModal = () => {
    navigate({ to: "/admin/teams/create", search: {} });
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  };

  const confirmPlayers = () => {
    setRosterPlayerIds(selectedPlayerIds);
    closePlayerModal();
  };

  const rosterPlayers = PUBLIC_PLAYERS.filter((player) => rosterPlayerIds.includes(player.id));

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
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 px-4 py-6 text-center text-sm text-slate-500">
          {rosterPlayers.length === 0 ? (
            <>Aún no hay jugadores. Haz clic en &quot;Agregar Jugador&quot;.</>
          ) : (
            <ul className="space-y-2 text-left text-vt-text">
              {rosterPlayers.map((player) => (
                <li key={player.id}>{player.fullName}</li>
              ))}
            </ul>
          )}
        </div>
        <Link
          className="mt-1 flex h-10 w-50 items-center justify-center rounded-lg border border-blue-500 text-sm font-bold text-blue-500"
          search={{ modal: "player" }}
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
      <Modal isOpen={isPlayerModalOpen} onClose={closePlayerModal} title="Agregar Jugador">
        <p className="mb-5 text-sm text-vt-muted">Elegí los jugadores para el plantel de este equipo.</p>
        <div className="space-y-2">
          {PUBLIC_PLAYERS.map((player) => (
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-vt-text hover:bg-vt-panel" key={player.id}>
              <input
                aria-label={`Seleccionar ${player.fullName}`}
                checked={selectedPlayerIds.includes(player.id)}
                className="h-4 w-4 accent-vt-accent"
                onChange={() => togglePlayer(player.id)}
                type="checkbox"
              />
              <span>{player.fullName}</span>
              <span className="ml-auto text-vt-muted">#{player.number}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <Link
            className="text-sm font-bold text-white"
            to={"/admin/teams/create" as string}
          >
            Cancelar
          </Link>
          <button
            className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110"
            onClick={confirmPlayers}
            type="button"
          >
            Confirmar selección
          </button>
        </div>
      </Modal>
    </section>
  );
}
