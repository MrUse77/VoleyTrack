import type { HTMLAttributes } from "react";

type ToastProps = HTMLAttributes<HTMLDivElement> & {
  dismissLabel?: string;
  onDismiss?: () => void;
  open?: boolean;
};

/**
 * Transient confirmation message. Design source:
 * frontend/design/html/voleytrack.css:116-117 (.toast / .toast.show).
 *
 * Accessibility: a toast is a status message, not an error, so it is announced
 * with role="status" (polite) plus an explicit aria-live="polite" and
 * aria-atomic="true" so the whole message is read once. A closed toast is
 * unmounted instead of left at opacity 0, so hidden text can never be announced.
 *
 * Keyboard dismissal: the design's toast is a non-interactive message that hides
 * itself. When the host screen keeps a toast open (or it carries an action), it
 * passes onDismiss and gets a focusable close button labelled with dismissLabel;
 * a purely auto-hiding toast needs no dismiss affordance because it holds no
 * focusable content and disappears on its own.
 *
 * The design's translate/opacity .25s hide -> show transition is expressed as a
 * mount animation (--animate-vt-toast-in), because reproducing a CSS transition
 * would need a mount tick and this directory is rendered with
 * renderToStaticMarkup (SSR), where effects never run.
 */
export function Toast({
  children,
  className = "",
  dismissLabel = "Cerrar notificación",
  onDismiss,
  open = true,
  ...props
}: ToastProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={`fixed right-[18px] bottom-[18px] z-50 flex animate-vt-toast-in items-center gap-[10px] rounded-[12px] bg-vt-text px-[14px] py-[12px] text-[13px] font-bold text-vt-background shadow-vt-toast motion-reduce:animate-none ${className}`.trim()}
      role="status"
      {...props}
    >
      {children}
      {onDismiss ? (
        <button
          aria-label={dismissLabel}
          className="text-[15px] leading-none text-vt-background/80 hover:text-vt-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          onClick={onDismiss}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
