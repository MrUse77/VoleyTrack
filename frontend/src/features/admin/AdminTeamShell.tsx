import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { PageHeader } from "../../components/primitives/PageHeader";
import { teamTabs, type TeamJourneyContext, type TeamRouteTab } from "../public/TeamJourney";

/**
 * The admin team detail's frame: the design's page head over its `.detail-tabs` strip.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-equipo.html — `.page-head` with a 42px
 * square identity tile, the team name and a `badge ok` tournament pill, plus the `Volver` /
 * `Editar equipo` actions; then `.detail-tabs` (Detalle · Plantel (n) · Partidos ·
 * Estadísticas) and the active panel.
 *
 * The tab *set* is the shared `teamTabs`, so the admin and public team details cannot drift on
 * a label or a suffix. The strip's treatment is not shared: the admin design's `.detail-tab`
 * (voleytrack-admin.css:279-282) is a bare 36px pill, while the public team detail renders a
 * bordered `--surface-2` bar with a trailing note, so each side paints its own design over the
 * one shared list.
 *
 * The `Editar equipo` action points at the create screen, which is the design's own href
 * (`voleytrack-admin-crear-equipo.html`); the app has no separate team edit screen, and the
 * design's link is prototype shorthand for it.
 */
export function AdminTeamShell({
  activeTab,
  children,
  context,
}: {
  activeTab: TeamRouteTab;
  children: ReactNode;
  context: TeamJourneyContext;
}) {
  const { team, detail } = context;
  const rosterCount = detail ? detail.rosterStats.length : team.rosterPlayerIds.length;

  return (
    <div className="mx-auto w-full max-w-[1104px]" data-testid="admin-team-detail-content">
      <PageHeader
        actions={
          <>
            <Link className={buttonClasses("ghost")} to={"/admin/teams" as string}>
              <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>
            <Link className={buttonClasses("primary")} to={"/admin/teams/create" as string}>
              Editar equipo
            </Link>
          </>
        }
        className="mb-[22px]"
        description="Plantel, partidos y estadísticas del equipo."
        title={
          <span className="flex items-center gap-3">
            {/* Design: `style="width:42px;height:42px;border-radius:12px;background:#3b82f6"`,
                i.e. the design's own `--blue` token (`--color-vt-blue`). */}
            <span
              aria-hidden="true"
              className="grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-vt-blue text-[18px] font-black text-vt-background"
            >
              {team.name.slice(0, 1).toUpperCase()}
            </span>
            {team.name}
            <Badge variant="ok">{detail?.tournamentName ?? team.category}</Badge>
          </span>
        }
      />

      {/* Design: the four `.detail-tab`s are in-place buttons in the prototype because its
          panels are toggled in place. Here each tab is a real route, so the strip is a labelled
          navigation whose current entry is marked with `aria-current="page"`. */}
      <nav
        aria-label={`Contenido de ${team.name}`}
        className="mb-4 flex flex-wrap gap-2"
        data-testid="admin-team-tabs"
      >
        {teamTabs(rosterCount).map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-9 items-center rounded-full border px-[14px] text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                isActive
                  ? "border-vt-text bg-vt-text text-vt-background"
                  : "border-vt-border bg-vt-surface text-vt-muted hover:border-vt-border-hover hover:text-vt-text"
              }`}
              key={tab.id}
              to={`/admin/teams/${team.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div data-testid="admin-team-tab-panel">{children}</div>
    </div>
  );
}
