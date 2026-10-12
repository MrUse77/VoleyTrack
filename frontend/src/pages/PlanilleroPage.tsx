import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Card, CardBody, CardHeader } from "../components/primitives/Card";
import { EmptyState } from "../components/primitives/EmptyState";
import { PageHeader } from "../components/primitives/PageHeader";
import { StatePill } from "../components/primitives/StatePill";
import { buttonClasses } from "../components/primitives/buttonClasses";
import { ADMIN } from "../fixtures";

/**
 * The planillero's own screen.
 *
 * Design: frontend/design/html/voleytrack-planillero.html — one page with two views toggled by
 * `hidden`.
 *
 * `#assigned-view` is a `.page-head` ("Partidos asignados" over "Selecciona un partido programado
 * para preparar la planilla.") above a `.match-list` of `.match-card.match-select` buttons, each a
 * `minmax(0,1fr) auto auto` grid at an 18px gap with `padding:16px 18px`, a 1px `--border` edge and
 * a 14px radius on `--surface`, holding a bold "Local vs Visitante" title, the `Torneo · fecha`
 * `.match-meta` line and a `.state-pill.s-programado`. With nothing programmed the list is replaced
 * by `.card.empty-state`, whose `role="status"` says "No hay partidos creados" over "Los partidos
 * programados por administración aparecerán aquí.".
 *
 * `#setup-view` is a `.page-head` whose `.match-source` eyebrow, "Setup" heading and `Torneo · fecha`
 * meta carry the selected match's context over a "Volver a partidos" ghost action, then a `.card`
 * whose `.card-h` is "Partido seleccionado" with the `Estado: Programado` eyebrow and whose `.card-b`
 * holds the `setup-grid` (`1fr auto 1fr`, 18px gap, centred): two `.setup-team` blocks (18px padding,
 * a 1px `--border-2` edge, a 12px radius, the `--bg` fill, 16px/800) around a `.setup-versus`
 * separator ("contra", mono 11px/800 uppercase `--muted`), then the `.form-actions` row above a
 * 1px `--border-2` rule holding the accent "Iniciar partido" control.
 *
 * Deliberate divergences, each decided by the design rather than by preference:
 * - The design's eyebrow sits above the heading and the heading is a focus target (`tabindex="-1"`),
 *   so `PageHeader` gained the opt-in `eyebrow` and `headingRef` props it needed; both are inert for
 *   every other page.
 * - The design's `#assigned-view` is `hidden` while `#setup-view` renders, so the list is unmounted
 *   on selection. There is therefore no in-list "selected" treatment to expose: the selection is
 *   stated in words by the setup view itself (`Partido seleccionado`, the two team names, the state
 *   eyebrow and the tournament/date meta), and "Volver a partidos" returns focus to the match that
 *   was selected. Nothing on this screen communicates state by colour alone.
 * - The design prints no badge, no numeric cell and no identity disc, so `Badge`, `Num` and
 *   `Avatar` have no counterpart here, and `#setup-view` models no form control at all — so there is
 *   no label, `aria-describedby` or `aria-invalid` wiring on this screen to keep.
 * - The design's match row declares three grid tracks because the admin matches card fills the third
 *   with its `.match-source` eyebrow. The planillero renders two children (the info block and the
 *   state pill), so the third, empty track is dropped; the rendered result is the same row.
 * - The design's `renderMatches` sorts on a machine `scheduledAt` its own prototype data carries.
 *   `AdminMatchFixture` has no machine instant — only the human `scheduledLabel` the admin matches
 *   screen already prints — so the list renders in store order rather than sorting on a display
 *   string. A real sort needs a real timestamp; none is invented here.
 * - The design's "Iniciar partido" writes the match's status to its store and opens the live screen.
 *   The app's fixtures are immutable, so the control is a link to this planillero's own live surface,
 *   `/admin/matches/$id/scoring`, which is the destination the retired artboard sequence modelled.
 *
 * Routing reconciliation: the design toggles both views in place and remembers the selection in the
 * browser's own key/value store. This app renders one view per route and carries view state in the
 * search string (the staff dialog's `?editar=`, the console's `?modal=`, point entry's `?step=`), so
 * the selected match is `?partido=<id>` on the same, unchanged `/planillero` path: the setup view
 * becomes linkable and reloadable, "Volver a partidos" is a real href rather than a script that
 * unhides a div, and the admin navigation's `/planillero` destination does not move.
 */

