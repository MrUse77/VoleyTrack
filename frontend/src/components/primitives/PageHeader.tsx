import type { HTMLAttributes, ReactNode } from "react";

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  description?: ReactNode;
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
        {/*
         * Design: frontend/design/html/voleytrack.css:66
         * `.page-head h1{font-size:28px;font-weight:900;letter-spacing:-0.02em;margin:0;line-height:1}`.
         * Both former variants now share it, because the design defines one `.page-head`
         * heading and never a compact one (see `page-head` in frontend/design/html/*.html).
         */}
        <h1 className="text-[28px] font-black leading-none tracking-[-0.02em] text-vt-text">
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
