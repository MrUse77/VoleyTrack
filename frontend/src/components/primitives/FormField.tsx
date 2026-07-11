import type { InputHTMLAttributes, ReactNode } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: ReactNode;
  helperText?: ReactNode;
};

export function FormField({ className = "", helperText, id, label, ...props }: FormFieldProps) {
  const helperTextId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-vt-text" htmlFor={id}>
        {label}
      </label>
      <input
        aria-describedby={helperTextId}
        className={`h-10 rounded-lg border border-vt-border bg-vt-panel px-3 text-sm text-vt-text placeholder:text-vt-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${className}`.trim()}
        id={id}
        {...props}
      />
      {helperText ? <p className="text-sm text-vt-muted" id={helperTextId}>{helperText}</p> : null}
    </div>
  );
}
