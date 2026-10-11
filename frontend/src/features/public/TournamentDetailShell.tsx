import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { InfoRow } from "../../components/primitives/InfoRow";
import { Kpi, KpiGrid } from "../../components/primitives/Kpi";
import { PageHeader } from "../../components/primitives/PageHeader";
import type { TournamentFixture } from "../../fixtures";
import { badgeVariantByStatus, tournamentTabs, type TournamentTab } from "./tournamentTabs";

/**
 * The tournament detail's shared frame: everything the design renders outside its
 * `.tor-tabs` strip.
 *
 * Design: frontend/design/html/voleytrack-torneos.html — `.page-head` with the title and a
 * status badge plus the "Volver" ghost button; `.tor-detail-kpis` (four columns, two below
 * 1200px, one below 600px, voleytrack-torneos.css:38-40); a `.card` whose `.card-h` reads
 * "Información" with a `DATOS GENERALES` eyebrow and whose `.card-b` holds the `.info-row`
 * list; and the `section.card.tor-competition` that wraps the tab strip
 * (`.tor-tabs`: 12px 18px padding, --surface-2 fill, 1px --border-2 underline,
 * voleytrack-torneos.css:45-50) and the active panel.
 *
 * The design has no `Resumen` tab because this whole region is unconditional there. The app
 * keeps a route for it, so the region is rendered by this shell on every tab and the
 * `Resumen` route contributes no panel of its own.
 *
 * The same frame also renders the ADMIN tournament detail
 * (frontend/design/html/voleytrack-admin-ver-torneo.html and voleytrack-admin-ver-copa.html),
 * whose page head, KPI tiles, `Información` card and `.tournament-tabs` strip are the same
 * regions over the same `TournamentFixture`. Everything the two sides differ on is an
 * explicit prop below (`backTo`, `basePath`, `tabs`, `actions`, `sidePanel`) rather than a
 * second copy of the frame; the public defaults reproduce the public markup exactly.
 */
export function TournamentDetailShell({
  activeTab,
  actions,
  backTo = "/tournaments",
  basePath = "/tournaments",
  children,
  sidePanel,
  tabs = tournamentTabs,
  tournament,
}: {
  activeTab: string;
  /** Extra page-head controls, rendered after the design's `Volver` ghost button. */
  actions?: ReactNode;
  backTo?: string;
  basePath?: string;
  children: ReactNode;
  /**
   * A second card beside `Información`, for the design's `.detail-grid` (1fr 1fr, one column
   * below 900px, voleytrack-admin.css:114-116). The cup detail pairs `Información` with
   * `Formato`; the league detail is `.detail-grid--single` and passes nothing.
   */
  sidePanel?: ReactNode;
  tabs?: readonly TournamentTab[];
  tournament: TournamentFixture;
}) {
  const bracketMatches = tournament.bracketRounds.reduce((total, round) => total + round.matches.length, 0);
  const infoCard = (className: string) => (
    <Card className={className} padded={false}>
      <CardHeader>
        Información
        <small>DATOS GENERALES</small>
      </CardHeader>
      <CardBody data-testid="tournament-info-card-body">
        <InfoRow label="Nombre" value={tournament.name} />
        <InfoRow label="Tipo" value={tournament.typeLabel} />
        <InfoRow label="Categoría" value={tournament.category} />
        <InfoRow label="Sede" value={tournament.location} />
        <InfoRow label="Fechas" value={tournament.dateLabel} />
        <InfoRow label="Equipos" value={String(tournament.standings.length)} />
        <InfoRow label="Estado" value={tournament.statusLabel} />
      </CardBody>
    </Card>
  );

  return (
    <div className="mx-auto w-full max-w-[1104px]" data-testid="tournament-detail-content">
      <PageHeader
        actions={
          <>
            <Link className={buttonClasses("ghost")} to={backTo as string}>
              <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>
            {actions}
          </>
        }
        className="mb-[22px]"
        description={`Detalle del torneo · ${tournament.category} · ${tournament.dateLabel}`}
        title={
          <>
            {tournament.name}{" "}
            <Badge variant={badgeVariantByStatus[tournament.status]}>{tournament.statusLabel}</Badge>
          </>
        }
      />

      {/* Design: `.tor-detail-kpis` — four KPI tiles. The design's fourth label is
          "Jornada" ("14" of 34); the app has no matchday count in its fixtures, so the tile
          reports the bracket round count it does have instead of printing an invented one. */}
      <KpiGrid>
        <Kpi label="Equipos" sub={tournament.category} value={String(tournament.standings.length)} />
        <Kpi label="Partidos" sub={`${bracketMatches} en llaves`} value={String(bracketMatches)} />
        <Kpi label="Rondas" sub="Eliminación directa" value={String(tournament.bracketRounds.length)} />
        <Kpi label="Finaliza" sub={tournament.location} value={tournament.dateLabel} />
      </KpiGrid>

      {sidePanel ? (
        <div className="mb-4 grid gap-4 min-[901px]:grid-cols-2">
          {infoCard("")}
          {sidePanel}
        </div>
      ) : (
        infoCard("mb-4")
      )}

      <Card padded={false}>
        {/* Design: `.tor-tabs` is a `role="tablist"` in the prototype because its panels are
            toggled in place. Here each tab is a real route, so the strip is a labelled
            navigation whose current entry is marked with `aria-current="page"` — the
            accessible hook the shell's accent probe already reads. */}
        <nav
          aria-label={`Contenido de ${tournament.name}`}
          className="flex flex-wrap gap-2 border-b border-vt-border-2 bg-vt-surface-2 px-[18px] py-3"
          data-testid="tournament-tabs"
        >
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex h-9 items-center rounded-full border px-[14px] text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent ${
                  isActive
                    ? "border-vt-text bg-vt-text text-vt-background"
                    : "border-vt-border bg-vt-surface text-vt-muted hover:border-vt-border-hover hover:text-vt-text"
                }`}
                key={tab.value}
                to={`${basePath}/${tournament.id}${tab.suffix}` as string}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div data-testid="tournament-tab-panel">{children}</div>
      </Card>
    </div>
  );
}

/**
 * The header of a panel inside the competition card.
 *
 * Design: voleytrack-torneos.css:53-55
 *   .tor-tab-panel .card-h,.tor-section>.card-h{padding:16px 18px;border-bottom:1px solid var(--border-2)}
 * — the panel header is the card header at a tighter 16px 18px with a bottom rule, so it is
 * its own treatment rather than `CardHeader`'s borderless `18px 20px 0`.
 */
export function TournamentPanelHeader({ children, eyebrow }: { children: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-vt-border-2 px-[18px] py-4 text-[14px] font-extrabold tracking-[-0.01em] text-vt-text [&_small]:font-mono [&_small]:text-[11px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[0.06em] [&_small]:text-vt-muted">
      <span>{children}</span>
      {eyebrow ? <small>{eyebrow}</small> : null}
    </div>
  );
}

/**
 * The unknown-id fallback, shared by the five detail routes so the five copies of the old
 * inline card cannot drift. `EmptyState` is the app's announced `role="status"` block; the
 * design has no counterpart because its prototype never resolves a missing tournament.
 */
export function TournamentNotFound() {
  return (
    <Card padded={false}>
      <EmptyState
        description="El torneo que buscás no está disponible."
        title="Torneo no encontrado"
      />
      <div className="px-5 pb-[18px]">
        <Link className={buttonClasses("ghost")} to="/tournaments">
          ← Volver a torneos
        </Link>
      </div>
    </Card>
  );
}
