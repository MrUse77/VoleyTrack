import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "danger" | "accent";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-vt-surface text-vt-muted",
  success: "bg-vt-success/20 text-vt-success",
  danger: "bg-vt-danger/20 text-vt-danger",
  accent: "bg-vt-accent/20 text-vt-accent",
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
