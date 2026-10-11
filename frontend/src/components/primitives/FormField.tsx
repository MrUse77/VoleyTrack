import { cloneElement, type ReactElement, type ReactNode } from "react";

// Design source: frontend/design/html/voleytrack-admin.css:177-190
// (input, select, textarea, focus-visible, disabled, placeholder).
const fieldControlBase =
  "w-full rounded-vt-md border border-vt-border bg-vt-background text-[13px] text-vt-text outline-none transition-[border-color,box-shadow] duration-[150ms] placeholder:text-vt-muted-2 focus-visible:border-vt-accent focus-visible:shadow-vt-focus-ring disabled:cursor-not-allowed disabled:opacity-[.58] aria-invalid:border-vt-danger";

export const fieldControlClasses = `${fieldControlBase} h-[46px] px-[14px]`;

// The design paints a data-URI chevron on <select>; inlining it would introduce a
// raw colour literal in TSX and this slice may not add a stylesheet, so selects
// keep their native indicator until an asset or token exists for it.
export const fieldTextareaClasses = `${fieldControlBase} h-auto min-h-[96px] resize-y px-[14px] py-[12px]`;

type FieldControlElement = ReactElement<{
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  id?: string;
}>;

type FieldProps = {
  children: FieldControlElement;
  className?: string;
  error?: ReactNode;
  full?: boolean;
  hint?: ReactNode;
  id: string;
  label: ReactNode;
};

/**
 * Design-accurate form field: `.field` wraps a label, one control, an optional
 * hint and an optional error (.field / .field.full / .field label / .hint /
 * .field-error).
 *
 * This is the only form-field concept in the app: the older wrapper that rendered its
 * own single `<input>` was retired once its last consumer moved here, so hint/error/
 * described-by wiring has one owner instead of two.
 *
 * `Field` owns the accessibility wiring instead of trusting every call site:
 * it clones the control to set `id`, `aria-describedby` (error first, then hint)
 * and `aria-invalid` when there is an error. The control itself is passed in
 * with one of the exported control class constants, so inputs, selects and
 * textareas share the same 46px / 12px-radius / --bg spec.
 *
 * The error text is associated through aria-describedby rather than role="alert",
 * so a re-rendered invalid field is not announced twice.
 */
export function Field({ children, className = "", error, full = false, hint, id, label }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`flex flex-col gap-[7px] ${full ? "col-span-full" : ""} ${className}`.trim()}>
      <label className="text-[13px] font-bold text-vt-text" htmlFor={id}>
        {label}
      </label>
      {cloneElement(children, {
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        id,
      })}
      {hint ? <p className="text-[12px] text-vt-muted" id={hintId}>{hint}</p> : null}
      {error ? (
        <p className="m-0 min-h-[18px] text-[12px] font-semibold text-vt-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
