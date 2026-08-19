import type { DashboardRailCardVm } from "../dashboard.models";
import { Badge } from "../../../components/ui/Badge";
import { Surface } from "../../../components/ui/Surface";

interface DashboardRailProps {
  cards: DashboardRailCardVm[];
}

export function DashboardRail({ cards }: DashboardRailProps) {
  return (
    <aside className="flex flex-col gap-4">
      {cards.map((card) => (
        <Surface key={card.title} className="p-4">
          <header className="mb-4 border-b border-vt-border pb-3">
            <p className="text-[10px] uppercase tracking-[0.28em] text-vt-muted">
              {card.subtitle}
            </p>
            <h3 className="mt-1 text-sm font-bold uppercase tracking-[0.24em] text-white">
              {card.title}
            </h3>
          </header>

          {card.type === "players" ? (
            <div className="space-y-3">
              {card.items.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-vt-border bg-vt-panel px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-vt-surface text-xs font-bold text-vt-muted">
                    {item.rank}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {item.label}
                    </p>
                    <p className="text-xs text-vt-muted">{item.detail}</p>
                  </div>
                  <Badge tone="success">{item.value}</Badge>
                </div>
              ))}
            </div>
          ) : card.type === "standings" ? (
            <div className="space-y-2">
              {card.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-vt-border bg-vt-panel px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-right text-[10px] font-bold text-vt-accent">
                      {item.rank}.
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-vt-muted">{item.detail}</p>
                    </div>
                  </div>
                  <Badge tone="muted" className="font-mono">{item.value}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-vt-border bg-vt-panel px-4 py-10 text-center text-sm text-vt-muted">
              {card.emptyState}
            </div>
          )}
        </Surface>
      ))}

      <a className="text-xs text-vt-accent hover:underline" href="#">
        Ver más
      </a>
    </aside>
  );
}
