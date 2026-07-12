import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";

export type MockUiState = "loading" | "empty" | "error" | "offline" | "sync";

type StatePanelProps = {
  title: string;
  description: string;
  symbol: string;
  tone: "accent" | "danger" | "success" | "muted";
};

const toneClasses = {
  accent: "border-vt-accent/40 bg-vt-accent/10 text-vt-accent",
  danger: "border-vt-danger/40 bg-vt-danger/10 text-vt-danger",
  muted: "border-vt-border bg-vt-panel text-vt-muted",
  success: "border-vt-success/40 bg-vt-success/10 text-vt-success",
} as const;

function StatePanel({ description, symbol, title, tone }: StatePanelProps) {
  return (
    <section
      aria-live="polite"
      className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-vt-border bg-vt-surface p-8 text-center"
      data-testid="ui-state"
    >
      <span className={`flex size-12 items-center justify-center rounded-full border text-lg font-bold ${toneClasses[tone]}`} aria-hidden="true">
        {symbol}
      </span>
      <h2 className="mt-4 text-lg font-bold text-vt-text">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-vt-muted">{description}</p>
    </section>
  );
}

export function LoadingState() {
  return <StatePanel description="Estamos preparando la información para vos." symbol="…" title="Cargando contenido" tone="accent" />;
}

export function EmptyState() {
  return <StatePanel description="Probá con otro filtro o volvé más tarde." symbol="—" title="No hay resultados" tone="muted" />;
}

export function ErrorState() {
  return <StatePanel description="Intentá nuevamente cuando quieras." symbol="!" title="No pudimos mostrar esta información" tone="danger" />;
}

export function OfflineState() {
  return <StatePanel description="Revisá tu conexión para volver a consultar los datos." symbol="×" title="Sin conexión" tone="muted" />;
}

export function SyncState() {
  return <StatePanel description="Los datos mostrados están actualizados." symbol="✓" title="Sincronización completa" tone="success" />;
}

const stateComponents: Record<MockUiState, () => ReactNode> = {
  loading: LoadingState,
  empty: EmptyState,
  error: ErrorState,
  offline: OfflineState,
  sync: SyncState,
};

function mockUiState(value: unknown): MockUiState | undefined {
  return value === "loading" || value === "empty" || value === "error" || value === "offline" || value === "sync"
    ? value
    : undefined;
}

export function StateBoundary({ children }: { children: ReactNode }) {
  const location = useLocation() as { search: Record<string, unknown> };
  const state = mockUiState(location.search.state);

  if (!state) return children;

  const StateComponent = stateComponents[state];
  return <StateComponent />;
}
