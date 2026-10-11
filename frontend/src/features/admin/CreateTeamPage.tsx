import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { Modal } from "../../components/primitives/Modal";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN } from "../../fixtures";

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

const initialForm: TeamForm = {
  clubName: "",
  coach: "",
};

const initialNewPlayerForm: NewPlayerForm = {
  fullName: "",
  number: "",
  position: "",
};

/** The design's own option list, in its order (voleytrack-admin-crear-equipo.html). */
const positionOptions = ["Punta", "Central", "Opuesto", "Armador", "Líbero"] as const;

const playerFieldIds: Record<keyof NewPlayerForm, string> = {
  fullName: "new-player-full-name",
  number: "new-player-number",
  position: "new-player-position",
};

const playerFormId = "create-team-player-form";

/**
 * Design: frontend/design/html/voleytrack-admin-crear-equipo.html — a `.page-head` ("Crear
 * equipo") over two `.card`s: `Datos del club <small>OBLIGATORIO</small>` (Nombre del club,
 * Entrenador, Escudo) and `Plantel <small>JUGADORES</small>` (the `.squad-list` of removable
 * `.squad-item` chips, its `.squad-empty` line and the "Agregar jugador" ghost button), closed
 * by the `.error-msg` line and the `.form-actions` row.
 *
 * Reconciliation of the modal machinery:
 * - KEPT, aligned: the design's single "Crear jugador" dialog (`.modal-overlay#player-overlay`
 *   with `role="dialog"`, `aria-modal`, the `Integrante del plantel` eyebrow, Nombre / Dorsal /
 *   Posición and a `.modal-foot` of Cancelar + Agregar). It is now component state, opened by
 *   the "Agregar jugador" button exactly as the design's own `openPlayerModal()` does, and the
 *   route therefore declares no search contract. It is not a destination: it edits an unsaved
 *   in-memory roster on an unsaved form, so there is no record id to link to — unlike the staff
 *   dialog, which edits a row selected from the table and stays in the URL.
 * - REMOVED: the app-only "Asignar Jugador Libre" dialog. The design has no counterpart for it:
 *   its only roster entry point is the create-player dialog, and its `equiposExistentes` list is
 *   team names for the duplicate check, not assignable players.
 * - REMOVED: the roster's own muted `<ul>` box, replaced by the design's `.squad-list` chips.
 *
 * The design's `Escudo` field is not rendered. Its `.file-field` needs an upload path, and the
 * app has none anywhere (no file input, no upload client, nothing that keeps a file); a file control that
 * accepts a file and drops it would be a control that does nothing, so the region is recorded
 * as unbuilt rather than shipped inert.
 *
 * Behaviour kept from the app: values stay local, submitting validates the design's FA-01 /
 * FA-02 rules and then reports that nothing was saved (the prototype's own `toast` + redirect
 * is not reproduced, because there is nothing that keeps a record for it to confirm).
 */
