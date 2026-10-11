import type { HTMLAttributes, ReactNode } from "react";

type InfoRowProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
};

/**
 * Label/value row for detail panels. Design source:
 * frontend/design/html/voleytrack-admin.css:119-122 (.info-row, including
 * .info-row:last-child{border-bottom:0}).
 */
export function InfoRow({ className = "", label, value, ...props }: InfoRowProps) {
  return (
    <div
      className={`flex justify-between gap-[12px] border-b border-vt-border-2 px-0 py-[10px] text-[13px] last:border-b-0 ${className}`.trim()}
      {...props}
    >
      <span className="text-vt-muted">{label}</span>
      <span className="font-bold text-vt-text">{value}</span>
    </div>
  );
}
