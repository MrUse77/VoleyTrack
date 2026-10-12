import type { HTMLAttributes, ReactNode } from "react";

type LivePillProps = HTMLAttributes<HTMLSpanElement> & {
  label?: ReactNode;
};

/**
 * Live match indicator. Design source: frontend/design/html/voleytrack.css:61-62
 * (.live-pill / .live-dot / @keyframes pulse).
 *
 * A label, NOT a live region. It used to be announced as a polite status region "so a screen
 * reader reports the match going live", but its text is a fixed label (or a label derived
 * from the set number), it never changes on its own, and a live region whose content never
 * changes announces nothing at all - while, on the live match screen, two of these sat beside
 * the one region that does change, leaving a screen reader subscribed to three regions to
 * follow for one moving score. `LiveMatchPresentation` now keeps the single region that
 * carries the score, and this pill stays exactly what the design draws: text that is read as
 * ordinary content when the reader reaches it. This is the same call `StatePill` already
 * documents for the row-level status word ("Deliberately not a live region").
 *
 * The pulsing dot is decorative and hidden from assistive tech; under
 * prefers-reduced-motion: reduce it degrades to a static dot.
 */
export function LivePill({ className = "", label = "En vivo", ...props }: LivePillProps) {
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-full bg-vt-danger px-[8px] py-[4px] font-mono text-[10px] font-extrabold tracking-[0.06em] text-vt-on-danger ${className}`.trim()}
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
