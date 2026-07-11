import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  "aria-label": string;
};

export function IconButton({ className = "", type = "button", ...props }: IconButtonProps) {
  return (
    <button
      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-vt-border bg-vt-surface text-vt-text transition-colors hover:bg-vt-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
