import type { HTMLAttributes } from "react";

type BadgeTone = "accent" | "muted" | "success" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  accent: "border-vt-accent/35 bg-vt-accent/10 text-vt-accent",
  muted: "border-white/10 bg-white/5 text-vt-text/80",
  success: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  neutral: "border-white/10 bg-black/20 text-vt-muted",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${toneClasses[tone]} ${className}`.trim()}
      {...props}
    />
  );
}
