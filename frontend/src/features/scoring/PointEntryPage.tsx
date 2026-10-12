import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Button } from "../../components/primitives/Button";
import { Card } from "../../components/primitives/Card";
import { Badge } from "../../components/primitives/Badge";
import { PageHeader } from "../../components/primitives/PageHeader";
import { PUBLIC_PLAYERS, POINT_TYPES, SCORING } from "../../fixtures";

export function PointEntryPage() {
  const fixture = SCORING.pointEntry;
  const location = useLocation() as { search: Record<string, unknown> };
  const initialStepIndex = fixture.steps.findIndex((step) => step.id === location.search.step);
  const [stepIndex, setStepIndex] = useState(initialStepIndex < 0 ? 0 : initialStepIndex);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedPointType, setSelectedPointType] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const step = fixture.steps[stepIndex];
  const isConfirmationStep = step.id === "point-step-confirm";
  const selectedTeam = [
    { id: SCORING.console.homeTeamId, name: SCORING.console.homeTeamName, side: "Local" },
    { id: SCORING.console.awayTeamId, name: SCORING.console.awayTeamName, side: "Visita" },
  ].find((team) => team.id === selectedTeamId);
  const selectedTeamPlayers = selectedTeam
    ? PUBLIC_PLAYERS.filter((player) => player.teamId === selectedTeam.id)
    : [];
  const selectedPlayer = selectedTeamPlayers.find((player) => player.id === selectedPlayerId);
  const canAdvance = stepIndex === 0
    ? selectedTeamId !== null
    : stepIndex === 1
      ? selectedPlayerId !== null
      : stepIndex === 2
        ? selectedPointType !== null
        : selectedTeamId !== null && selectedPlayerId !== null && selectedPointType !== null;

  const teams = [
    { id: SCORING.console.homeTeamId, name: SCORING.console.homeTeamName, side: "Local" },
    { id: SCORING.console.awayTeamId, name: SCORING.console.awayTeamName, side: "Visita" },
  ];

  const selectTeam = (teamId: string) => {
    if (selectedTeamId !== teamId) {
      setSelectedPlayerId(null);
      setSelectedPointType(null);
      setIsConfirmed(false);
    }
    setSelectedTeamId(teamId);
  };

  const selectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setIsConfirmed(false);
  };

  const selectPointType = (pointType: string) => {
    setSelectedPointType(pointType);
    setIsConfirmed(false);
  };

  const goToPreviousStep = () => {
    setIsConfirmed(false);
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const goToNextStep = () => {
    if (!canAdvance) return;
    if (isConfirmationStep) {
      setIsConfirmed(true);
      return;
    }
    setStepIndex((current) => Math.min(current + 1, fixture.steps.length - 1));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description={step.description}
        eyebrow="Planillero"
        title={fixture.title}
      />
      <nav aria-label="Progreso del registro de punto">
        <ol className="grid gap-2 sm:grid-cols-4">
          {fixture.steps.map((progressStep, index) => {
            const isCurrent = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <li key={progressStep.id}>
                <button
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Paso ${index + 1}: ${progressStep.label}`}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                    isCurrent
                      ? "border-vt-accent bg-vt-accent/15 text-vt-accent"
                      : isCompleted
                        ? "border-vt-success/40 bg-vt-success/10 text-vt-success hover:border-vt-accent"
                        : "border-vt-border bg-vt-surface text-vt-muted"
                  }`}
                  disabled={index > stepIndex}
                  onClick={() => {
                    if (index <= stepIndex) {
                      setIsConfirmed(false);
                      setStepIndex(index);
                    }
                  }}
                  type="button"
                >
                  <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-[10px]">
                    {index + 1}
                  </span>
                  <span>{progressStep.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <Card className="border-vt-border p-5" variant="raised">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">
              Paso {stepIndex + 1} de {fixture.steps.length}
            </p>
            <h2 className="mt-2 text-xl font-bold text-vt-text">{step.label}</h2>
            <p className="mt-1 text-sm text-vt-muted">{step.description}</p>
          </div>
          <Badge tone={isConfirmed ? "success" : "accent"}>{isConfirmed ? "Confirmado" : "En curso"}</Badge>
        </div>
      </Card>

      {step.id === "point-step-team" && (
        <Card className="border-vt-border p-5" variant="raised">
          <p className="text-sm text-vt-muted">Seleccioná el equipo que ganó este punto.</p>
          <div aria-label="Equipos que pueden anotar" className="mt-5 grid gap-4 sm:grid-cols-2" role="group">
            {teams.map((team) => (
              <button
                aria-label={`Seleccionar ${team.name}`}
                aria-pressed={selectedTeamId === team.id}
                className={`min-h-28 rounded-xl border p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                  selectedTeamId === team.id
                    ? "border-vt-accent bg-vt-accent text-vt-background"
                    : "border-vt-border bg-vt-surface text-vt-text hover:border-vt-accent"
                }`}
                key={team.id}
                onClick={() => selectTeam(team.id)}
                type="button"
              >
                <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-70">{team.side}</span>
                <span className="mt-2 block text-lg font-bold">{team.name}</span>
              </button>
            ))}
          </div>
        </Card>
      )}

      {step.id === "point-step-action" && (
        <Card className="border-vt-border p-5" variant="raised">
          <p className="text-sm text-vt-muted">
            {selectedTeam ? `Jugadores titulares de ${selectedTeam.name}:` : "Primero seleccioná el equipo que anota."}
          </p>
          {selectedTeam ? (
            <div aria-label={`Jugadores titulares de ${selectedTeam.name}`} className="mt-5 grid gap-3 sm:grid-cols-2" role="group">
              {selectedTeamPlayers.length > 0 ? selectedTeamPlayers.map((player) => (
                <button
                  aria-label={`Seleccionar ${player.fullName}`}
                  aria-pressed={selectedPlayerId === player.id}
                  className={`flex min-h-20 items-center justify-between rounded-xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                    selectedPlayerId === player.id
                      ? "border-vt-accent bg-vt-accent text-vt-background"
                      : "border-vt-border bg-vt-surface text-vt-text hover:border-vt-accent"
                  }`}
                  key={player.id}
                  onClick={() => selectPlayer(player.id)}
                  type="button"
                >
                  <span>
                    <span className="block font-semibold">{player.fullName}</span>
                    <span className="mt-1 block text-xs opacity-75">#{player.number} · {player.position}</span>
                  </span>
                  <span aria-hidden="true" className="text-lg">{selectedPlayerId === player.id ? "✓" : "→"}</span>
                </button>
              )) : (
                <p className="rounded-lg border border-vt-border bg-vt-surface p-4 text-sm text-vt-muted">
                  No hay jugadores titulares disponibles para este equipo.
                </p>
              )}
            </div>
          ) : null}
        </Card>
      )}

      {step.id === "point-step-type" && (
        <Card className="border-vt-border p-5" variant="raised">
          <p className="text-sm text-vt-muted">Elegí el tipo de punto que describe la acción.</p>
          <div aria-label="Tipos de punto" className="mt-5 grid gap-3 sm:grid-cols-2" role="group">
            {POINT_TYPES.map((pointType) => (
              <button
                aria-label={`Seleccionar tipo de punto: ${pointType}`}
                aria-pressed={selectedPointType === pointType}
                className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                  selectedPointType === pointType
                    ? "border-vt-accent bg-vt-accent text-vt-background"
                    : "border-vt-border bg-vt-surface text-vt-text hover:border-vt-accent"
                }`}
                key={pointType}
                onClick={() => selectPointType(pointType)}
                type="button"
              >
                {pointType}
              </button>
            ))}
          </div>
        </Card>
      )}

      {step.id === "point-step-confirm" && (
        <Card className="border-vt-border p-5" variant="raised">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-vt-muted">Punto a registrar</p>
          <p className="mt-3 text-xl font-bold text-vt-text">
            {selectedTeam?.name ?? "Equipo sin seleccionar"} +1
          </p>
          <dl className="mt-5 grid gap-3 border-t border-vt-border pt-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-vt-muted">Equipo que anota</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedTeam?.name ?? "Sin seleccionar"}</dd>
            </div>
            <div>
              <dt className="text-vt-muted">Jugador</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedPlayer?.fullName ?? "Sin seleccionar"}</dd>
            </div>
            <div>
              <dt className="text-vt-muted">Tipo de punto</dt>
              <dd className="mt-1 font-semibold text-vt-text">{selectedPointType ?? "Sin seleccionar"}</dd>
            </div>
          </dl>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button aria-label="Paso anterior" disabled={stepIndex === 0} onClick={goToPreviousStep} variant="ghost">
          Anterior
        </Button>
        <Button
          aria-label={isConfirmationStep ? "Confirmar punto" : "Siguiente paso"}
          disabled={!canAdvance || (isConfirmationStep && isConfirmed)}
          onClick={goToNextStep}
        >
          {isConfirmationStep ? "Confirmar punto" : "Siguiente"}
        </Button>
      </div>

      {isConfirmed ? (
        <p aria-live="polite" className="text-sm font-semibold text-vt-success" role="status">
          Punto confirmado localmente. La persistencia se implementará en una fase posterior.
        </p>
      ) : null}
    </div>
  );
}
