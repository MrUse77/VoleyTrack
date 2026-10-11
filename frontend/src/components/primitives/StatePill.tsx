import type { HTMLAttributes, ReactNode } from "react";

export type MatchStatus = "programado" | "envivo" | "finalizado";

type StatePillConfig = {
  label: string;
  variantClasses: string;
};

// Design source: frontend/design/html/voleytrack-admin.css:89-92
// (.state-pill plus .s-programado / .s-envivo / .s-finalizado).
const statusConfig: Record<MatchStatus, StatePillConfig> = {
  programado: {
    label: "Programado",
    variantClasses: "border-vt-border bg-vt-background text-vt-muted",
  },
  envivo: {
    // The design gives the live pill no border; a transparent one keeps every
    // status the same size without changing the painted result.
    label: "En vivo",
    variantClasses: "border-transparent bg-vt-danger text-vt-on-danger",
  },
  finalizado: {
    label: "Finalizado",
    variantClasses:
      "border-vt-success-soft-border bg-vt-success-soft text-vt-success-soft-text",
  },
};

type StatePillProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  label?: ReactNode;
  status: MatchStatus;
};

/**
 * Match status label. Never colour-only: the status word is always rendered as
 * text, and an sr-only "Estado:" prefix gives the word its context for
 * assistive tech. Deliberately not a live region: a listing renders many of
 * these, and one live region per row would announce an entire table on change.
 */
export function StatePill({ className = "", label, status, ...props }: StatePillProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-[10px] py-[6px] font-mono text-[10px] font-extrabold tracking-[0.06em] uppercase ${config.variantClasses} ${className}`.trim()}
      data-status={status}
      {...props}
    >
      <span className="sr-only">Estado: </span>
      {label ?? config.label}
    </span>
  );
}
