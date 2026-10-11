import type { HTMLAttributes, ReactNode } from "react";

type AvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "aria-hidden"> & {
  initials: ReactNode;
  name?: string;
};

/**
 * Identity disc with initials. Design source:
 * frontend/design/html/voleytrack-admin.css:52 (.avatar, 36px, 135deg accent
 * gradient from --accent to --accent-strong, dark ink text).
 *
 * Accessibility: with `name` the disc is exposed as an image named after the
 * person; without it the initials are decorative chrome next to a printed name,
 * so it is hidden from assistive tech instead of reading lone letters.
 */
export function Avatar({ className = "", initials, name, ...props }: AvatarProps) {
  return (
    <span
      aria-hidden={name ? undefined : true}
      aria-label={name}
      className={`inline-grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-vt-accent to-vt-accent-strong text-[13px] font-extrabold text-vt-background ${className}`.trim()}
      role={name ? "img" : undefined}
      {...props}
    >
      {initials}
    </span>
  );
}
