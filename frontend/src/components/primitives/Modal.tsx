import { useId, type MouseEvent, type ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
};

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const titleId = useId();

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
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <section
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-vt-raised-border bg-vt-raised p-6 shadow-2xl"
        role="dialog"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? <h2 className="text-lg font-bold text-vt-text" id={titleId}>{title}</h2> : <span />}
          <button
            aria-label="Close modal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-vt-border bg-vt-surface text-vt-text hover:bg-vt-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
