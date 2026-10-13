import type { ButtonHTMLAttributes } from "react";

/**
 * Design source: frontend/design/html/voleytrack.css:69-74 (voleytrack-admin.css:72-77)
 *
 *   .btn{height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--border);
 *        background:var(--surface);color:var(--fg);font-size:13px;font-weight:700;
 *        display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
 *   .btn:hover{border-color: the design's hardcoded hover tone, tokenised as
 *               --color-vt-border-hover so no raw hex reaches this component}
 *   .btn.accent{background:var(--accent);border-color:var(--accent);color:#0b1220}
 *   .btn.accent:hover{filter:brightness(1.06)}
 *   .btn.ghost{background:transparent}
 *   .btn svg{width:16px;height:16px}
 *
 * The variant names are the ones 31 existing call sites already use, mapped onto the
 * design's three treatments instead of renamed:
 *   primary -> .btn.accent   (accent fill, dark ink, hover is a brightness filter)
 *   surface -> .btn          (the design's default: --surface fill, --fg ink)
 *   ghost   -> .btn.ghost    (transparent fill; border and ink come from the base)
 *   icon    -> no counterpart in the design's `.btn` set. The design's round 40x40
 *              `.icon-btn` (line 55) is owned by the IconButton primitive; this name
 *              is kept only so it does not vanish from the exported surface
 *              mid-migration, and no production call site uses it.
 */
type ButtonVariant = "primary" | "surface" | "ghost" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-vt-accent bg-vt-accent px-4 text-vt-background hover:brightness-[1.06]",
  surface: "border-vt-border bg-vt-surface px-4 text-vt-text hover:border-vt-border-hover",
  ghost: "border-vt-border bg-transparent px-4 text-vt-text hover:border-vt-border-hover",
  // The base already gives it the pill radius and the --surface fill, matching the
  // design's round 40x40 `.icon-btn` (line 55); its raised hover is a pre-existing
  // app-only layer, left alone so this slice does not move an untested variant's
  // appearance. No production call site uses it.
  icon: "w-10 border-vt-border bg-vt-surface text-vt-text hover:bg-vt-raised",
};

export function Button({ className = "", type = "button", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full border text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 ${variantClasses[variant]} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}
