import { useMemo, useState } from "react";
import { Modal } from "../../components/primitives/Modal";
import { PUBLIC_TEAMS, SCORING_ROSTER } from "../../fixtures";

interface PlayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerSelectionModal({ isOpen, onClose }: PlayerSelectionModalProps) {
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const playersByTeam = useMemo(
    () => PUBLIC_TEAMS.map((team) => ({
      team,
      players: SCORING_ROSTER.filter((player) => player.teamId === team.id),
    })),
    [],
  );

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Seleccionar jugadores">
      <p className="mb-5 text-sm text-vt-muted">
        Elegí los jugadores que participan de este partido.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {playersByTeam.map(({ team, players }) => (
          <fieldset className="rounded-xl border border-vt-border bg-vt-surface p-4" key={team.id}>
            <legend className="px-1 text-sm font-semibold text-vt-text">{team.name}</legend>
            <div className="mt-3 space-y-2">
              {players.map((player) => (
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
          </fieldset>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-xs text-vt-muted">{selectedPlayerIds.length} seleccionados</span>
        <button
          className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          onClick={onClose}
          type="button"
        >
          Confirmar selección
        </button>
      </div>
    </Modal>
  );
}