export function CreateTeamPage() {
  const [form, setForm] = useState<TeamForm>(initialForm);
  const [clubError, setClubError] = useState<string | null>(null);
  const [clubStatus, setClubStatus] = useState<string | null>(null);
  const [rosterPlayers, setRosterPlayers] = useState<RosterPlayer[]>([]);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState<NewPlayerForm>(initialNewPlayerForm);
  const [newPlayerErrors, setNewPlayerErrors] = useState<NewPlayerErrors>({});

  const updateField = <Field extends keyof TeamForm>(field: Field, value: TeamForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setClubError(null);
    setClubStatus(null);
  };

  const updateNewPlayerField = <Field extends keyof NewPlayerForm>(field: Field, value: NewPlayerForm[Field]) => {
    setNewPlayerForm((current) => ({ ...current, [field]: value }));
    setNewPlayerErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const openPlayerModal = () => {
    setNewPlayerForm(initialNewPlayerForm);
    setNewPlayerErrors({});
    setIsPlayerModalOpen(true);
  };

  const closePlayerModal = () => {
    setIsPlayerModalOpen(false);
  };

  const validateNewPlayer = (): NewPlayerErrors => {
    const errors: NewPlayerErrors = {};
    const number = Number(newPlayerForm.number);

    if (!newPlayerForm.fullName.trim()) {
      errors.fullName = "Ingresá el nombre del jugador.";
    }
    if (!newPlayerForm.number.trim()) {
      errors.number = "Ingresá el dorsal.";
    } else if (!Number.isInteger(number) || number < 1 || number > 99) {
      errors.number = "Ingresá un dorsal entre 1 y 99.";
    }
    if (!newPlayerForm.position.trim()) {
      errors.position = "Elegí la posición.";
    }

    return errors;
  };

  const handleAddPlayer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateNewPlayer();

    if (Object.keys(errors).length > 0) {
      setNewPlayerErrors(errors);
      const firstError = Object.keys(errors)[0] as keyof NewPlayerForm | undefined;
      if (firstError) document.getElementById(playerFieldIds[firstError])?.focus();
      return;
    }

    setRosterPlayers((current) => [
      ...current,
      {
        id: `local-player-${current.length + 1}`,
        fullName: newPlayerForm.fullName.trim(),
        number: Number(newPlayerForm.number),
        position: newPlayerForm.position,
      },
    ]);
    setNewPlayerForm(initialNewPlayerForm);
    setNewPlayerErrors({});
    closePlayerModal();
  };

  const removePlayer = (playerId: string) => {
    setRosterPlayers((current) => current.filter((player) => player.id !== playerId));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clubName = form.clubName.trim();
    const coach = form.coach.trim();

    // FA-02: duplicate name. Checked first, in the design's order.
    if (ADMIN.teams.some((team) => team.name.toLocaleLowerCase("es-ES") === clubName.toLocaleLowerCase("es-ES"))) {
      setClubStatus(null);
      setClubError("Ya existe un equipo con ese nombre.");
      return;
    }

    // FA-01: incomplete data.
    if (!clubName || !coach) {
      setClubStatus(null);
      setClubError("Completá el nombre del club y el entrenador.");
      return;
    }

    setClubError(null);
    setClubStatus("Equipo preparado localmente con estado Activo. No se guardó nada.");
  };

  return (
    <div>
      <PageHeader
        actions={
          <Link className={buttonClasses("ghost")} to={"/admin/teams" as string}>
            ← Volver
          </Link>
        }
        className="mb-[22px]"
        description="Registrá un club con su entrenador y su plantel de jugadores."
        title="Crear equipo"
      />

      <form noValidate onSubmit={handleSubmit}>
        <Card padded={false}>
          <CardHeader>
            Datos del club
            <small>OBLIGATORIO</small>
          </CardHeader>
          <CardBody data-testid="create-team-club-card-body">
            {/* Design: voleytrack-admin.css:175-176 `.form-grid` — two columns with an 18px
                gap, one column below 900px; `.field.full` spans both. The design's third field
                (`Escudo`) is not rendered; see the module note. */}
            <div className="grid gap-[18px] min-[901px]:grid-cols-2">
              <Field full id="team-club-name" label="Nombre del club">
                <input
                  className={fieldControlClasses}
                  name="clubName"
                  onChange={(event) => updateField("clubName", event.target.value)}
                  placeholder="Ej: UPCN San Juan"
                  value={form.clubName}
                />
              </Field>
              <Field id="team-coach" label="Entrenador">
                <input
                  className={fieldControlClasses}
                  name="coach"
                  onChange={(event) => updateField("coach", event.target.value)}
                  placeholder="Ej: Juan Pérez"
                  value={form.coach}
                />
              </Field>
            </div>
          </CardBody>
        </Card>

        <Card className="mt-4" padded={false}>
          <CardHeader>
            Plantel
            <small>JUGADORES</small>
          </CardHeader>
          <CardBody data-testid="create-team-roster-card-body">
            {rosterPlayers.length === 0 ? (
              /* Design: voleytrack-admin.css:273 `.squad-empty`. */
              <p
                className="m-0 rounded-[14px] border border-dashed border-vt-border px-6 py-6 text-center text-[13px] text-vt-muted"
                role="status"
              >
                Todavía no cargaste jugadores. Usá &quot;+ Agregar jugador&quot; para incorporar el plantel.
              </p>
            ) : (
              /* Design: voleytrack-admin.css:266-272 `.squad-list` / `.squad-item` /
                 `.num-badge` / `.squad-remove`. */
              <ul className="m-0 flex list-none flex-col gap-2 p-0" data-testid="create-team-squad-list">
                {rosterPlayers.map((player) => (
                  <li
                    className="flex items-center gap-3 rounded-xl border border-vt-border-2 bg-vt-background p-[10px] pl-3"
                    data-testid="create-team-squad-item"
                    key={player.id}
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-[30px] shrink-0 place-items-center rounded-[9px] bg-vt-accent font-mono text-[12px] font-extrabold text-vt-background"
                    >
                      {player.number}
                    </span>
                    <div className="min-w-0">
                      <b className="block text-[13px] leading-[1.2] text-vt-text">{player.fullName}</b>
                      <small className="block text-[11px] text-vt-muted">
                        {player.position} · Dorsal #{player.number}
                      </small>
                    </div>
                    <button
                      aria-label={`Quitar a ${player.fullName} del plantel`}
                      className="ml-auto grid size-[30px] shrink-0 place-items-center rounded-full border border-vt-border bg-vt-background text-[15px] leading-none text-vt-muted transition-colors hover:border-vt-danger hover:text-vt-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                      onClick={() => removePlayer(player.id)}
                      type="button"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-[14px]">
              <Button onClick={openPlayerModal} variant="ghost">
                <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Agregar jugador
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Design: voleytrack-admin.css:276 `.error-msg` — the danger 13px/600 line. */}
        {clubError ? (
          <p
            className="mt-3 min-h-4 text-[13px] font-semibold text-vt-danger"
            role="alert"
          >
            {clubError}
          </p>
        ) : null}

        {clubStatus ? (
          /* Design: voleytrack-admin.css:191-192 `.form-status.success`, the app's own
             "nothing was saved" report (the prototype's `toast` + redirect would claim a
             save this screen does not make). */
          <p
            aria-live="polite"
            className="mt-3 rounded-vt-md border border-vt-success-soft-border bg-vt-success-soft px-[14px] py-3 text-[13px] font-bold text-vt-success-soft-text"
            role="status"
          >
            {clubStatus}
          </p>
        ) : null}

        {/* Design: voleytrack-admin.css:187 `.form-actions` — 22px above, an 18px --border-2
            rule, a 10px gap and right alignment. */}
        <div className="mt-[22px] flex flex-wrap justify-end gap-2.5 border-t border-vt-border-2 pt-[18px]">
          <Link className={buttonClasses("ghost")} to={"/admin/teams" as string}>
            Cancelar
          </Link>
          <Button type="submit">Crear</Button>
        </div>
      </form>

      <Modal
        closeLabel="Cerrar"
        description="Integrante del plantel"
        footer={
          <>
            <Button onClick={closePlayerModal} variant="ghost">
              Cancelar
            </Button>
            <Button form={playerFormId} type="submit">
              Agregar
            </Button>
          </>
        }
        isOpen={isPlayerModalOpen}
        onClose={closePlayerModal}
        title="Crear jugador"
      >
        <form className="grid gap-[18px]" id={playerFormId} noValidate onSubmit={handleAddPlayer}>
          <Field error={newPlayerErrors.fullName} id={playerFieldIds.fullName} label="Nombre">
            <input
              aria-required="true"
              className={fieldControlClasses}
              onChange={(event) => updateNewPlayerField("fullName", event.target.value)}
              placeholder="Ej: Fernández, M."
              value={newPlayerForm.fullName}
            />
          </Field>
          <Field error={newPlayerErrors.number} id={playerFieldIds.number} label="Dorsal">
            <input
              aria-required="true"
              className={fieldControlClasses}
              max="99"
              min="1"
              onChange={(event) => updateNewPlayerField("number", event.target.value)}
              placeholder="7"
              type="number"
              value={newPlayerForm.number}
            />
          </Field>
          <Field error={newPlayerErrors.position} id={playerFieldIds.position} label="Posición">
            <select
              aria-required="true"
              className={fieldControlClasses}
              onChange={(event) => updateNewPlayerField("position", event.target.value)}
              value={newPlayerForm.position}
            >
              <option value="">Seleccionar posición</option>
              {positionOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </Field>
          {Object.keys(newPlayerErrors).length > 0 ? (
            <p aria-live="assertive" className="m-0 text-[13px] font-semibold text-vt-danger" role="alert">
              Completá los campos obligatorios antes de agregar el jugador.
            </p>
          ) : null}
        </form>
      </Modal>
    </div>
  );
}
