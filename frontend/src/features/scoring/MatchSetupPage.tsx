import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { SectionShell } from "../../components/ui/SectionShell";
import { SCORING } from "../../fixtures";
import { PlayerSelectionModal } from "./PlayerSelectionModal";

export function MatchSetupPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate({ from: "/admin/matches/setup" });
  const [stepIndex, setStepIndex] = useState(0);
  const isPlayerSelectionOpen = location.search.modal === "player-selection";
  const setup = SCORING.matchSetup;
  const step = setup.steps[stepIndex];
  const isLastStep = stepIndex === setup.steps.length - 1;

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

  return (
    <SectionShell eyebrow="Planillero" title={setup.title} description={step.label}>
      <div className="mb-6 rounded-2xl border border-vt-border bg-vt-raised p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Paso {stepIndex + 1} de {setup.steps.length}</p>
        <h2 className="mt-2 text-xl font-bold text-vt-text">{step.label}</h2>
        <p className="mt-1 text-sm text-vt-muted">{step.description}</p>
      </div>
      {step.id === "setup-step-teams" && (
        <div className="grid gap-4 md:grid-cols-2">
          {[setup.homeTeam, setup.awayTeam].map((team) => (
            <div className="rounded-2xl border border-vt-border bg-vt-raised p-5" key={team.id}>
              <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Equipo</p>
              <h2 className="mt-2 text-xl font-bold text-vt-text">{team.name}</h2>
              <p className="mt-1 text-sm text-vt-muted">{setup.tournamentName}</p>
            </div>
          ))}
        </div>
      )}
      {step.id === "setup-step-sets" && (
        <div className="rounded-2xl border border-vt-border bg-vt-raised p-5 text-sm text-vt-muted">
          <p>{setup.scheduledLabel}</p>
          <p className="mt-2">{setup.venue}</p>
        </div>
      )}
      {step.id === "setup-step-confirm" && (
        <div className="rounded-2xl border border-vt-border bg-vt-raised p-5 text-sm text-vt-muted">
          <p>{setup.homeTeam.name} vs. {setup.awayTeam.name}</p>
          <p className="mt-2">{setup.tournamentName}</p>
        </div>
      )}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          onClick={() => setPlayerSelectionOpen(true)}
          type="button"
        >
          Seleccionar jugadores
        </button>
        <button
          className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLastStep}
          onClick={() => setStepIndex((current) => Math.min(current + 1, setup.steps.length - 1))}
          type="button"
        >
          Siguiente
        </button>
      </div>
      <PlayerSelectionModal
        isOpen={isPlayerSelectionOpen}
        onClose={() => setPlayerSelectionOpen(false)}
      />
    </SectionShell>
  );
}
