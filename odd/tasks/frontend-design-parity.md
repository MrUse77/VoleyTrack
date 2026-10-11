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

- [x] **T01 — Establish the verified pre-change baseline.** Done. Commands, counts and the two
  pre-existing reds are recorded in the Baseline section below.
- [x] **T01b — Make the pre-existing baseline green.** Done. Both pre-existing reds fixed,
  inside three source files plus one new test file.
  - Root cause of the 38 timeouts: **singleton router contamination**, not network, Suspense or a
    render loop. `Transitioner` (`@tanstack/react-router/dist/esm/Transitioner.js:16-23`)
    overwrites `router.startTransition` on mount with a promise that resolves only when a mounted
    `MatchesInner` calls `settleOwner`, and registers **no cleanup** restoring it on unmount. The
    library default is synchronous (`router-core/.../router.js:73`), and `commitLocation`
    (`:400`) calls `load()` before any `RouterProvider` subscribes, so the first rendering test
    navigates with the synchronous default and passes. From the second one on, navigation uses
    the stale acknowledgement closure of a destroyed root: `acknowledgement[0]` is `undefined`,
    `MatchesInner` is gone, `settleOwner` never runs, the promise never resolves, and the
    `await act(...)` block cannot settle.
  - Fix: `router.tsx` exports `routeTree` (inert at runtime) and `router.test.tsx` builds a fresh
    router in `beforeEach` instead of sharing the singleton. No assertion, selector or test name
    was changed.
  - The lint error in `use-match-center-filter.ts` was **not** the cause of the hangs; it was an
    independent defect. Fixed with React's documented adjust-state-during-render pattern and a
    `syncedInitialFilter` guard. The fix also removes an intermediate committed render in which
    the stale filter was briefly visible. Behaviour is otherwise identical across the initial,
    A-B, A-B-A and user-choice cases.
  - The hook had **no real coverage**: the neighbouring suites use `renderToStaticMarkup`, so its
    effect never ran. A new jsdom test file pins it; RED was demonstrated by removing the effect
    (`2 failed | 1 passed`) before applying the fix.
  - Evidence, full suite before/after: `193.11s` with `38 failed | 233 passed` → `3.69s` with
    `275 passed`, exit 0. `router.test.tsx` alone went from ~190s to `1.61s` (`43 passed`).
    `bun run lint` is clean (exit 0, zero diagnostics) and `bun run build` exits 0.
  - Independently verified, including an order-safety attempt to falsify the fix:
    `--sequence.shuffle` with seeds 1, 42, 999, 1234567 and random all give `48/48 files,
    275/275 tests`, and forcing `router.test.tsx` to run last in a full-suite run passes. The fix
    is not order-dependent.
  - Test-count reconciliation, all observed: the recorded 271 predates `d72d9d8`, which added one
    token assertion, so the pre-existing total became 272 (229 non-router + 43 router); the new
    hook test adds 3 more, for 275.
  - Known tooling quirk, not a failure: `--sequence.shuffle` together with
    `--sequence.shuffle.files` crashes the vitest 4.1.11 CLI parser
    (`Cannot create property 'files' on boolean 'true'`). Use one or the other.
  - Two honest caveats carried forward into T10: (a) the new per-test routers never call the
    public `router.history.destroy()` API that `@tanstack/history` exposes, so the file
    accumulates chained `pushState` patches and popstate listeners across its 30 mounts — latent
    today because that file never navigates back or forward, and jsdom isolation confines it to
    the file; (b) of the three new hook tests, the first is a smoke test that would also pass
    without the render-phase sync, so only the other two discriminate.
- [x] **T02 — Vendor the HTML design pack as the canonical design reference.** Done, commit
  `44dd0bf`. 34 files staged under `frontend/design/` only (32 in `html/`, the rewritten
  `README.md`, the audit), verified by listing the staged paths.
- [x] **T03 — Align design tokens with the design pack.** Done. Test-first with observed RED then
  GREEN: `timeout 120 bunx vitest run src/styles/tokens.test.ts` went `2 failed | 8 passed (10)`
  to `10 passed (10)` in 130ms. Added `surface-2`, `muted-2`, `blue`, `accent-soft`,
  `radius-vt`/`radius-vt-sm`, `shadow-vt`, `--font-mono`; set `success: #22c55e` and
  `danger: #ef4444`. Additive only — `vt-panel` and `vt-raised-border` untouched. `index.css`
  needed no change.
  - Verified separately: no regression. Excluding the pre-existing broken file,
    `bunx vitest run --exclude '**/router.test.tsx'` gives `46 passed (46)` / `229 passed` in
    3.16s, exit 0. That reconciles exactly with the baseline (271 - 229 = 42 tests in
    `router.test.tsx` = 38 failed + 4 passed).
  - Verified separately: every new token is emitted into `:root` of the built stylesheet, so
    none of them reproduces the `vt-canvas` silent-failure mode. Their utility classes are
    absent only because no source file consumes them yet.
  - Naming is an interpretation: `--radius-vt`, `--radius-vt-sm` and `--shadow-vt` follow the
    repo's `-vt-` convention because Tailwind v4 namespaces `--radius-*` and `--shadow-*`. The
    design's CSS gives no variable name for the shadow; it appears only in the derived
    `brand-spec.md`.
