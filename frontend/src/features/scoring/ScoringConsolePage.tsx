import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Modal } from "../../components/primitives/Modal";
import { Badge } from "../../components/ui/Badge";
import { SectionShell } from "../../components/ui/SectionShell";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS, SCORING } from "../../fixtures";

export function ScoringConsolePage() {
  const fixture = SCORING.console;
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate({ from: "/admin/matches/$id/scoring" });
  const [score, setScore] = useState(fixture.score);
  const [leavingPlayerId, setLeavingPlayerId] = useState("");
  const [enteringPlayerId, setEnteringPlayerId] = useState("");
  const isSubstitutionOpen = location.search.modal === "substitution";
  const substitutionTeam = PUBLIC_TEAMS.find((team) => team.id === fixture.homeTeamId);
  const substitutionPlayers = PUBLIC_PLAYERS.filter((player) => player.teamId === fixture.homeTeamId);

  const recordPoint = (team: "home" | "away") => {
    setScore((current) => ({ ...current, [team]: current[team] + 1 }));
  };

  const setSubstitutionOpen = (open: boolean) => {
    navigate({
      search: (previous) => {
        const next = { ...previous };
        if (open) {
          next.modal = "substitution";
        } else {
          delete next.modal;
        }
        return next;
      },
    });
  };

  return (
    <SectionShell
      eyebrow="Planillero"
      title={fixture.title}
      description="Registrá los puntos del partido desde la planilla local."
      actions={<Badge tone="success">{fixture.statusLabel}</Badge>}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-vt-border bg-vt-raised p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Partido en curso</p>
            <p className="mt-2 text-sm text-vt-text">{fixture.currentSetLabel}</p>
          </div>
          <p className="text-sm text-vt-muted">Solo visualización local</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: "home" as const, name: fixture.homeTeamName, value: score.home },
            { key: "away" as const, name: fixture.awayTeamName, value: score.away },
          ].map((team) => (
            <div className="rounded-2xl border border-vt-border bg-vt-raised p-6 text-center" key={team.key}>
              <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Equipo</p>
              <h2 className="mt-2 text-xl font-bold text-vt-text">{team.name}</h2>
              <p aria-label={`Puntaje de ${team.name}`} className="mt-5 text-6xl font-black text-vt-accent">
                {team.value}
              </p>
              <button
                aria-label={`Anotar punto para ${team.name}`}
                className="mt-5 rounded-lg bg-vt-accent px-5 py-3 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                onClick={() => recordPoint(team.key)}
                type="button"
              >
                Anotar punto
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-vt-border bg-vt-raised p-5">
          <h2 className="text-lg font-bold text-vt-text">Sets del partido</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {fixture.sets.map((set) => (
              <div className="rounded-xl border border-vt-border/70 bg-black/20 p-4" key={set.id}>
                <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">{set.label}</p>
                <p className="mt-2 text-xl font-bold text-vt-text">{set.home} - {set.away}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {fixture.actionLabels.map((label) => (
            <button
              className="rounded-lg border border-vt-border bg-vt-raised px-4 py-2 text-sm font-semibold text-vt-text hover:border-vt-accent"
              key={label}
              onClick={label === "Sustitución" ? () => setSubstitutionOpen(true) : undefined}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isSubstitutionOpen}
        onClose={() => setSubstitutionOpen(false)}
        title="Sustitución - Equipo Local"
      >
        <p className="mb-5 text-sm text-vt-muted">
          Seleccioná quién entra a la cancha y quién va a la banca.
        </p>
        <p className="mb-5 text-sm font-semibold text-vt-text">
          {substitutionTeam?.name ?? fixture.homeTeamName}
        </p>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-vt-text" htmlFor="substitution-leaving-player">
            Jugador que SALE (en cancha)
            <select
              aria-label="Jugador que SALE (en cancha)"
              className="rounded-lg border border-vt-border bg-vt-surface px-3 py-2 text-sm font-normal text-vt-text"
              id="substitution-leaving-player"
              onChange={(event) => setLeavingPlayerId(event.target.value)}
              value={leavingPlayerId}
            >
              <option value="">Seleccioná un jugador</option>
              {substitutionPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} {player.fullName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-vt-text" htmlFor="substitution-entering-player">
            Jugador que ENTRA (banca)
            <select
              aria-label="Jugador que ENTRA (banca)"
              className="rounded-lg border border-vt-border bg-vt-surface px-3 py-2 text-sm font-normal text-vt-text"
              id="substitution-entering-player"
              onChange={(event) => setEnteringPlayerId(event.target.value)}
              value={enteringPlayerId}
            >
              <option value="">Seleccioná un jugador</option>
              {substitutionPlayers.map((player) => (
                <option key={player.id} value={player.id}>
                  #{player.number} {player.fullName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-lg border border-vt-border bg-vt-surface px-4 py-2 text-sm font-semibold text-vt-text hover:border-vt-accent"
            onClick={() => setSubstitutionOpen(false)}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            onClick={() => setSubstitutionOpen(false)}
            type="button"
          >
            Confirmar Sustitución
          </button>
        </div>
      </Modal>
    </SectionShell>
  );
}