/**
 * The design filters the store on the literal word `Programado`. In this app the status dimension
 * is the fixture's `status` and `statusLabel` is the per-match badge word the public data carries
 * ("Programado" on two matches and "Próximo" on another), so the filter is on the dimension and the
 * row renders the design's `programado` state pill. `AdminMatchesPage` already renders `upcoming`
 * as "Programado", so the two screens agree on the word.
 *
 * The filter runs per render rather than at module scope so the empty branch is a live branch of
 * the screen instead of a state that can never be reached.
 */
function assignedMatches() {
  return ADMIN.matches.filter((match) => match.status === "upcoming");
}

export function PlanilleroPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const matches = assignedMatches();
  const selectedId = typeof location.search.partido === "string" ? location.search.partido : "";
  const selectedMatch = matches.find((match) => match.id === selectedId);
  const selected = selectedMatch?.id ?? "";

  // The design moves focus into the view it just opened — the setup heading — and back to the
  // match the user came from when it returns to the list. Both moves are the design's own
  // (`document.getElementById('match-setup-title').focus()` and `list.querySelector('button')?.focus()`);
  // the return targets the *selected* row rather than the first one, so the user lands where they
  // left. The selection is remembered from the resolved view rather than from the click, so a
  // reloaded or linked setup URL returns correctly too. A first mount with no selection moves
  // nothing at all, so a direct visit never steals focus.
  const setupTitleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastSelectedId = useRef("");

  useEffect(() => {
    if (selected) {
      lastSelectedId.current = selected;
      setupTitleRef.current?.focus();
      return;
    }

    if (!lastSelectedId.current) return;

    const list = listRef.current;
    const target =
      list?.querySelector<HTMLAnchorElement>(`a[data-match-id="${lastSelectedId.current}"]`) ??
      list?.querySelector<HTMLAnchorElement>("a[data-match-id]");

    lastSelectedId.current = "";
    target?.focus();
  }, [selected]);

  if (selectedMatch) {
    return (
      <div className="mx-auto w-full max-w-[960px]" data-testid="planillero-screen">
        <PageHeader
          actions={
            <Link className={buttonClasses("ghost")} to={"/planillero" as string}>
              Volver a partidos
            </Link>
          }
          className="mb-[22px]"
          description={`${selectedMatch.tournamentName} · ${selectedMatch.scheduledLabel}`}
          eyebrow="Preparación del partido"
          headingRef={setupTitleRef}
          title="Setup"
        />

        {/* Design: `#match-setup-card` (voleytrack-planillero.html:27-30) — `.card` > `.card-h`
            ("Partido seleccionado" plus the `Estado: Programado` eyebrow) > `.card-b` holding the
            `setup-grid` and the `.form-actions` row. */}
        <Card padded={false}>
          <CardHeader data-testid="planillero-setup-card-head">
            Partido seleccionado <small>Estado: Programado</small>
          </CardHeader>
          <CardBody data-testid="planillero-setup-card-body">
            {/* Design: `.setup-grid{grid-template-columns:1fr auto 1fr;gap:18px;text-align:center}`
                (voleytrack-admin.css:213) collapsing to one column below 700px (line 219).
                `#setup-home`, `.setup-versus` and `#setup-away` carry no wrapper role in
                `voleytrack-planillero.html:29`, so the grid stays a plain box: the two block texts
                plus "contra" already read as the matchup, and no heading is invented for the
                document outline. */}
            <div
              className="grid gap-[18px] text-center min-[701px]:grid-cols-[1fr_auto_1fr] min-[701px]:items-center"
              data-testid="planillero-setup-grid"
            >
              <div
                className="rounded-[12px] border border-vt-border-2 bg-vt-background p-[18px] text-[16px] font-extrabold text-vt-text"
                data-testid="planillero-setup-team"
              >
                {selectedMatch.homeTeamName}
              </div>
              <p
                className="m-0 font-mono text-[11px] font-extrabold text-vt-muted uppercase"
                data-testid="planillero-setup-versus"
              >
                contra
              </p>
              <div
                className="rounded-[12px] border border-vt-border-2 bg-vt-background p-[18px] text-[16px] font-extrabold text-vt-text"
                data-testid="planillero-setup-team"
              >
                {selectedMatch.awayTeamName}
              </div>
            </div>
            {/* Design: `.form-actions{display:flex;gap:10px;justify-content:flex-end;
                margin-top:22px;padding-top:18px;border-top:1px solid var(--border-2)}`
                (voleytrack-admin.css:187). */}
            <div
              className="mt-[22px] flex justify-end gap-[10px] border-t border-vt-border-2 pt-[18px]"
              data-testid="planillero-setup-actions"
            >
              <Link
                className={buttonClasses("primary")}
                data-testid="planillero-start-match"
                to={`/admin/matches/${selectedMatch.id}/scoring` as string}
              >
                Iniciar partido
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[960px]" data-testid="planillero-screen">
      <PageHeader
        className="mb-[22px]"
        description="Selecciona un partido programado para preparar la planilla."
        title="Partidos asignados"
      />

      {matches.length === 0 ? (
        /* Design: `.card.empty-state` (voleytrack-admin.css:202-204, `#assigned-empty`) — a card
           whose body is the centred empty state, announced through `role="status"`. */
        <Card padded={false}>
          <EmptyState
            description="Los partidos programados por administración aparecerán aquí."
            title="No hay partidos creados"
          />
        </Card>
      ) : (
        <ul
          aria-label="Partidos asignados"
          className="grid list-none gap-3 p-0"
          data-testid="planillero-assigned-matches"
          ref={listRef}
        >
          {matches.map((match) => (
            <li key={match.id}>
              {/* Design: `.match-card.match-select` (voleytrack-admin.css:198-212) — a
                  `minmax(0,1fr) auto auto` row at an 18px gap with `padding:16px 18px`, a 1px
                  `--border` edge and a 14px radius on `--surface`; below 700px it collapses to one
                  column at an 8px gap. Its focus-visible is the accent edge plus a 3px accent outline
                  at 3px offset and a 5px `--bg` shadow. The row is an anchor rather than the design's
                  `<button>`: selecting a match is a URL change here, so the element is the one that
                  can carry the href, and the title stays a real heading outside a button's phrasing
                  content model. */}
              <Link
                className="grid w-full gap-2 rounded-[14px] border border-vt-border bg-vt-surface px-[18px] py-4 text-left transition-colors hover:border-vt-accent/60 focus-visible:border-vt-accent focus-visible:shadow-[0_0_0_5px_var(--color-vt-background)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-vt-accent min-[701px]:grid-cols-[minmax(0,1fr)_auto] min-[701px]:items-center min-[701px]:gap-[18px]"
                data-match-id={match.id}
                search={{ partido: match.id }}
                to={"/planillero" as string}
              >
                <span className="min-w-0">
                  {/* The design's `.match-card h2` is 15px at line-height 1.3 and keeps the
                      heading's default weight, which Tailwind's preflight resets to 400. */}
                  <h2 className="m-0 text-[15px] font-bold leading-[1.3] text-vt-text">
                    {match.homeTeamName} vs {match.awayTeamName}
                  </h2>
                  <span className="mt-1 block text-[12px] text-vt-muted">
                    {match.tournamentName} · {match.scheduledLabel}
                  </span>
                </span>
                <StatePill status="programado" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
