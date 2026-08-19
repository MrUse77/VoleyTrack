import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "danger" | "accent";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  tone?: BadgeVariant | "muted" | "neutral";
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-vt-border bg-vt-panel text-vt-muted",
  success: "border-vt-success/30 bg-vt-success/10 text-vt-success",
  danger: "border-vt-danger/30 bg-vt-danger/10 text-vt-danger",
  accent: "border-vt-accent/35 bg-vt-accent/10 text-vt-accent",
};

function resolveVariant(variant: BadgeVariant, tone?: BadgeProps["tone"]): BadgeVariant {
  if (tone) {
    if (tone === "muted" || tone === "neutral") return "default";
    return tone as BadgeVariant;
  }
  return variant;
}

export function Badge({ className = "", variant = "default", tone, ...props }: BadgeProps) {
  const resolved = resolveVariant(variant, tone);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] leading-none ${variantClasses[resolved]} ${className}`.trim()}
      {...props}
    />
  );
}
