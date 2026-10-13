import type { HTMLAttributes, ReactNode, Ref } from "react";

/**
 * `HTMLAttributes` already declares a `title?: string` (the tooltip attribute), which
 * intersected with this component's `title: ReactNode` into `string & ReactNode` and made
 * every non-string heading a type error — the tournaments detail needs the design's own
 * `<h1>Name <span class="badge">En curso</span></h1>` (frontend/design/html/voleytrack-torneos.html),
 * so the DOM attribute is omitted from the base props instead.
 */
type PageHeaderProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  actions?: ReactNode;
  description?: ReactNode;
  /**
   * The design's `.match-source` line above the heading
   * (frontend/design/html/voleytrack-admin.css:201 — mono 9px/800, `.06em` tracking,
   * uppercase, `--muted-2`). `.page-head p` gives it the same 6px top margin as the
   * description below the heading, and the heading's own margin is 0, so the design's
   * `eyebrow / h1 / meta` stack is exactly three children with one 6px gap each side.
   *
   * It is opt-in because the design uses it on one screen only: the planillero's setup view
   * (`voleytrack-planillero.html:25`, "Preparación del partido"). Every other page renders an
   * h1 with no eyebrow and is untouched by the prop.
   */
  eyebrow?: ReactNode;
  /**
   * The design's planillero moves focus to its own setup heading
   * (`document.getElementById('match-setup-title').focus()`, and the design's markup gives that
   * h1 `tabindex="-1"`, `voleytrack-planillero.html:25`), so the heading must be a programmatic
   * focus target exactly when a caller asks for one. `tabIndex={-1}` is therefore rendered only
   * alongside a ref: a plain page header keeps the attribute-free `<h1>` it has always had, and
   * the 30 screens that render one are not given a focus target they never use.
   */
  headingRef?: Ref<HTMLHeadingElement>;
  title: ReactNode;
  /**
   * @deprecated The design has a single `.page-head` treatment, so `compact` no longer
   * changes the typography. Kept so existing callers (`DashboardPage`) keep compiling;
   * the screen slice that owns that page should drop the prop.
   */
  variant?: "default" | "compact";
};

export function PageHeader({
  actions,
  className = "",
  description,
  eyebrow,
  headingRef,
  title,
  // Destructured only so the deprecated prop is never spread onto <header> as an invalid
  // DOM attribute. It intentionally changes nothing, because the design defines one
  // `.page-head` and no compact variant.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant,
  ...props
}: PageHeaderProps) {
  return (
    <header className={`flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:justify-between ${className}`.trim()} {...props}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mt-1.5 font-mono text-[9px] font-extrabold tracking-[0.06em] text-vt-muted-2 uppercase">
            {eyebrow}
          </p>
        ) : null}
        {/*
         * Design: frontend/design/html/voleytrack.css:66
         * `.page-head h1{font-size:28px;font-weight:900;letter-spacing:-0.02em;margin:0;line-height:1}`.
         * Both former variants now share it, because the design defines one `.page-head`
         * heading and never a compact one (see `page-head` in frontend/design/html/*.html).
         */}
        <h1
          className="text-[28px] font-black leading-none tracking-[-0.02em] text-vt-text"
          ref={headingRef}
          tabIndex={headingRef ? -1 : undefined}
        >
          {title}
        </h1>
        {/*
         * Design: voleytrack.css:67
         * `.page-head p{color:var(--muted);font-size:13px;margin:6px 0 0;max-width:60ch}` —
         * so mt-1.5 is the design's 6px and max-w-[60ch] its measure.
         */}
        {description ? (
          <p className="mt-1.5 max-w-[60ch] text-[13px] text-vt-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div> : null}
    </header>
  );
}
