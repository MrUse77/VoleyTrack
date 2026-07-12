import { useLocation, useNavigate } from "@tanstack/react-router";
import { SectionShell } from "../../components/ui/SectionShell";
import { SCORING } from "../../fixtures";
import { PlayerSelectionModal } from "./PlayerSelectionModal";

export function MatchSetupPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate({ from: "/admin/matches/setup" });
  const isPlayerSelectionOpen = location.search.modal === "player-selection";
  const setup = SCORING.matchSetup;

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
    <SectionShell eyebrow="Planillero" title={setup.title} description={setup.stepLabel}>
      <div className="grid gap-4 md:grid-cols-2">
        {[setup.homeTeam, setup.awayTeam].map((team) => (
          <div className="rounded-2xl border border-vt-border bg-vt-raised p-5" key={team.id}>
            <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">Equipo</p>
            <h2 className="mt-2 text-xl font-bold text-vt-text">{team.name}</h2>
            <p className="mt-1 text-sm text-vt-muted">{setup.tournamentName}</p>
          </div>
        ))}
      </div>
      <button
        className="mt-6 rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
        onClick={() => setPlayerSelectionOpen(true)}
        type="button"
      >
        Seleccionar jugadores
      </button>
      <PlayerSelectionModal
        isOpen={isPlayerSelectionOpen}
        onClose={() => setPlayerSelectionOpen(false)}
      />
    </SectionShell>
  );
}
