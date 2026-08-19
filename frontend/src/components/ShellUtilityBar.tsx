import { APP_SHELL_UTILITY } from "../shared/app-shell.content";
import { Badge } from "./ui/Badge";

interface ShellUtilityBarProps {
  className?: string;
}

export function ShellUtilityBar({ className = "" }: ShellUtilityBarProps) {
  return (
    <div className={`border-b border-vt-border bg-vt-panel ${className}`.trim()}>
      <div className="mx-auto flex h-11 w-full max-w-[1600px] items-center gap-4 overflow-x-auto px-4 md:px-6">
        <div className="flex shrink-0 items-center gap-2 border-r border-vt-border pr-4 text-xs font-bold uppercase tracking-[0.14em] text-vt-muted">
          <Badge tone="accent" className="px-2 py-0.5 text-[10px] tracking-[0.22em]">
            Live now
          </Badge>
          <span>{APP_SHELL_UTILITY.spotlight}</span>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "LIVE", "UPCOMING", "RESULTS"].map((filter) => (
            <button key={filter} className="rounded-full border border-vt-border bg-vt-surface px-3 py-1 text-xs font-semibold text-vt-muted transition hover:border-vt-accent/30 hover:text-white" type="button">
              {filter}
            </button>
          ))}
        </div>

        <div className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-[0.22em] text-vt-muted">
          {APP_SHELL_UTILITY.dateLabel}
        </div>
      </div>
    </div>
  );
}
