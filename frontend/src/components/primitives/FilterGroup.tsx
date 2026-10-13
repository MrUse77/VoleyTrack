import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

// Design source: frontend/design/html/voleytrack-admin.css:166-168
// (.filters / .filter / .filter.active). The group is a labelled role="group"
// so assistive tech can name the filter set; each filter is a real button and
// publishes its state through aria-pressed.

type FilterGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  "aria-label": string;
};

export function FilterGroup({ "aria-label": ariaLabel, children, className = "", ...props }: FilterGroupProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={`mb-[16px] flex flex-wrap gap-[10px] ${className}`.trim()}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

type FilterProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  isActive?: boolean;
};

export function Filter({ className = "", isActive = false, type = "button", ...props }: FilterProps) {
  const stateClasses = isActive
    ? "border-vt-text bg-vt-text text-vt-background"
    : "border-vt-border bg-vt-surface text-vt-muted hover:text-vt-text";

  return (
    <button
      aria-pressed={isActive}
      className={`inline-flex h-[36px] items-center rounded-full border px-[14px] text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${stateClasses} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
