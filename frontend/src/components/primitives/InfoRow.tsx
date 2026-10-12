import type { HTMLAttributes, ReactNode } from "react";

type InfoRowProps = HTMLAttributes<HTMLDivElement> & {
  label: ReactNode;
  value: ReactNode;
};

/**
 * Label/value row for detail panels. Design source:
 * frontend/design/html/voleytrack-admin.css:119-122 (.info-row, including
 * .info-row:last-child{border-bottom:0}).
 *
 * The design gives the EMPHASIS to the label, not to the value:
 *   line 121  .info-row b{font-weight:700}          -> the label is the bold one
 *   line 122  .info-row span{color:var(--muted)}    -> the value is the muted one
 * (the same two rules at frontend/design/html/voleytrack-torneos.css:45-46, so both
 * the admin and the public `.info-row` agree). `--fg` is #f8fafc, i.e. `text-vt-text`,
 * which is the ink the design's `<b>` inherits from `body` (line 29).
 *
 * The owner decided the design wins, so this flips the primitive's own treatment and
 * therefore every `InfoRow` on every screen that renders one: the label carries
 * `font-bold text-vt-text` and the value carries `text-vt-muted`.
 */
export function InfoRow({ className = "", label, value, ...props }: InfoRowProps) {
  return (
    <div
      className={`flex justify-between gap-[12px] border-b border-vt-border-2 px-0 py-[10px] text-[13px] last:border-b-0 ${className}`.trim()}
      {...props}
    >
      <span className="font-bold text-vt-text">{label}</span>
      <span className="text-vt-muted">{value}</span>
    </div>
  );
}
