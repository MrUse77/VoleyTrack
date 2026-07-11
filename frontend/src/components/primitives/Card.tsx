import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-vt-raised-border bg-vt-raised p-6 ${className}`.trim()}
      {...props}
    />
  );
}
