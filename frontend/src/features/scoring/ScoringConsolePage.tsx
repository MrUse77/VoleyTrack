import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { SectionShell } from "../../components/ui/SectionShell";
import { SCORING } from "../../fixtures";

export function ScoringConsolePage() {
  const fixture = SCORING.console;
  const [score, setScore] = useState(fixture.score);

  const recordPoint = (team: "home" | "away") => {
    setScore((current) => ({ ...current, [team]: current[team] + 1 }));
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
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
