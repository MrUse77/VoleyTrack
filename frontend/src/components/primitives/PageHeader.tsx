import type { HTMLAttributes, ReactNode } from "react";

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  actions?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
};

export function PageHeader({ actions, className = "", description, title, ...props }: PageHeaderProps) {
  return (
    <header className={`flex items-start justify-between gap-6 ${className}`.trim()} {...props}>
      <div>
        <h1 className="text-2xl font-bold text-vt-text">{title}</h1>
        {description ? <p className="mt-1 text-sm text-vt-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
