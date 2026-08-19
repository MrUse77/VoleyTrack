import type { ReactNode } from "react";

export interface SidebarNavigationItem {
  href: string;
  icon: ReactNode;
  label: string;
}

export interface SidebarNavigationGroup {
  label?: string;
  items: SidebarNavigationItem[];
}

interface SidebarProps {
  currentPath: string;
  navigation: SidebarNavigationGroup[];
  roleLabel: string;
  brandSubtitle?: string;
  showCoverage?: boolean;
  variant?: "public" | "admin";
}

function isActivePath(
  currentPath: string,
  href: string,
  navigation: SidebarNavigationGroup[],
) {
  const matchingItems = navigation
    .flatMap((group) => group.items)
    .filter(
      (item) =>
        currentPath === item.href ||
        (item.href !== "/" && currentPath.startsWith(`${item.href}/`)),
    )
    .sort((left, right) => right.href.length - left.href.length);

  return matchingItems[0]?.href === href;
}

export function Sidebar({
  currentPath,
  navigation,
  roleLabel,
  brandSubtitle = roleLabel,
  showCoverage = false,
  variant = "public",
}: SidebarProps) {
  const sidebarBackgroundClass =
    variant === "admin" ? "bg-vt-background" : "bg-vt-surface";
  const activeStateClass =
    variant === "admin" ? "bg-vt-raised text-vt-text" : "bg-vt-accent text-vt-background";

  return (
    <aside className={`flex min-h-0 w-full shrink-0 flex-col border-r border-vt-border ${sidebarBackgroundClass} px-4 py-6 text-vt-text md:min-h-screen md:w-[248px]`}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-3 px-2">
          <div
            aria-hidden="true"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-vt-accent text-sm font-bold text-vt-background"
          >
            VT
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-tight text-vt-text">VoleyTrack</p>
            <p className="text-[11px] text-vt-muted">{brandSubtitle}</p>
          </div>
        </div>

        <nav className="mt-8" aria-label={`Navegación ${roleLabel}`}>
          {navigation.map((group, groupIndex) => (
            <div key={group.items.map((item) => item.href).join("|")}>
              {group.label ? (
                <p className="mb-2 mt-7 px-2 text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted first:mt-0">
                  {group.label}
                </p>
              ) : groupIndex > 0 ? (
                <div className="my-4 border-t border-vt-border" role="separator" />
              ) : null}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = isActivePath(currentPath, item.href, navigation);
                  const stateClass = active
                    ? activeStateClass
                    : "text-vt-muted hover:bg-vt-panel hover:text-vt-text";

                  return (
                    <li key={item.href}>
                      <a
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-11 items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${stateClass}`}
                        href={item.href}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-5 w-6 shrink-0 items-center justify-center text-[13px] font-bold text-current"
                        >
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {showCoverage ? (
          <div className="mt-auto pt-8">
            <div
              aria-label="Cobertura en vivo"
              className="rounded-[14px] bg-vt-panel px-4 py-4"
              role="status"
            >
              <p className="text-[11px] font-bold tracking-[0.08em] text-vt-muted">COBERTURA</p>
              <p className="mt-1 text-sm font-bold text-vt-text">3 partidos en vivo</p>
              <p className="mt-1 text-[11px] font-bold text-vt-success">Datos actualizados ahora</p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
