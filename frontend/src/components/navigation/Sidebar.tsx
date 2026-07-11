import type { ReactNode } from "react";
import { Badge } from "../primitives/Badge";

export interface SidebarNavigationItem {
  href: string;
  icon: ReactNode;
  label: string;
}

export interface SidebarNavigationGroup {
  items: SidebarNavigationItem[];
}

interface SidebarProps {
  currentPath: string;
  navigation: SidebarNavigationGroup[];
  roleLabel: string;
}

function isActivePath(currentPath: string, href: string) {
  return currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`));
}

export function Sidebar({ currentPath, navigation, roleLabel }: SidebarProps) {
  return (
    <aside className="flex w-[248px] shrink-0 flex-col border-r border-vt-border bg-vt-background px-4 py-6 text-vt-text">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-vt-accent font-bold text-vt-background" aria-hidden="true">
          VT
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold tracking-tight">VoleyTrack</p>
          <Badge variant="accent" className="mt-1">{roleLabel}</Badge>
        </div>
      </div>

      <nav className="mt-8" aria-label={`${roleLabel} navigation`}>
        {navigation.map((group, groupIndex) => (
          <div key={group.items.map((item) => item.href).join("|")}>
            {groupIndex > 0 && <div className="my-4 border-t border-vt-border" role="separator" />}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active = isActivePath(currentPath, item.href);
                const stateClass = active
                  ? "bg-vt-surface text-vt-text"
                  : "text-vt-muted hover:bg-vt-panel hover:text-vt-text";

                return (
                  <li key={item.href}>
                    <a
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${stateClass}`}
                      href={item.href}
                    >
                      <span className="flex h-5 w-5 items-center justify-center text-vt-accent" aria-hidden="true">
                        {item.icon}
                      </span>
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