- [ ] **T03b — Actually load the design fonts.** Discovered while doing T03: the app declares
  `--font-sans: "Inter", system-ui, sans-serif` but **never loads Inter**. There is no
  `@font-face`, no Google Fonts link, no `@fontsource` package and no font reference in
  `index.html`, so the app has been rendering the system font. The design's typography (Inter
  400-900 plus JetBrains Mono) is one of its five stated visual rules, so this is a real parity
  gap and it is **pre-existing**.
  Decision taken by the product owner: **self-host with Fontsource**.  Add
  `@fontsource/inter` and `@fontsource/jetbrains-mono` and import the weights the design uses
  (Inter 400/500/600/700/800/900, JetBrains Mono 500/700). No third-party runtime fetch, works
  offline.
  Files: `frontend/package.json`, `frontend/src/index.css`, plus a test asserting the families
  resolve. Evidence: the emitted build must contain real font files and an `@font-face` block,
  not just the family name.
  Blocked-on nothing; lands in Slice 1 because every screen depends on it.
- [ ] **T04 — Repair the broken accent-contrast utility.** Replace the 20 `text-vt-canvas`
  occurrences across 17 files with `text-vt-background`, and widen the guard in
  `styles/tokens.test.ts` so no source file can introduce the undefined token again. Test-first:
  a whole-`src` guard fails RED while any occurrence remains.
- [ ] **T05 — Replace hardcoded colours with tokens.** Files: `features/auth/LoginPage.tsx`,
  `features/auth/BrandingPanel.tsx`, `features/auth/ChangePasswordPage.tsx`,
  `layouts/PublicShell.tsx`, and `features/public/DashboardPage.tsx:39` which hardcodes
  `shadow-[0_0_0_12px_rgba(76,175,80,0.18)]` — the *old* `#4caf50` green as a literal rgba, which
  is why the retired value still appears in the built stylesheet. `ChangePasswordPage.tsx:80`
  also hardcodes `border-[#334155]`, `hover:bg-[#111a2b]`, `text-white` and `outline-[#ff8c42]`.
  Test-first: assert absence of raw hex and raw colour literals in these files.
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
  Carried over from T01b, since this task already rewrites `router.test.tsx`:
  - dispose each per-test router with the public `router.history.destroy()` API in an `afterEach`,
    so the file stops accumulating chained `pushState` patches and popstate listeners;
  - strengthen the smoke test in `use-match-center-filter.test.tsx` that would pass even without
    the render-phase sync, or relabel it so its weaker guarantee is not mistaken for a pin.
  Note: `src/styles/tokens.test.ts` also references the legacy modules (`shellUtilityBarPath`,
  `navItemPath`, `shellTopbarPath`, `loginPagePath`), so it must be updated in the same commit.

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

Captured before any source change, from `frontend/`.

```
$ bunx vitest run          # package script is `bun run test`
exit 1
Test Files  1 failed | 46 passed (47)
Tests       38 failed | 233 passed (271)
Duration    193.11s (tests 193.97s)

$ bun run build            # tsc -b && vite build
exit 0
1955 modules transformed, built in 416ms
dist/assets/index-C0Zq0ukY.css   84.03 kB | gzip: 15.28 kB
dist/assets/index-B4cp_5hM.js   496.78 kB | gzip: 130.32 kB

$ bun run lint             # eslint .
exit 1
1 problem (1 error, 0 warnings)
  src/features/matches/hooks/use-match-center-filter.ts:19:5
  react-hooks/set-state-in-effect
```

All three results are **PRE-EXISTING**: `git status -- frontend/src` is clean and
`git diff HEAD -- frontend/src` is empty, so nothing here was caused by this work.

No Tailwind warning was emitted for `text-vt-canvas` in any of the three logs. The
undefined utility fails **silently**, which is what let the half-applied migration survive.

### The 38 router failures

Every failure is in `src/router.test.tsx` and every one is
`Error: Test timed out in 5000ms.` attributed to its `it(` line (one of the sites is a
12-case `test.each`, which is why 38 tests are spread over 27 error blocks). The suite is
slow precisely because each of the 38 burns the full 5s timeout (38 x 5s ~= 190s).

Failing sites, all in `src/router.test.tsx`: `144:3, 291:3, 310:3, 332:3, 354:3, 371:3,
388:3, 405:3, 422:3, 440:3, 464:3, 482:3, 501:3, 519:3, 537:3, 555:3, 573:3, 595:3, 617:3,
639:3, 660:3, 694:5, 714:3, 739:3, 769:3, 799:3, 835:3`.

What has been ruled out for those hangs, by grep over `src`:

- **No network.** There is no `fetch(`, `axios` or react-query
  (`useQuery` / `QueryClient`) usage anywhere in `src` outside tests.
- **No suspension mechanism.** No `React.lazy`, no `Suspense`, and no router
  `loader` / `pendingComponent` in `src/router.tsx` or `src/layouts/`.

The failing tests are exactly the ones that render `<RouterProvider router={router} />`
with the module-level router singleton, inside `act()`. Tests that only inspect the
route tree pass.

### Why this blocks the feature

Two ways: it makes every verification run cost ~193s, and `src/router.test.tsx` is the
guard T10 relies on to prove the dead routes are gone. It is therefore repaired as
**T01b** during the foundation slice, before any screen work.

### Environment

- Node `v24.11.1` (repo `engines: ~24`).
- Branch `feature/frontend-init`, upstream `origin/feature/frontend-init`, default `origin/main`.
- `frontend/dist/`, `node_modules/` and `frontend/pnpm-lock.yaml` are **not** covered by
  `.gitignore`, so commits must stage explicit paths and must never use `git add -A`.

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
