import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-vt-accent text-vt-background hover:bg-vt-accent/90",
  ghost: "border border-vt-border bg-transparent text-vt-text hover:bg-vt-surface",
  icon: "border border-vt-border bg-vt-surface text-vt-text hover:bg-vt-raised",
};

const sizeClasses: Record<ButtonVariant, string> = {
  primary: "px-4",
  ghost: "px-4",
  icon: "w-10",
};

export function Button({ className = "", type = "button", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[variant]} ${variantClasses[variant]} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
