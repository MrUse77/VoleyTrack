import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineState,
  SyncState,
} from "../../components/states/StateBoundary";
import { PageHeader } from "../../components/primitives/PageHeader";

const states = [
  { Component: LoadingState, label: "Loading" },
  { Component: EmptyState, label: "Empty" },
  { Component: ErrorState, label: "Error" },
  { Component: OfflineState, label: "Offline" },
  { Component: SyncState, label: "Sync" },
] as const;

export function UIStatesBoardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Estados de interfaz"
        description="Muestras estáticas para revisar los estados visuales de la aplicación."
      />
      <section aria-label="Panel de estados de interfaz" className="grid gap-4 xl:grid-cols-3">
        {states.map(({ Component, label }) => (
          <div key={label}>
            <p className="mb-2 text-xs font-bold tracking-[0.08em] text-vt-muted">{label}</p>
            <Component />
          </div>
        ))}
      </section>
    </div>
  );
}
