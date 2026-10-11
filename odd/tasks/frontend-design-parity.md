# Feature: Frontend design parity with the vendored HTML design pack

**Status:** in progress
**Branch:** `feature/frontend-init`
**Design source (canonical):** `frontend/design/html/` — 21 screens, 8 CSS files, `brand-spec.md`
**Created:** 2026-10-11

## Problem

A newer design revision of the VoleyTrack web app arrived as a static HTML/CSS pack
(`voleytrack-proyecto-2026-10-11.zip`). The React implementation in `frontend/src/` currently
implements an **older** revision of the same design. The design pack is now the only design
source of truth: the previous `voleytrack-webapp-design.op` / `.pen` canvas documents are
discarded by explicit user decision.

Measured gap (evidence: read-only exploration of `frontend/design/html/**` vs `frontend/src/**`):

- Tokens are ~80% aligned but missing `surface-2`, `muted-2`, `blue`, `accent-soft`, radius
  tokens, a mono family and the shadow; `success` and `danger` conflict with the design.
- A second, legacy component system exists in parallel (`components/ui/*`,
  `ShellTopbar`/`ShellUtilityBar`/`ShellFooter`) plus dead routes and orphaned pages.
- Primitives defined by the design are missing: `Chip`, `state-pill`, `live-pill`, filter
  group, toast, and the mono tabular numeric treatment.
- `Card` lacks the design's `card-h` / `card-b` sub-parts; `Button` uses an 8px radius where
  the design specifies a pill.
- Four design screens have no React counterpart at all.

### Confirmed defect found during exploration

`text-vt-canvas` is used in 20 places across 17 files, but `--color-vt-canvas` does not exist in
`frontend/src/styles/tokens.css`, so Tailwind never generates the utility. Verified against the
compiled stylesheet: `dist/assets/index-DWyM9xV2.css` contains `text-vt-background` but no
`vt-canvas`. Text on accent-filled buttons and tabs therefore falls back to inherited colour
instead of the design's `#0b1220` (`.btn.accent{color:#0b1220}`). `styles/tokens.test.ts:173`
guards only one file against this token, so the migration was left half-applied.

## Decisions (locked by the user)

1. **Phasing:** foundation first. Tokens, primitives, shell and legacy cleanup land before any
   per-screen rework, so the app is never inconsistently half-migrated.
2. **Legacy system:** delete the duplicate system, the dead routes and the orphaned pages.
3. **Palette conflicts:** the design CSS wins — `success: #22c55e`, `danger: #ef4444`
   (`frontend/design/html/voleytrack.css`), not the values in `brand-spec.md`.
4. **Missing screens:** all four are in scope.

## Non-goals

- No backend, API, or data-model changes. This is a presentation-layer alignment.
- No new runtime dependency for fonts beyond what the design requires; if `JetBrains Mono` is
  adopted it is declared with `ui-monospace` fallbacks and does not block rendering.
- The discarded `.op` / `.pen` canvas documents are not migrated or repaired.
- Push, pull request and merge stay user decisions.

## Verification strategy

- Test suite: see the baseline record below for the exact command and count.
- Test-first applies to primitives and to the token/utility repairs, because a meaningful RED is
  available: the existing suite asserts on source contents (`styles/tokens.test.ts`,
  `components/primitives/core.test.tsx`) and component behaviour is directly testable with jsdom.
- Structural/documentation work (vendoring, deletions) uses a structural readback instead:
  confirm the file set and that remaining consumers resolve.
- Every task closes with a work-unit commit on the feature branch; evidence is recorded per task.

## Slices and tasks

### Slice 1 — Foundation

- [ ] **T01 — Establish the verified pre-change baseline.** Run the suite, build, lint and
  record pass/fail, counts and any pre-existing failure. Deliverable: this document's baseline
  block. Evidence: exact commands and final summary lines.
- [ ] **T02 — Vendor the HTML design pack as the canonical design reference.** Files:
  `frontend/design/html/**` (21 HTML, 8 CSS, `brand-spec.md`, `README.md`, `imagen.png`) and an
  update to `frontend/design/README.md` that names the HTML pack as the implementation reference
  and records the `.op`/`.pen` retirement. Excluded: the `.pen`/`.op` canvases and the reference
  screenshot crops. Test: structural readback of the file set.
- [ ] **T03 — Align design tokens with the design pack.** Files: `frontend/src/styles/tokens.css`,
  `frontend/src/index.css`, `frontend/src/styles/tokens.test.ts`. Add `surface-2`, `muted-2`,
  `blue`/accent-2, `accent-soft`, radius tokens, mono family and shadow; set
  `success: #22c55e` and `danger: #ef4444`; resolve `raised-border` which the design does not
  define. Test-first: extend the token assertions and observe RED before editing `tokens.css`.
