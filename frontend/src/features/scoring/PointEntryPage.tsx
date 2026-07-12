import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { SectionShell } from "../../components/ui/SectionShell";
import { SCORING } from "../../fixtures";

export function PointEntryPage() {
  const fixture = SCORING.pointEntry;
  const location = useLocation() as { search: Record<string, unknown> };
  const initialStepIndex = fixture.steps.findIndex((step) => step.id === location.search.step);
  const [stepIndex, setStepIndex] = useState(initialStepIndex < 0 ? 0 : initialStepIndex);
  const step = fixture.steps[stepIndex];
  const isLastStep = stepIndex === fixture.steps.length - 1;

  return (
    <SectionShell eyebrow="Planillero" title={fixture.title} description={step.description}>
      <div className="rounded-2xl border border-vt-border bg-vt-raised p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-vt-muted">
          Paso {stepIndex + 1} de {fixture.steps.length}
        </p>
        <h2 className="mt-2 text-xl font-bold text-vt-text">{step.label}</h2>
        <p className="mt-1 text-sm text-vt-muted">{step.description}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          aria-label="Siguiente paso"
          className="rounded-lg bg-vt-accent px-4 py-2 text-sm font-semibold text-slate-950 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLastStep}
          onClick={() => setStepIndex((current) => Math.min(current + 1, fixture.steps.length - 1))}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </SectionShell>
  );
}
