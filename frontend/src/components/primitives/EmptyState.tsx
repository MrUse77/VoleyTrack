import type { HTMLAttributes, ReactNode } from "react";

type EmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  description?: ReactNode;
  title: ReactNode;
};

/**
 * Empty result placeholder. Design source:
 * frontend/design/html/voleytrack-admin.css:202-204 (.empty-state). role="status"
 * matches the design's own markup (voleytrack-admin-partidos.html:41), so a
 * filter that yields nothing is announced rather than silently swapping content.
 */
export function EmptyState({ className = "", description, title, ...props }: EmptyStateProps) {
  return (
    <div
      className={`px-[20px] py-[36px] text-center ${className}`.trim()}
      role="status"
      {...props}
    >
      <h2 className="mb-[6px] text-[18px] font-bold text-vt-text">{title}</h2>
      {description ? <p className="m-0 text-[13px] text-vt-muted">{description}</p> : null}
    </div>
  );
}
