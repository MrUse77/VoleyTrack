import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FormField } from "../../components/primitives/FormField";
import { Modal } from "../../components/primitives/Modal";
import { PUBLIC_PLAYERS } from "../../fixtures";

type TeamForm = {
  clubName: string;
  coach: string;
};

type NewPlayerForm = {
  fullName: string;
  number: string;
  position: string;
};

type NewPlayerErrors = Partial<Record<keyof NewPlayerForm, string>>;

type RosterPlayer = {
  id: string;
  fullName: string;
  number: number;
  position: string;
};

type ModalState = "player" | "assign-player";

const initialForm: TeamForm = {
  clubName: "",
  coach: "",
};

const initialNewPlayerForm: NewPlayerForm = {
  fullName: "",
  number: "",
  position: "",
};

const newPlayerFieldIds: Record<keyof NewPlayerForm, string> = {
  fullName: "new-player-full-name",
  number: "new-player-number",
  position: "new-player-position",
};

export function CreateTeamPage() {
  const [form, setForm] = useState<TeamForm>(initialForm);
  const [rosterPlayers, setRosterPlayers] = useState<RosterPlayer[]>([]);
  const [newPlayerForm, setNewPlayerForm] = useState<NewPlayerForm>(initialNewPlayerForm);
  const [newPlayerErrors, setNewPlayerErrors] = useState<NewPlayerErrors>({});
  const [assignSearch, setAssignSearch] = useState("");
  const [rosterFeedback, setRosterFeedback] = useState<string | null>(null);
  const { search } = useLocation();
  const navigate = useNavigate();
  const activeModal: ModalState | null = search.modal === "player" || search.modal === "assign-player"
    ? search.modal
    : null;

  const updateField = <Field extends keyof TeamForm>(field: Field, value: TeamForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const closeModal = () => {
    navigate({ to: "/admin/teams/create", search: {} });
  };

  const updateNewPlayerField = <Field extends keyof NewPlayerForm>(field: Field, value: NewPlayerForm[Field]) => {
    setNewPlayerForm((current) => ({ ...current, [field]: value }));
    setNewPlayerErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateNewPlayer = (): NewPlayerErrors => {
    const errors: NewPlayerErrors = {};
    const number = Number(newPlayerForm.number);

    if (!newPlayerForm.fullName.trim()) {
      errors.fullName = "Ingresá el nombre completo.";
    }
    if (!newPlayerForm.number.trim()) {
      errors.number = "Ingresá un dorsal.";
    } else if (!Number.isInteger(number) || number < 1 || number > 99) {
      errors.number = "Ingresá un dorsal entre 1 y 99.";
    }
    if (!newPlayerForm.position.trim()) {
      errors.position = "Ingresá la posición.";
    }

    return errors;
  };

  const handleAddPlayer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateNewPlayer();

    if (Object.keys(errors).length > 0) {
      setNewPlayerErrors(errors);
      const firstError = Object.keys(errors)[0] as keyof NewPlayerForm | undefined;
      if (firstError) document.getElementById(newPlayerFieldIds[firstError])?.focus();
      return;
    }

    const player = {
      id: `local-player-${rosterPlayers.length + 1}`,
      fullName: newPlayerForm.fullName.trim(),
      number: Number(newPlayerForm.number),
      position: newPlayerForm.position.trim(),
    };

    setRosterPlayers((current) => [...current, player]);
    setNewPlayerForm(initialNewPlayerForm);
    setNewPlayerErrors({});
    setRosterFeedback(`Jugador "${player.fullName}" agregado al plantel local.`);
    closeModal();
  };

  const assignFreePlayer = (player: (typeof PUBLIC_PLAYERS)[number]) => {
    setRosterPlayers((current) => [...current, player]);
    setRosterFeedback(`Jugador "${player.fullName}" asignado al plantel local.`);
    closeModal();
  };

  const rosterPlayerIds = new Set(rosterPlayers.map((player) => player.id));
  const freePlayers = PUBLIC_PLAYERS
    .filter((player) => !player.teamId)
    .filter((player) => !rosterPlayerIds.has(player.id));
  const rosterPlayersBySearch = freePlayers
    .filter((player) => player.fullName.toLocaleLowerCase().includes(assignSearch.trim().toLocaleLowerCase()));

  return (
    <section className="max-w-[800px] rounded-2xl border border-vt-border bg-vt-raised p-10">
      <header className="border-b border-vt-raised-border pb-6">
        <h2 className="text-2xl font-black text-vt-text">Crear Nuevo Equipo</h2>
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
        <div className="mt-4 rounded-lg border border-vt-border bg-vt-panel px-4 py-6 text-center text-sm text-vt-muted">
          {rosterPlayers.length === 0 ? (
            <>Aún no hay jugadores. Haz clic en &quot;Agregar Jugador&quot;.</>
          ) : (
            <ul className="space-y-2 text-left text-vt-text">
              {rosterPlayers.map((player) => (
                <li className="flex items-center gap-3" key={player.id}>
                  <span className="font-semibold">{player.fullName}</span>
                  <span className="ml-auto text-vt-muted">#{player.number} · {player.position}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {rosterFeedback ? (
          <p aria-live="polite" className="rounded-lg border border-vt-border bg-vt-panel px-4 py-3 text-sm text-vt-muted" role="status">
            {rosterFeedback}
          </p>
        ) : null}
        <div className="mt-1 grid gap-3 sm:grid-cols-2">
          <Link
            className="flex h-10 items-center justify-center rounded-lg border border-blue-500 text-sm font-bold text-blue-500"
            search={{ modal: "player" }}
            to={"/admin/teams/create" as string}
          >
            + Agregar Jugador
          </Link>
          <Link
            className="flex h-10 items-center justify-center rounded-lg border border-vt-accent text-sm font-bold text-vt-accent"
            search={{ modal: "assign-player" }}
            to={"/admin/teams/create" as string}
          >
            + Asignar Jugador Libre
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-5">
          <button className="h-12 rounded-lg bg-vt-accent text-sm font-bold text-vt-background" type="submit">
            Registrar Equipo
          </button>
          <Link
            className="flex h-12 items-center justify-center rounded-lg border border-vt-border text-sm font-bold text-vt-text"
            to={"/admin/teams" as string}
          >
            Cancelar
          </Link>
        </div>
      </form>
      <Modal isOpen={activeModal === "player"} onClose={closeModal} title="Agregar Jugador al Equipo">
        <p className="mb-5 text-sm text-vt-muted">Registra un nuevo jugador y sumalo directamente al plantel.</p>
        <form className="grid gap-4" onSubmit={handleAddPlayer}>
          <FormField
            aria-invalid={Boolean(newPlayerErrors.fullName)}
            aria-required="true"
            id={newPlayerFieldIds.fullName}
            label="Nombre Completo"
            onChange={(event) => updateNewPlayerField("fullName", event.target.value)}
            placeholder="Ej: Sofía Fernández"
            value={newPlayerForm.fullName}
            helperText={newPlayerErrors.fullName}
          />
          <FormField
            aria-invalid={Boolean(newPlayerErrors.number)}
            aria-required="true"
            id={newPlayerFieldIds.number}
            label="Dorsal"
            max="99"
            min="1"
            onChange={(event) => updateNewPlayerField("number", event.target.value)}
            placeholder="Ej: 18"
            type="number"
            value={newPlayerForm.number}
            helperText={newPlayerErrors.number}
          />
          <FormField
            aria-invalid={Boolean(newPlayerErrors.position)}
            aria-required="true"
            id={newPlayerFieldIds.position}
            label="Posición"
            onChange={(event) => updateNewPlayerField("position", event.target.value)}
            placeholder="Ej: Central"
            value={newPlayerForm.position}
            helperText={newPlayerErrors.position}
          />
          {Object.keys(newPlayerErrors).length > 0 ? (
            <p aria-live="assertive" className="text-sm text-vt-danger" role="alert">
              Completá los campos obligatorios antes de agregar el jugador.
            </p>
          ) : null}
          <div className="mt-2 flex items-center justify-between gap-4">
            <Link className="text-sm font-bold text-vt-text" to={"/admin/teams/create" as string}>
              Cancelar
            </Link>
            <button
              className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
              type="submit"
            >
              Agregar al plantel
            </button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={activeModal === "assign-player"} onClose={closeModal} title="Asignar Jugador Libre">
        <p className="mb-5 text-sm text-vt-muted">Buscá en la base de datos a los jugadores que no tienen equipo.</p>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-vt-text" htmlFor="free-player-search">Buscar jugador libre</label>
          <input
            className="h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text placeholder:text-vt-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            id="free-player-search"
            onChange={(event) => setAssignSearch(event.target.value)}
            placeholder="Buscar por nombre"
            type="search"
            value={assignSearch}
          />
        </div>
        {rosterPlayersBySearch.length > 0 ? (
          <ul className="mt-5 space-y-2" aria-label="Jugadores libres">
            {rosterPlayersBySearch.map((player) => (
              <li className="flex items-center gap-3 rounded-lg border border-vt-border bg-vt-panel px-3 py-2" key={player.id}>
                <span className="text-sm text-vt-text">{player.fullName}</span>
                <span className="ml-auto text-xs text-vt-muted">#{player.number} · {player.position}</span>
                <button
                  className="rounded-lg bg-vt-accent px-3 py-2 text-xs font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                  onClick={() => assignFreePlayer(player)}
                  type="button"
                >
                  Asignar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p aria-live="polite" className="mt-5 rounded-lg border border-vt-border bg-vt-panel px-4 py-4 text-sm text-vt-muted" role="status">
            {freePlayers.length > 0
              ? "No encontramos jugadores libres con esa búsqueda."
              : "No hay jugadores libres para asignar."}
          </p>
        )}
        <div className="mt-6 flex justify-end">
          <Link className="text-sm font-bold text-vt-text" to={"/admin/teams/create" as string}>
            Cancelar
          </Link>
        </div>
      </Modal>
    </section>
  );
}
