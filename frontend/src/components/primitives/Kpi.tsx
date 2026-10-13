import type { HTMLAttributes, ReactNode } from "react";

type KpiGridProps = HTMLAttributes<HTMLDivElement>;

/**
 * KPI cards grid. Design source: frontend/design/html/voleytrack-admin.css:101-103
 * (.kpi-grid, 4 columns, 2 below 1200px, 1 below 600px).
 */
export function KpiGrid({ className = "", ...props }: KpiGridProps) {
  return (
    <div
      className={`mb-[16px] grid grid-cols-1 gap-[16px] min-[600px]:grid-cols-2 min-[1200px]:grid-cols-4 ${className}`.trim()}
      role="list"
      {...props}
    />
  );
}

type KpiProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  sub?: ReactNode;
  value: ReactNode;
};

/**
 * Single KPI tile. Design source: frontend/design/html/voleytrack-admin.css:104-108
 * (.kpi / .kpi-label / .kpi-value / .kpi-sub, including .kpi-sub b -> --success).
 */
export function Kpi({ className = "", label, sub, value, ...props }: KpiProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-vt border border-vt-border bg-vt-surface p-[18px] ${className}`.trim()}
      role="listitem"
      {...props}
    >
      <p className="font-mono text-[10px] font-extrabold tracking-[0.08em] text-vt-muted uppercase">{label}</p>
      <p className="mt-[8px] mb-[6px] text-[32px] leading-none font-black tracking-[-0.02em] text-vt-text tabular-nums">
        {value}
      </p>
      {sub ? <p className="text-[12px] text-vt-muted [&>b]:text-vt-success">{sub}</p> : null}
    </div>
  );
}
