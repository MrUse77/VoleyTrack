import type { HTMLAttributes } from "react";

export function Surface({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={`rounded-[20px] border border-vt-border/90 bg-vt-surface shadow-[0_1px_0_rgba(255,255,255,0.02),0_24px_60px_rgba(0,0,0,0.18)] ${className}`.trim()}
      {...props}
    />
  );
}
