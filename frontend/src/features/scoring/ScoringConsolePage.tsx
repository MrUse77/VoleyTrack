import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Modal } from "../../components/primitives/Modal";
import { Badge } from "../../components/primitives/Badge";
import { PageHeader } from "../../components/primitives/PageHeader";
import { PUBLIC_TEAMS, SCORING, SCORING_ROSTER } from "../../fixtures";

type TeamKey = "home" | "away";

const COURT_POSITIONS = [
  { label: "Posición 4", description: "Delantera izquierda" },
  { label: "Posición 3", description: "Delantera central" },
  { label: "Posición 2", description: "Delantera derecha" },
  { label: "Posición 5", description: "Defensa izquierda" },
  { label: "Posición 6", description: "Defensa central" },
  { label: "Posición 1", description: "Defensa derecha" },
] as const;

export function ScoringConsolePage() {
  const fixture = SCORING.console;
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate({ from: "/admin/matches/$id/scoring" });
  const [score, setScore] = useState(fixture.score);
  const [pointHistory, setPointHistory] = useState<TeamKey[]>([]);
  const [announcement, setAnnouncement] = useState("Listo para registrar el próximo punto.");
  const [leavingPlayerId, setLeavingPlayerId] = useState("");
  const [enteringPlayerId, setEnteringPlayerId] = useState("");
  const isSubstitutionOpen = location.search.modal === "substitution";
  const substitutionTeam = PUBLIC_TEAMS.find((team) => team.id === fixture.homeTeamId);
  const substitutionPlayers = SCORING_ROSTER.filter((player) => player.teamId === fixture.homeTeamId);
  const currentSetIndex = fixture.sets.findIndex((set) => set.label === fixture.currentSetLabel);
  const completedSets = currentSetIndex < 0 ? fixture.sets : fixture.sets.slice(0, currentSetIndex);
  const setsWon = completedSets.reduce(
    (totals, set) => ({
      home: totals.home + (set.home > set.away ? 1 : 0),
      away: totals.away + (set.away > set.home ? 1 : 0),
    }),
    { home: 0, away: 0 },
  );
  const courtTeams = [
    {
      key: "home" as const,
      name: fixture.homeTeamName,
      players: SCORING_ROSTER.filter((player) => player.teamId === fixture.homeTeamId).slice(0, COURT_POSITIONS.length),
    },
    {
      key: "away" as const,
      name: fixture.awayTeamName,
      players: SCORING_ROSTER.filter((player) => player.teamId === fixture.awayTeamId).slice(0, COURT_POSITIONS.length),
    },
  ];
  const substitutionLabel = fixture.actionLabels.find((label) => label === "Sustitución") ?? "Sustitución";
  const canUndo = pointHistory.length > 0;
  const canConfirmSubstitution = Boolean(
    leavingPlayerId && enteringPlayerId && leavingPlayerId !== enteringPlayerId,
  );

  const recordPoint = (team: TeamKey) => {
    const teamName = team === "home" ? fixture.homeTeamName : fixture.awayTeamName;

    setScore((current) => ({ ...current, [team]: current[team] + 1 }));
    setPointHistory((current) => [...current, team]);
    setAnnouncement(`Punto para ${teamName} registrado. Podés deshacerlo si fue un error.`);
  };

  const undoLastPoint = () => {
    const lastPoint = pointHistory[pointHistory.length - 1];

    if (!lastPoint) {
      return;
    }

    setScore((current) => ({
      ...current,
      [lastPoint]: Math.max(fixture.score[lastPoint], current[lastPoint] - 1),
    }));
    setPointHistory((current) => current.slice(0, -1));
    setAnnouncement("Último punto deshecho. El marcador volvió al estado anterior.");
  };

  const setSubstitutionOpen = (open: boolean) => {
    if (!open) {
      setLeavingPlayerId("");
      setEnteringPlayerId("");
    }

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

  const confirmSubstitution = () => {
    if (!canConfirmSubstitution) {
      return;
    }

    const leavingPlayer = substitutionPlayers.find((player) => player.id === leavingPlayerId);
    const enteringPlayer = substitutionPlayers.find((player) => player.id === enteringPlayerId);

    setAnnouncement(
      `Sustitución confirmada solo en esta consola: ${leavingPlayer?.fullName ?? "Jugador"} sale y ${enteringPlayer?.fullName ?? "jugador"} entra.`,
    );
    setSubstitutionOpen(false);
  };

  const teams = [
    { key: "home" as const, name: fixture.homeTeamName, value: score.home, sets: setsWon.home },
    { key: "away" as const, name: fixture.awayTeamName, value: score.away, sets: setsWon.away },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Badge tone="success">{fixture.statusLabel}</Badge>}
        description="Registrá los puntos del partido desde la planilla local. Los cambios se mantienen solo en esta consola."
        eyebrow="Planillero"
        title={fixture.title}
      />
      <div className="space-y-6">
        <p aria-atomic="true" aria-live="polite" className="sr-only" role="status">
          {announcement}
        </p>

        <section
          aria-labelledby="live-scoreboard-heading"
          className="rounded-2xl border border-vt-border bg-vt-raised p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Partido en curso</p>
              <h2 className="mt-2 text-lg font-bold text-vt-text" id="live-scoreboard-heading">
                Marcador actual
              </h2>
            </div>
            <div className="rounded-xl border border-vt-accent/40 bg-vt-accent/10 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-vt-muted">Set actual</p>
              <p className="mt-1 text-lg font-black text-vt-accent">{fixture.currentSetLabel}</p>
            </div>
          </div>

          <div
            aria-label="Marcador de ambos equipos"
            className="mt-6 grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]"
          >
            {teams.map((team, index) => (
              <div
                className={`rounded-2xl border border-vt-border bg-vt-panel p-5 ${index === 1 ? "md:order-3" : ""}`}
                key={team.key}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">{team.key === "home" ? "Local" : "Visitante"}</p>
                <h3 className="mt-2 text-lg font-bold text-vt-text">{team.name}</h3>
                <p
                  aria-label={`Puntaje de ${team.name}`}
                  className="mt-4 text-6xl font-black leading-none text-vt-accent"
                >
                  {team.value}
                </p>
                <p className="mt-3 text-sm text-vt-muted">Sets ganados: {team.sets}</p>
              </div>
            ))}
            <div className="text-center md:order-2" aria-hidden="true">
              <p className="text-2xl font-black text-vt-muted">vs</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-vt-muted">En vivo</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
          <section
            aria-labelledby="point-entry-heading"
            className="rounded-2xl border border-vt-border bg-vt-raised p-5 sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Acción rápida</p>
            <h2 className="mt-2 text-xl font-bold text-vt-text" id="point-entry-heading">
              Anotar punto
            </h2>
            <p className="mt-2 text-sm leading-6 text-vt-muted">
              Registrá qué equipo ganó el punto. Podés corregir el último registro desde los controles de seguridad.
            </p>
            <div aria-label="Equipo que anota el punto" className="mt-5 grid gap-3 sm:grid-cols-2" role="group">
              {teams.map((team) => (
                <button
                  aria-label={`Anotar punto para ${team.name}`}
                  className="min-h-14 rounded-xl bg-vt-accent px-4 py-3 text-left text-sm font-bold text-vt-background transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                  key={team.key}
                  onClick={() => recordPoint(team.key)}
                  type="button"
                >
                  <span className="block text-xs uppercase tracking-[0.14em] opacity-70">Punto para</span>
                  <span className="mt-1 block">{team.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="safety-controls-heading"
            className="rounded-2xl border border-vt-border bg-vt-raised p-5 sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Operación segura</p>
            <h2 className="mt-2 text-xl font-bold text-vt-text" id="safety-controls-heading">
              Controles de seguridad
            </h2>
            <p className="mt-2 text-sm leading-6 text-vt-muted">
              Revisá el último movimiento antes de continuar. No hay persistencia en servidor en esta versión.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                aria-disabled={!canUndo}
                aria-label="Deshacer último punto"
                className="min-h-12 rounded-xl border border-vt-border bg-vt-surface px-4 py-3 text-left text-sm font-bold text-vt-text transition hover:border-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canUndo}
                onClick={undoLastPoint}
                type="button"
              >
                Deshacer último punto
              </button>
              <button
                aria-expanded={isSubstitutionOpen}
                aria-haspopup="dialog"
                aria-label="Abrir modal de sustitución"
                className="min-h-12 rounded-xl border border-vt-success/60 bg-vt-surface px-4 py-3 text-left text-sm font-bold text-vt-text transition hover:border-vt-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                onClick={() => setSubstitutionOpen(true)}
                type="button"
              >
                {substitutionLabel}
              </button>
            </div>
            <p className="mt-4 text-xs text-vt-muted">
              {canUndo ? "Hay un punto local listo para revisar o deshacer." : "Todavía no hay puntos locales para deshacer."}
            </p>
          </section>
        </div>

        <section aria-labelledby="set-history-heading" className="rounded-2xl border border-vt-border bg-vt-raised p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Historial del partido</p>
              <h2 className="mt-2 text-xl font-bold text-vt-text" id="set-history-heading">
                Sets del partido
              </h2>
            </div>
            <p aria-label={`Sets ganados: ${setsWon.home} a ${setsWon.away}`} className="text-sm font-bold text-vt-accent">
              Sets ganados {setsWon.home} - {setsWon.away}
            </p>
          </div>
          <ol className="mt-5 grid gap-3 sm:grid-cols-3">
            {fixture.sets.map((set, index) => {
              const isCurrentSet = set.label === fixture.currentSetLabel;
              const isCompleted = currentSetIndex < 0 || index < currentSetIndex;
              return (
                <li
                  aria-current={isCurrentSet ? "true" : undefined}
                  aria-label={`${set.label}: ${set.home} a ${set.away}${isCurrentSet ? ", en curso" : ""}`}
                  className={`rounded-xl border p-4 ${isCurrentSet ? "border-vt-accent bg-vt-accent/10" : "border-vt-border bg-vt-panel"}`}
                  key={set.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">{set.label}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-vt-muted">
                      {isCurrentSet ? "En curso" : isCompleted ? "Finalizado" : "Pendiente"}
                    </span>
                  </div>
                  <p className="mt-3 text-xl font-bold text-vt-text">{set.home} - {set.away}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section aria-labelledby="court-context-heading" className="rounded-2xl border border-vt-border bg-vt-raised p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Contexto de cancha</p>
              <h2 className="mt-2 text-xl font-bold text-vt-text" id="court-context-heading">
                Rotación y cancha
              </h2>
            </div>
            <p className="text-sm text-vt-muted">Rotación actual · {fixture.homeTeamName}</p>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-vt-muted">
            Vista de referencia para ubicar a las seis jugadoras en cancha. La consola no modifica las asignaciones del partido.
          </p>
          <div
            aria-label={`Cancha de ${fixture.homeTeamName} y ${fixture.awayTeamName}`}
            className="relative mt-5 overflow-hidden rounded-2xl border-2 border-vt-border bg-vt-surface p-4 sm:p-5"
            data-court-view="true"
            role="img"
          >
            <div
              aria-label="Red central"
              className="pointer-events-none absolute inset-x-4 top-1/2 z-10 h-px bg-vt-border lg:inset-y-4 lg:left-1/2 lg:right-auto lg:top-4 lg:h-auto lg:w-px"
              data-court-feature="net"
              role="separator"
            >
              <span className="sr-only">Red central</span>
            </div>
            <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-8">
              {courtTeams.map((team) => (
                <div className="relative" key={team.key}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-vt-text">{team.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-vt-muted">
                      {team.key === "home" ? "Local" : "Visitante"}
                    </span>
                  </div>
                  <div className="relative rounded-xl border border-vt-border bg-vt-panel p-2 sm:p-3">
                    <span
                      aria-label={`Línea de ataque de ${team.name}`}
                      className="pointer-events-none absolute inset-x-2 top-1/2 z-10 border-t-2 border-dashed border-vt-accent/70"
                      data-court-feature="attack-line"
                      role="separator"
                    />
                    <ol
                      aria-label={`Seis posiciones de ${team.name}`}
                      className="relative grid grid-cols-3 gap-2 sm:gap-3"
                    >
                      {COURT_POSITIONS.map((position, index) => {
                        const player = team.players[index];
                        return (
                          <li
                            aria-label={`${team.name}, ${position.label}: ${player ? `#${player.number} ${player.fullName}` : "Sin asignar"}`}
                            className="relative rounded-xl border border-vt-border bg-vt-panel p-2 sm:p-3"
                            data-court-spot="true"
                            key={position.label}
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-vt-accent">{position.label}</p>
                            <p className="mt-2 text-xs text-vt-muted">{position.description}</p>
                            <p className="mt-3 break-words text-sm font-bold text-vt-text">
                              {player ? `#${player.number} ${player.fullName}` : "Sin asignar"}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </section>
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
              className="min-h-12 rounded-lg border border-vt-border bg-vt-surface px-3 py-2 text-sm font-normal text-vt-text"
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
              className="min-h-12 rounded-lg border border-vt-border bg-vt-surface px-3 py-2 text-sm font-normal text-vt-text"
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
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            className="min-h-11 rounded-lg border border-vt-border bg-vt-surface px-4 py-2 text-sm font-semibold text-vt-text hover:border-vt-accent"
            onClick={() => setSubstitutionOpen(false)}
            type="button"
          >
            Cancelar
          </button>
          <button
            aria-disabled={!canConfirmSubstitution}
            className="min-h-11 rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-vt-background transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            disabled={!canConfirmSubstitution}
            onClick={confirmSubstitution}
            type="button"
          >
            Confirmar Sustitución
          </button>
        </div>
      </Modal>
    </div>
  );
}
