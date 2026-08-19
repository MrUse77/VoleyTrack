import { APP_SHELL_BRAND, APP_SHELL_NAVIGATION } from "../shared/app-shell.content";
import { Badge } from "./ui/Badge";
import { NavItem } from "./ui/NavItem";

interface ShellTopbarProps {
  className?: string;
}

export const ShellTopbar = ({ className = "" }: ShellTopbarProps) => {
  return (
    <header className={`border-b border-vt-border bg-vt-surface ${className}`.trim()}>
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <div className="flex items-center gap-2 text-white">
            <img
              src="/icon.svg"
              alt="VOLLEYTRACK"
              width="25"
              height="25"
              className="shrink-0"
            />
            <span className="text-lg font-black uppercase tracking-[-0.05em] text-white">
              {APP_SHELL_BRAND.title}
            </span>
          </div>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {APP_SHELL_NAVIGATION.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Badge tone="muted" className="hidden md:inline-flex">
            Live
          </Badge>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-vt-border bg-vt-panel text-vt-muted transition hover:border-vt-accent/30 hover:text-white" type="button" aria-label="Notifications">
            <span aria-hidden="true">🔔</span>
          </button>

          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-vt-border bg-vt-panel text-sm font-semibold text-white transition hover:border-vt-accent/30" type="button" aria-label="User avatar">
            AV
          </button>
        </div>
      </div>
    </header>
  );
};