- [ ] **T04 — Repair the broken accent-contrast utility.** Replace the 20 `text-vt-canvas`
  occurrences across 17 files with `text-vt-background`, and widen the guard in
  `styles/tokens.test.ts` so no source file can introduce the undefined token again. Test-first:
  a whole-`src` guard fails RED while any occurrence remains.
- [ ] **T05 — Replace hardcoded hex colours with tokens.** Files: `features/auth/LoginPage.tsx`,
  `features/auth/BrandingPanel.tsx`, `features/auth/ChangePasswordPage.tsx`,
  `layouts/PublicShell.tsx`. Test-first: assert absence of raw hex in these files.
- [ ] **T06 — Add the primitives the design defines but the app lacks.** New:
  `Chip`, `StatePill` (programado / en vivo / finalizado), `LivePill` with the pulse dot,
  a filter group, and a toast surface. Test-first: one test per primitive covering its variants
  and its accessible role.
- [ ] **T07 — Align `Card` and `Button` with the design spec.** `Card` gains the `card-h` /
  `card-b` structure; `Button` moves from the 8px radius to the design's pill radius. Guard
  against regressions in the existing primitive tests.
- [ ] **T08 — Add the mono tabular numeric treatment.** Introduce the design's `.num`
  equivalent (mono family, `tabular-nums`, right alignment) and apply it to the numeric columns
  of the shared table primitive.
- [ ] **T09 — Align the shell with the design.** `layouts/PublicShell.tsx`,
  `layouts/AdminShell.tsx`, `components/navigation/Sidebar.tsx`,
  `components/primitives/PageHeader.tsx`: 72px topbar, 248px sidebar, accent-driven active
  state, and the design's 28px page heading.
- [ ] **T10 — Remove the legacy duplicate component system.** Delete `components/ui/*`,
  `ShellTopbar`/`ShellUtilityBar`/`ShellFooter`, the dead routes `/results`, `/gallery` and
  `/fantasy`, and the orphaned `pages/LoginPage.tsx` / `pages/MatchesPage.tsx`, after migrating
  every live consumer (`layouts/AppShell.tsx`, `pages/AdminPage.tsx`, `pages/PlanilleroPage.tsx`
  and the live routes). Test: the router test must cover the surviving route set and prove the
  dead ones are gone.

### Slice 2 — Public (spectator) screens

- [ ] **T11 — Dashboard parity.** Hero-first live match card, "Próximos destacados / HOY" rail.
- [ ] **T12 — Matches parity.** Filter panel, 6-card grid, state pills.
- [ ] **T13 — Tournaments parity.** Card grid with type filters; detail with Clasificación TOP 5,
  Llaves de playoffs, Equipos participantes and the bracket.
- [ ] **T14 — Teams parity.** New `/teams` list (currently a placeholder) and a team detail with
  the design's four tabs plus the "Rendimiento Últimos 5" badges.
- [ ] **T15 — Players parity.** New `/players` list (currently a placeholder) and a player detail
  with the design's KPI grid.
- [ ] **T16 — Live match parity.** Timeline, court with positions, scoreboard.

### Slice 3 — Admin screens

- [ ] **T17 — Staff gestión parity.** Staff table and edit modal on one screen, replacing the
  register-only route.
- [ ] **T18 — Admin tournaments parity.** List plus create/nuevo-torneo forms.
- [ ] **T19 — Admin tournament overview and bracket.** The `ver-copa` bracket view and the
  overview (Información, Formato, Equipos, Llaves) the admin side is missing.
- [ ] **T20 — Admin edit tournament.** New route and screen (`ver-editar`), no React counterpart.
- [ ] **T21 — Admin teams parity.** List plus create with the design's inline roster builder
  (replacing the two-modal flow).
- [ ] **T22 — Admin team detail.** New route and screen, no React counterpart.
- [ ] **T23 — Admin players parity.** List plus create.
- [ ] **T24 — Admin matches parity.** List plus create.

### Slice 4 — Scoring

- [ ] **T25 — Planillero parity.** Replace the current control-room screen with the design's
  assigned-matches list → selected match → setup flow, on the shared primitives instead of the
  legacy system.

## Baseline (T01)

_Pending — recorded below when the baseline verification completes._

## Risks

- **Review workload.** ~35–45 files. Mitigated by the foundation-first phasing and one commit
  per task; each task is intended to stay reviewable on its own.
- **Token change ripple.** Adding and renaming tokens can silently change surfaces across every
  screen; mitigated by the existing source-level token tests plus per-screen verification in
  slices 2–4.
- **`success` / `danger` shift** alters existing status colours, including the live indicators;
  the change is intentional per the design CSS and needs a visual check on the matches, live and
  tournament standings screens.
- **Legacy removal** touches routes that tests still reference; the router test is the guard and
  must be updated in the same commit.
