import { useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { SectionShell } from "../../components/ui/SectionShell";
import { SCORING } from "../../fixtures";

export function PostMatchSummaryPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const summary = SCORING.summary.matchId === id ? SCORING.summary : undefined;

  if (!summary) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Partido no encontrado</h1>
        <p className="mt-2 text-sm text-vt-muted">
          No hay un resumen disponible para este partido.
        </p>
      </Card>
    );
  }

  return (
    <SectionShell
      eyebrow="Planillero"
      title={summary.title}
      description="Resultado final y detalle de sets"
    >
      <Card className="border-vt-border bg-vt-raised p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-vt-success">{summary.statusLabel}</p>
            <p className="mt-2 text-xl font-bold text-vt-text">
              {summary.homeTeamName} vs {summary.awayTeamName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-vt-text">
              {summary.finalScore.home} – {summary.finalScore.away}
            </p>
            <p className="mt-1 text-sm text-vt-muted">Resultado final</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-bold text-vt-text">Detalle por set</h2>
        <ul className="mt-4 divide-y divide-vt-border">
          {summary.sets.map((set) => (
            <li className="flex items-center justify-between py-3" key={set.id}>
              <span className="text-sm font-semibold text-vt-text">{set.label}</span>
              <span className="text-sm text-vt-muted">
                {set.home} – {set.away}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </SectionShell>
  );
}
