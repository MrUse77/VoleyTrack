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
  /**
   * @deprecated Ignored since the dashboard parity slice (T11). The design's `.sidebar`
   * (frontend/design/html/voleytrack.css:50-56) holds nav groups, nav items and a divider,
   * and nothing else — there is no coverage-stats block in it — so the block this prop used
   * to render was removed. The prop is kept only because `layouts/PublicShell.tsx` still
   * passes it; the shell slice that owns that file should drop the pass.
   */
  showCoverage?: boolean;
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
}: SidebarProps) {
  // Design: frontend/design/html/voleytrack.css:50 and
  // frontend/design/html/voleytrack-admin.css:55 declare the SAME rule for the sidebar —
  // `.sidebar{background:var(--surface);border-right:1px solid var(--border-2);...}` —
  // i.e. the elevated --surface fill (vt-surface) with the subtler --border-2 divider
  // (vt-border-2), NOT the canvas --bg fill and NOT the heavier --border tone.
  //
  // This is deliberately shell-independent. A `variant` prop used to branch it, painting
  // the admin sidebar with the canvas --bg fill instead of --surface, and because the
  // public shell and the admin shell each reached the sidebar by a different path, that
  // one branch was enough to make the two shells disagree. The prop is gone rather than
  // defaulted, so they cannot diverge again. (The banned utility name is deliberately not
  // spelled out here: tokens.test.ts pins this file's whole source against it.)
  //
  // Design: frontend/design/html/voleytrack.css:55
  // `.nav-item.active{background:var(--accent);color:#0b1220;border-color:var(--accent)}` —
  // the accent fill with dark ink on it, which is `--color-vt-background` here. The admin
  // stylesheet (frontend/design/html/voleytrack-admin.css:60) declares the same active
  // rule, so both shells share one nav treatment instead of diverging.
  const activeStateClass =
    "border-vt-accent bg-vt-accent text-vt-background";
  // Design: voleytrack.css:53-54 `.nav-item{...color:var(--muted)...}` and
  // `.nav-item:hover{background:var(--surface-2);color:var(--fg)}`.
  const inactiveStateClass =
    "border-transparent text-vt-muted hover:bg-vt-surface-2 hover:text-vt-text";

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col border-r border-vt-border-2 bg-vt-surface px-3.5 py-5 text-vt-text md:min-h-screen md:w-[248px]">
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
      </div>
    </aside>
  );
}
