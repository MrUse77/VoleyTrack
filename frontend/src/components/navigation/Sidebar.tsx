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
  // Design: frontend/design/html/voleytrack.css:55 `.nav-item.active{background:var(--accent);
  // color:#0b1220;border-color:var(--accent)}` — the accent fill with dark ink on it, which
  // is `--color-vt-background` here. The admin variant used to override this with a raised
  // background (an app-only token with no design counterpart); the admin stylesheet
  // (frontend/design/html/voleytrack-admin.css:60) declares the same active rule, so both
  // shells now share one treatment instead of diverging.
  const activeStateClass =
    "border-vt-accent bg-vt-accent text-vt-background";
  // Design: voleytrack.css:53-54 `.nav-item{...color:var(--muted)...}` and
  // `.nav-item:hover{background:var(--surface-2);color:var(--fg)}`.
  const inactiveStateClass =
    "border-transparent text-vt-muted hover:bg-vt-surface-2 hover:text-vt-text";

  return (
    <aside className={`flex min-h-0 w-full shrink-0 flex-col border-r border-vt-border ${sidebarBackgroundClass} px-3.5 py-5 text-vt-text md:min-h-screen md:w-[248px]`}>
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
                  const stateClass = active ? activeStateClass : inactiveStateClass;

                  return (
                    <li key={item.href}>
                      <a
                        aria-current={active ? "page" : undefined}
                        // Design: frontend/design/html/voleytrack.css:53 `.nav-item{width:100%;
                        // display:flex;align-items:center;gap:10px;padding:10px 10px;
                        // border-radius:10px;border:1px solid transparent;color:var(--muted);
                        // font-size:13px;font-weight:600;...transition:.15s}` — so gap-2.5 and
                        // px-2.5/py-2.5 are the design's 10px, rounded-[10px] its 10px radius,
                        // the 1px transparent border is what makes the active border colour land
                        // without shifting layout, and text-[13px] its 13px/600 ink. py-5/px-3.5
                        // are the design sidebar's own `padding:20px 14px` (.sidebar, line 50).
                        // min-h-11 is a deliberate improvement, NOT a missed design value: the
                        // design item is roughly 36-40px tall, which is below the 44px minimum
                        // accessible touch target, so do not "fix" it back to the design's height.
                        className={`flex min-h-11 items-center gap-2.5 rounded-[10px] border px-2.5 py-2.5 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${stateClass}`}
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
