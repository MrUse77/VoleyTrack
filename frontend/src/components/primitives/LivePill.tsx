import type { HTMLAttributes, ReactNode } from "react";

type LivePillProps = HTMLAttributes<HTMLSpanElement> & {
  label?: ReactNode;
};

/**
 * Live match indicator. Design source: frontend/design/html/voleytrack.css:61-62
 * (.live-pill / .live-dot / @keyframes pulse).
 *
 * Announced as a polite status region instead of a decorative span, so a screen
 * reader reports the match going live. The pulsing dot is decorative and hidden
 * from assistive tech; under prefers-reduced-motion: reduce it degrades to a
 * static dot.
 */
export function LivePill({ className = "", label = "En vivo", ...props }: LivePillProps) {
  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-[6px] rounded-full bg-vt-danger px-[8px] py-[4px] font-mono text-[10px] font-extrabold tracking-[0.06em] text-vt-on-danger ${className}`.trim()}
      role="status"
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-[6px] w-[6px] animate-vt-pulse rounded-full bg-vt-on-danger motion-reduce:animate-none"
      />
      {label}
    </span>
  );
}
