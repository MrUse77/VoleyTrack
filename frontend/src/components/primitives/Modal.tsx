import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

type ModalProps = {
  children: ReactNode;
  /**
   * Accessible name of the close control. The design's `.modal-close` is an icon-only
   * button whose accessible name is "Cerrar" (frontend/design/html/voleytrack-admin-gestion.html),
   * and its own markup supplies it through `aria-label`; the default keeps the English label
   * the older modal consumers already ship until their own screens are aligned.
   */
  closeLabel?: string;
  /**
   * `.modal-head small`, the mono uppercase eyebrow under the title
   * (voleytrack-admin.css:250).
   */
  description?: ReactNode;
  /** `.modal-foot` — the design's right-aligned action row (voleytrack-admin.css:254). */
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.closest("[hidden]") === null,
  );
}

/**
 * The design's modal (frontend/design/html/voleytrack-admin.css:244-254): a blurred
 * overlay around a `--surface` panel with a `.modal-head` (title, eyebrow, close control),
 * a `.modal-body` and an optional `.modal-foot`.
 *
 * Focus is owned here rather than by every call site, because the design's modals are the
 * only overlays in the app and a dialog that can be tabbed out of is a keyboard trap in
 * reverse: opening moves focus into the dialog, Tab and Shift+Tab cycle inside it, Escape
 * and the backdrop close it, and closing restores focus to the control that opened it.
 */
export function Modal({
  children,
  closeLabel = "Close modal",
  description,
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  // A ref so the focus effect can depend on `isOpen` alone: re-running it on every render
  // would pull focus back to the dialog's first control while the user types in it.
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (focusableWithin(dialog)[0] ?? dialog).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = focusableWithin(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!dialog.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // The dialog is already unmounted when this cleanup runs, so the element that opened
      // it is the only focus target left; `body` takes focus when there is none.
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-vt-overlay p-6 backdrop-blur-[4px]"
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* Design: voleytrack-admin.css:246 `.modal{max-width:520px;max-height:min(86vh,820px);
          overflow:auto;background:var(--surface);border:1px solid var(--border);border-radius:18px}`. */}
      <section
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className="max-h-[min(86vh,820px)] w-full max-w-[520px] overflow-auto rounded-[18px] border border-vt-border bg-vt-surface"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        {/* Design: voleytrack-admin.css:248-252 `.modal-head` at 18px 22px with a
            --border-2 rule, an 18px/900 title and the 34px round close control. */}
        <div className="flex items-center justify-between gap-3 border-b border-vt-border-2 px-[22px] py-[18px]">
          <div className="min-w-0">
            {title ? (
              <h2 className="m-0 text-[18px] font-black tracking-[-0.01em] text-vt-text" id={titleId}>
                {title}
              </h2>
            ) : null}
            {description ? (
              <small
                className="mt-0.5 block font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-vt-muted"
                id={descriptionId}
              >
                {description}
              </small>
            ) : null}
          </div>
          <button
            aria-label={closeLabel}
            className="grid size-[34px] shrink-0 place-items-center rounded-full border border-vt-border bg-vt-background text-vt-muted transition-colors hover:border-vt-border-hover hover:text-vt-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="p-[22px]">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2.5 border-t border-vt-border-2 px-[22px] py-4">
            {footer}
          </div>
        ) : null}
      </section>
    </div>
  );
}
