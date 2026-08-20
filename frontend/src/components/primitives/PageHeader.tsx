import type { HTMLAttributes, ReactNode } from "react";

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
  variant?: "default" | "compact";
};

export function PageHeader({
  actions,
  className = "",
  description,
  title,
  variant = "default",
  ...props
}: PageHeaderProps) {
  const compact = variant === "compact";

  return (
    <header className={`flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:justify-between ${className}`.trim()} {...props}>
      <div className="min-w-0">
        <h1 className={`${compact ? "text-[26px] font-bold" : "text-[32px] font-black"} leading-tight text-vt-text`}>
          {title}
        </h1>
        {description ? (
          <p className={`mt-2 ${compact ? "text-[13px]" : "text-sm"} leading-6 text-vt-muted`}>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">{actions}</div> : null}
    </header>
  );
}
