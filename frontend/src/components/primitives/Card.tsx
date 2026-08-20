import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "surface" | "raised";
};

export function Card({ className = "", variant = "surface", ...props }: CardProps) {
  const surfaceClasses = variant === "raised"
    ? "border-vt-raised-border bg-vt-raised"
    : "border-vt-border bg-vt-surface";

  return (
    <div
      className={`rounded-2xl border p-6 ${surfaceClasses} ${className}`.trim()}
      {...props}
    />
  );
}
