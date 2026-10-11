/**
 * The `.btn` class names, in a module of their own because `Button.tsx` may only export
 * components (eslint react-refresh/only-export-components) and the design needs the same
 * pill treatment on `<a>` elements wherever the control navigates.
 *
 * Design source: frontend/design/html/voleytrack.css:69-74 (voleytrack-admin.css:72-77)
 *
 *   .btn{height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--border);
 *        background:var(--surface);color:var(--fg);font-size:13px;font-weight:700;
 *        display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
 *   .btn:hover{border-color: the design's hardcoded hover tone, tokenised as
 *               --color-vt-border-hover so no raw hex reaches this module}
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
export type ButtonVariant = "primary" | "surface" | "ghost" | "icon";

/**
 * The design's `.btn` is 40px tall (`.btn{height:40px}`, line 69). One call site in the
 * design overrides that on an inline style — the dashboard's "Ver todos"
 * (`style="height:32px;font-size:12px"`, voleytrack-dashboard.html:71) — so the size is
 * modelled here instead of forcing call sites to fight the base utilities, which they
 * cannot: `h-8`/`text-[12px]` appended to `h-10`/`text-[13px]` lose to the later utility in
 * Tailwind's output. `md` is the design's default `.btn`; `sm` is that one 32px form.
 */
export type ButtonSize = "md" | "sm";

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-10 text-[13px]",
  sm: "h-8 text-[12px]",
};

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

/**
 * The design renders `.btn` on `<a>` elements wherever the control navigates
 * (`<a class="btn accent" href="…">`, voleytrack-dashboard.html:63 and :71). A `<button>`
 * cannot carry an href, so an anchor that must wear the same pill treatment needs the same
 * class string. It lives in one function so the treatment stays defined once instead of
 * being copied into each screen that needs a link-shaped button.
 */
export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className = "") {
  return `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();
}
