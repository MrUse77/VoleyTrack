import { useRef, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { Modal } from "../../components/primitives/Modal";
import { Badge } from "../../components/primitives/Badge";
import { PageHeader } from "../../components/primitives/PageHeader";
import { SCORING, SCORING_ROSTER } from "../../fixtures";
import { PlayerSelectionModal } from "./PlayerSelectionModal";

const ROTATION_POSITIONS = [4, 3, 2, 5, 6, 1] as const;
type AssignmentTarget = { position: number; teamId: string } | null;

export function MatchSetupPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate({ from: "/admin/matches/setup" });
  // Design: the pack's setup view gives its heading `tabindex="-1"` and moves focus to it
  // (frontend/design/html/voleytrack-planillero.html:25). `PageHeader` renders that focus
  // target only when a caller supplies `headingRef`, so the ref is what keeps the pack's
  // contract on this screen; the heading is programmatically focusable, not auto-focused.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const setup = SCORING.matchSetup;
  const teams = [setup.homeTeam, setup.awayTeam];
  const [stepIndex, setStepIndex] = useState(0);
  const [assignmentTarget, setAssignmentTarget] = useState<AssignmentTarget>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [hasContinued, setHasContinued] = useState(false);
  const isPlayerSelectionOpen = location.search.modal === "player-selection";
  const step = setup.steps[stepIndex];
  const isLastStep = stepIndex === setup.steps.length - 1;
  const targetTeam = assignmentTarget
    ? teams.find((team) => team.id === assignmentTarget.teamId)
    : undefined;
  const targetPlayerId = assignmentTarget
    ? assignments[`${assignmentTarget.teamId}-${assignmentTarget.position}`]
    : undefined;
  const targetTeamPlayers = targetTeam
    ? SCORING_ROSTER.filter((player) => player.teamId === targetTeam.id)
    : [];

  const assignmentKey = (teamId: string, position: number) => `${teamId}-${position}`;

  const assignedPlayer = (teamId: string, position: number) => {
    const playerId = assignments[assignmentKey(teamId, position)];
    return SCORING_ROSTER.find((player) => player.id === playerId);
  };

  const assignedPositionForPlayer = (teamId: string, playerId: string, excludedPosition?: number) =>
    ROTATION_POSITIONS.find(
      (position) => position !== excludedPosition && assignments[assignmentKey(teamId, position)] === playerId,
    );

  const assignedPositionCount = (teamId: string) =>
    ROTATION_POSITIONS.filter((position) => assignedPlayer(teamId, position)).length;

  const isLineupComplete = teams.every(
    (team) => assignedPositionCount(team.id) === ROTATION_POSITIONS.length,
  );
  const assignedSlotCount = teams.reduce((total, team) => total + assignedPositionCount(team.id), 0);
  const missingPositionCount = teams.length * ROTATION_POSITIONS.length - assignedSlotCount;
  const statusMessage = hasContinued
    ? "Listo para continuar con la planilla."
    : isConfirmed
      ? "Configuración confirmada."
      : isLineupComplete
        ? "Las alineaciones completas están listas para confirmar."
        : `Faltan posiciones por asignar: ${missingPositionCount}.`;

  const setPlayerSelectionOpen = (open: boolean) => {
    navigate({
      search: (previous) => {
        const next = { ...previous };
        if (open) {
          next.modal = "player-selection";
        } else {
          delete next.modal;
        }
        return next;
      },
    });
  };

  const assignPlayer = (playerId: string) => {
    if (!assignmentTarget || !targetTeam) return;

    const playerBelongsToTeam = targetTeamPlayers.some((player) => player.id === playerId);
    const alreadyAssignedPosition = assignedPositionForPlayer(
      targetTeam.id,
      playerId,
      assignmentTarget.position,
    );
    if (!playerBelongsToTeam || alreadyAssignedPosition !== undefined) return;

    setAssignments((current) => ({
      ...current,
      [assignmentKey(assignmentTarget.teamId, assignmentTarget.position)]: playerId,
    }));
    setIsConfirmed(false);
    setHasContinued(false);
    setAssignmentTarget(null);
  };

  const clearAssignment = () => {
    if (!assignmentTarget) return;

    setAssignments((current) => {
      const next = { ...current };
      delete next[assignmentKey(assignmentTarget.teamId, assignmentTarget.position)];
      return next;
    });
    setIsConfirmed(false);
    setHasContinued(false);
    setAssignmentTarget(null);
  };

  const goToNextStep = () => {
    if (isLastStep || (stepIndex === 0 && !isLineupComplete)) return;
    setStepIndex((current) => Math.min(current + 1, setup.steps.length - 1));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description={step.description}
        eyebrow="Planillero"
        headingRef={headingRef}
        title={setup.title}
      />
      <Card className="border-vt-border p-5" variant="raised">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">
              Paso {stepIndex + 1} de {setup.steps.length}
            </p>
            <h2 className="mt-2 text-xl font-bold text-vt-text">{step.label}</h2>
            <p className="mt-1 text-sm text-vt-muted">{step.description}</p>
          </div>
          <Badge tone="accent">Configuración local</Badge>
        </div>
      </Card>

      {step.id === "setup-step-teams" && (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-2">
            {teams.map((team) => (
              <Card className="border-vt-border p-5" key={team.id} variant="raised">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Alineación titular</p>
                    <h2 className="mt-2 text-xl font-bold text-vt-text">{`Alineación titular - ${team.name}`}</h2>
                  </div>
                  <Badge tone="muted">{team.shortName}</Badge>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2" aria-label={`Posiciones de ${team.name}`} role="group">
                  {ROTATION_POSITIONS.map((position) => {
                    const player = assignedPlayer(team.id, position);
                    return (
                      <button
                        aria-label={`Asignar jugador a ${team.name}, posición ${position}`}
                        aria-pressed={Boolean(player)}
                        className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                          player
                            ? "border-vt-accent bg-vt-accent/15 text-vt-text"
                            : "border-vt-border bg-vt-surface text-vt-muted hover:border-vt-accent"
                        }`}
                        data-testid={`setup-position-${team.id}-${position}`}
                        key={position}
                        onClick={() => {
                          setAssignmentTarget({ position, teamId: team.id });
                          setHasContinued(false);
                        }}
                        type="button"
                      >
                        <span>{`Posición ${position}: ${player?.fullName ?? "Seleccionar"}`}</span>
                        {player ? <span className="shrink-0 text-xs text-vt-muted">#{player.number}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>

          <Card aria-labelledby="rotation-preview-title" className="border-vt-border p-5" variant="raised">
            <h2 className="text-lg font-bold text-vt-text" id="rotation-preview-title">Vista previa de rotaciones</h2>
            <p className="mt-1 text-sm text-vt-muted">
              Revisá la posición de cada titular antes de continuar con la planilla.
            </p>
            <div
              aria-label="Cancha de vóley con dos mitades, red central, líneas de ataque y seis posiciones por equipo"
              className="relative mt-5 overflow-hidden rounded-xl border-2 border-vt-border bg-vt-surface p-3 sm:p-4"
              data-testid="rotation-court"
              role="img"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-1/2 z-20 h-1 -translate-y-1/2 bg-vt-accent md:inset-y-3 md:left-1/2 md:right-auto md:top-3 md:h-auto md:w-1 md:-translate-x-1/2 md:translate-y-0"
                data-testid="court-net"
              />
              <div className="relative grid gap-4 md:grid-cols-2 md:gap-0">
                {teams.map((team, teamIndex) => (
                  <div
                    className={`relative min-h-[22rem] rounded-xl border-2 border-vt-accent/40 bg-vt-panel/40 p-3 sm:p-4 ${
                      teamIndex === 0 ? "md:rounded-l-xl md:rounded-r-none md:border-r-0" : "md:rounded-l-none md:rounded-r-xl md:border-l-0"
                    }`}
                    data-testid={`court-half-${team.id}`}
                    key={team.id}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-4 top-[42%] z-10 border-t-2 border-dashed border-vt-accent/70"
                      data-testid={`court-attack-line-${team.id}`}
                    />
                    <div className="relative z-10 flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.12em] text-vt-muted">
                      <span>{team.name}</span>
                      <span>{teamIndex === 0 ? "Local" : "Visitante"}</span>
                    </div>
                    <div className="relative z-10 mt-4 grid h-[17rem] grid-cols-3 grid-rows-2 gap-2">
                      {ROTATION_POSITIONS.map((position) => {
                        const player = assignedPlayer(team.id, position);
                        return (
                          <div
                            aria-label={`Posición ${position}: ${player?.fullName ?? "Sin asignar"}`}
                            className="flex min-w-0 items-center justify-center rounded-lg border border-vt-border/70 bg-vt-surface/90 p-2 text-center"
                            data-testid={`court-position-${team.id}-${position}`}
                            key={position}
                          >
                            <div className="min-w-0">
                              <span className="mx-auto flex size-8 items-center justify-center rounded-full bg-vt-accent text-xs font-bold text-vt-background">
                                {position}
                              </span>
                              <span className="mt-2 block truncate text-[11px] text-vt-text">
                                {player?.fullName ?? "Sin asignar"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <span className="absolute left-1/2 top-[42%] z-10 -translate-x-1/2 -translate-y-1/2 bg-vt-panel px-1 text-[10px] uppercase tracking-[0.12em] text-vt-muted">
                      Línea de ataque
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-vt-muted">
              La vista mantiene el contexto de rotación local y no guarda cambios fuera de esta pantalla.
            </p>
          </Card>
        </div>
      )}

      {step.id === "setup-step-sets" && (
        <Card className="border-vt-border p-5 text-sm text-vt-muted" variant="raised">
          <p>{setup.scheduledLabel}</p>
          <p className="mt-2">{setup.venue}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {teams.map((team) => (
              <div className="rounded-xl border border-vt-border bg-vt-surface p-4" key={team.id}>
                <p className="font-semibold text-vt-text">{team.name}</p>
                <p className="mt-1 text-xs text-vt-muted">{assignedPositionCount(team.id)} de 6 posiciones asignadas</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {step.id === "setup-step-confirm" && (
        <Card className="border-vt-border p-5" variant="raised">
          <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Resumen de configuración</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {teams.map((team) => (
              <div className="rounded-xl border border-vt-border bg-vt-surface p-4" key={team.id}>
                <p className="font-semibold text-vt-text">{team.name}</p>
                <p className="mt-1 text-sm text-vt-muted">{assignedPositionCount(team.id)} de 6 posiciones asignadas</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-vt-muted">{setup.tournamentName} · {setup.scheduledLabel} · {setup.venue}</p>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          onClick={() => setPlayerSelectionOpen(true)}
          type="button"
        >
          Seleccionar jugadores
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            aria-describedby="setup-actions-status"
            aria-label="Confirmar alineaciones"
            className="rounded-lg border border-vt-accent bg-vt-accent/15 px-4 py-2 text-sm font-semibold text-vt-accent hover:bg-vt-accent/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!isLineupComplete || isConfirmed}
            onClick={() => {
              if (!isLineupComplete) return;
              setIsConfirmed(true);
              setHasContinued(false);
            }}
            type="button"
          >
            {isConfirmed ? "Alineaciones confirmadas" : "Confirmar alineaciones"}
          </button>
          <button
            aria-describedby="setup-actions-status"
            className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLastStep || (stepIndex === 0 && !isLineupComplete)}
            onClick={goToNextStep}
            type="button"
          >
            Siguiente
          </button>
          {isLastStep ? (
            <button
              aria-describedby="setup-actions-status"
              aria-label="Continuar a la planilla"
              className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isLastStep || !isLineupComplete || !isConfirmed}
              onClick={() => {
                if (!isLineupComplete || !isConfirmed) return;
                setHasContinued(true);
              }}
              type="button"
            >
              Continuar a la planilla
            </button>
          ) : null}
        </div>
      </div>

      <p
        aria-atomic="true"
        aria-live="polite"
        className={`text-sm font-semibold ${isLineupComplete || isConfirmed ? "text-vt-success" : "text-vt-muted"}`}
        id="setup-actions-status"
        role="status"
      >
        {statusMessage}
      </p>

      <Modal
        isOpen={Boolean(assignmentTarget && targetTeam)}
        onClose={() => setAssignmentTarget(null)}
        title={targetTeam && assignmentTarget ? `Seleccionar jugador · ${targetTeam.name} · Posición ${assignmentTarget.position}` : "Seleccionar jugador"}
      >
        {targetTeam && assignmentTarget ? (
          <>
            <p className="mb-5 text-sm text-vt-muted">
              Elegí el jugador que ocupará esta posición. Cada jugador puede ocupar una sola posición; los ya asignados aparecen deshabilitados. La asignación actual permanece disponible para editarla.
            </p>
            <div aria-label={`Jugadores disponibles de ${targetTeam.name}`} className="grid gap-2" role="group">
              {targetTeamPlayers.map((player) => {
                const assignedElsewherePosition = assignedPositionForPlayer(
                  targetTeam.id,
                  player.id,
                  assignmentTarget.position,
                );
                const isUnavailable = assignedElsewherePosition !== undefined;
                return (
                  <button
                    aria-label={isUnavailable
                      ? `${player.fullName} no disponible: ya asignada a posición ${assignedElsewherePosition}`
                      : `Asignar jugador ${player.fullName} a posición ${assignmentTarget.position}`}
                    aria-pressed={targetPlayerId === player.id}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                      targetPlayerId === player.id
                        ? "border-vt-accent bg-vt-accent/15 text-vt-text"
                        : "border-vt-border bg-vt-surface text-vt-text hover:border-vt-accent"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                    data-player-id={player.id}
                    disabled={isUnavailable}
                    key={player.id}
                    onClick={() => assignPlayer(player.id)}
                    type="button"
                  >
                    <span>{player.fullName}</span>
                    <span className="text-xs text-vt-muted">#{player.number} · {player.position}</span>
                    {isUnavailable ? <span className="text-xs text-vt-muted">Ya asignada a posición {assignedElsewherePosition}</span> : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                className="rounded-lg border border-vt-border bg-vt-surface px-4 py-2 text-sm font-semibold text-vt-text hover:border-vt-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!targetPlayerId}
                onClick={clearAssignment}
                type="button"
              >
                Quitar asignación
              </button>
            </div>
          </>
        ) : null}
      </Modal>

      <PlayerSelectionModal
        isOpen={isPlayerSelectionOpen}
        onClose={() => setPlayerSelectionOpen(false)}
      />
    </div>
  );
}
