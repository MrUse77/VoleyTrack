import type { HTMLAttributes } from "react";

type ChipVariant = "default" | "accent";

type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

// Design source: frontend/design/html/voleytrack.css:82-83 (.chip / .chip.accent).
const variantClasses: Record<ChipVariant, string> = {
  default: "border-vt-border bg-vt-background text-vt-muted",
  accent: "border-vt-accent bg-vt-accent text-vt-background",
};

export function Chip({ className = "", variant = "default", ...props }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-[10px] py-[6px] text-[11px] leading-none font-bold tracking-[0.04em] ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
