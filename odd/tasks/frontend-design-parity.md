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

`text-vt-canvas` is used in 19 places across 17 files, but `--color-vt-canvas` does not exist in
`frontend/src/styles/tokens.css`, so Tailwind never generates the utility. Verified against the
compiled stylesheet: `dist/assets/index-DWyM9xV2.css` contains `text-vt-background` but no
`vt-canvas`. Text on accent-filled buttons and tabs therefore falls back to inherited colour
instead of the design's `#0b1220` (`.btn.accent{color:#0b1220}`). `styles/tokens.test.ts:173`
guards only one file against this token, so the migration was left half-applied.

(An earlier version of this document said 20 occurrences. That was wrong: a `grep` for
`vt-canvas` returns 20 lines, but one of them is the guard test's own assertion literal rather
than a usage. The count is 19, and 17 files with two files using it twice is consistent with 19,
not 20.)

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
- [x] **T03b — Load the design fonts and pin the package manager.** Done.
  - Pre-existing parity gap: the app declared `"Inter"` in `--font-sans` but **never loaded it** —
    no `@font-face`, no Google Fonts link, no `@fontsource` package, no font reference in
    `index.html` — so it had been rendering the system font, while the design pack loads Inter
    400-900 plus JetBrains Mono and its brand spec calls that typography part of the system.
  - Product-owner decision: self-host with Fontsource, and make **pnpm** the canonical manager.
  - Change: `packageManager: pnpm@12.6.0` in `frontend/package.json`; `frontend/bun.lock` deleted
    with `git rm`; `@fontsource/inter` and `@fontsource/jetbrains-mono` added; eight `latin-*`
    entry points imported into `frontend/src/index.css` (Inter 400/500/600/700/800/900, JetBrains
    Mono 500/700); `tokens.css` deliberately untouched, since the existing family names start
    resolving once real `@font-face` rules exist.
  - The `latin-*` entry points were chosen with evidence: `grep -c @font-face` gives 1 block for
    `latin-400.css` versus 7 for `400.css`, which also ships cyrillic, greek and vietnamese.
  - Test-first with observed RED then GREEN: the new `frontend/src/styles/fonts.test.ts` failed
    with `2 failed | 1 passed (3)` before the imports existed, then passed `3 passed (3)`. Its
    discriminating power was checked by temporarily removing one import (`1 failed | 2 passed`)
    and restoring it byte-identically.
  - Evidence that the fonts are genuinely in the build, not just declared: 16 font files emitted
    into `dist/assets/` — 8 `.woff2` (188,784 B) plus 8 `.woff` (242,952 B), 431,736 B total —
    with 8 `@font-face` blocks (6 `Inter`, 2 `JetBrains Mono`) and every `src` pointing at a local
    asset. No third-party font origin remains anywhere in the build.
  - Suite `49 files / 278 passed`, exit 0; `pnpm run lint` exit 0 with zero diagnostics;
    `pnpm run build` exit 0, 1955 modules.
  - Correction to the parent's own arithmetic: the predicted "48 files / 276 passed" was wrong — a
    new test file adds a file and `fonts.test.ts` holds three tests, so 49 files and 278 tests is
    the correct expected value.
  - Caveat on one guard, honestly reported rather than papered over: the requested
    `git diff frontend/pnpm-lock.yaml` guard was **unexecutable**, because that lockfile was
    untracked and therefore had no diff baseline. The substitute evidence was pnpm reporting
    `+2` with no updated entries, snapshot entries going 332 to 334, and only the two
    `@fontsource` directories in `node_modules/.pnpm` carrying a new mtime. That guard becomes
    executable from now on, since the lockfile is being committed.
- [ ] **T03c — Trim the font payload.** Raised by T03b: the eight legacy `.woff` fallbacks are
  242,952 B, **56% of the 431,736 B added**, and no browser that supports the app's modern stack
  needs them over `.woff2`. Investigate and decide between the Fontsource variable-font packages
  (a single weight-axis file per subset instead of six static weights), a custom `@font-face`
  block that keeps only `.woff2`, or leaving it as is. Report the real byte trade-off with the
  installed packages' actual contents, then decide. Optimisation only: the current state works
  and is verified, so this is not a correctness task and must not regress the fonts.
- [x] **T04 — Repair the broken accent-contrast utility.** Done. Replaced **19** occurrences
  across 17 files with `text-vt-background`.
  - The guard was widened from one file to the whole source tree: `tokens.test.ts` now walks
    `src` recursively with `readdirSync(..., { withFileTypes: true })`, asserts
    `sourceFiles.length > 0` so it cannot pass vacuously, deliberately has no `try/catch` so read
    errors fail the test, and reports offenders as a `file:line` list. Test-first with observed
    RED: the widened guard failed with `expected [ …(19) ] to deeply equal []`, naming all 19
    offenders, before any replacement was made.
  - Diff audit of the fix: 19 lines removed, 19 lines added, every added line containing
    `text-vt-background`, and zero other added lines. No non-`text-` usage of the token existed;
    the one prefixed variant is `min-[1416px]:text-vt-canvas`, which is still a text-colour use.
  - Evidence that the replacement reached CSS, which matters because the original failure was
    silent: the built stylesheet contains **3** `text-vt-background` occurrences
    (`.text-vt-background`, `.focus\:text-vt-background`, `.min-\[1416px\]\:text-vt-background`),
    **zero** `vt-canvas`, and resolves to `color:var(--color-vt-background)` with
    `--color-vt-background:#0b1220` — the design's dark ink on accent surfaces.
  - Suite `49 files / 279 passed` (278 plus the new guard test), exit 0; lint exit 0 with zero
    diagnostics; build exit 0.
  - Known limitation carried into T10: the guard skips `tokens.test.ts` itself, because that
    file's own assertion literal contains the banned substring. A smarter guard that matches a
    class-like occurrence (for example a `text-vt-canvas` / `bg-vt-canvas` shape, which the bare
    quoted literal does not satisfy) would cover the whole tree including the guard file.
  - The worker also reported one process deviation honestly: an intermediate test run wrote its
    log to `/tmp`, outside its allowed surfaces. No repository file was affected.
- [x] **T05 — Replace hardcoded colours with tokens.** Done for the auth, layout and dashboard
  surfaces: 20 offending lines converted.
  - Decisions, each read from the design rather than inferred: `#111a2b` to `bg-vt-surface`,
    `#0b1220` to `bg-vt-background`, `#ff8c42` to `bg-vt-accent`, `#94a3b8` to `text-vt-muted`,
    `#64748b` to `placeholder:text-vt-muted-2`, `#334155` to `border-vt-raised-border`, and
    `text-white` to `text-vt-text` (the design's `--fg`).
  - Two tokens were added because the design defines values React did not have:
    `--color-vt-border-2: #1e293b` (the design's `--border-2`, `voleytrack.css:14`; React's only
    `#1e293b` was `--color-vt-raised`, used as a surface, which would have been a semantic
    mismatch as a border) and `--color-vt-label: #e2e8f0`. The label token was flagged as a
    judgement call; it is justified, because that value appears in **5** design files
    (`voleytrack-jugadores.css`, `-partidos.css`, `-torneos.css`, `-equipos.css`,
    `voleytrack-login.html`), so it is a recurring label colour, not a one-off.
  - The accent hover was **not** converted mechanically. `PublicShell.tsx:84` had
    `hover:bg-[#ff9b59]`, a colour the design does not define; the element is a `.btn.accent`, and
    the design implements accent hover as `.btn.accent:hover{filter:brightness(1.06)}`, so it
    became `hover:brightness-[1.06]`. The auth buttons map to the design's `.btn-primary`
    (`brightness(1.05)`), so they use `hover:brightness-105`. No second accent hex was invented.
  - The green halo at `DashboardPage.tsx:39` was the retired `#4caf50` as
    `rgba(76,175,80,0.18)`, the indicator of the `EN VIVO` metric. The design has no green-halo
    dot; its soft-ring idiom is `color-mix`. It was converted to
    `shadow-[0_0_0_12px_color-mix(in_oklch,var(--color-vt-success)_18%,transparent)]`. Flagged as a
    judgement call: it is a synthesis of the design's idiom with the success token, not a design
    equivalent, and it was kept colour-only.
  - Test-first: a new guard in `tokens.test.ts` covers `features/auth/*.tsx`, `layouts/*.tsx` and
    `DashboardPage.tsx`, asserts it found files so it cannot pass vacuously, and fails on raw hex,
    `rgb(`/`rgba(`, `text/bg/border-white`, `bg-black` and `slate-`. Observed RED naming all 20
    offenders, then `12 passed`.
  - Evidence at the CSS level: the built stylesheet now contains **zero** `#4caf50`, **zero**
    `rgba(76,175,80` and **zero** `vt-canvas`, and every in-scope arbitrary-value class is gone.
    The retired green is eliminated.
  - Suite `49 files / 280 passed`, lint exit 0, build exit 0.
  - **Measured inventory of what remains**, which is larger than the seven spots originally known:
    raw hex across 9 values, 11 `rgba()` occurrences, **54 `text-white`**, 1 `bg-white`, 1
    `bg-black` and 8 `slate-` utilities. Most of it sits in files that T10 deletes
    (`pages/LoginPage.tsx` 13, `pages/PlanilleroPage.tsx` 8, `ShellTopbar.tsx` 4,
    `ShellFooter.tsx` 3, `NavItem.tsx` 2, `Surface.tsx`, `SectionShell.tsx`, `ShellUtilityBar.tsx`,
    `pages/AdminPage.tsx`, `pages/MatchesPage.tsx`). The rest is genuine screen work for slices 2
    to 4: `features/public/PlayerDetailPage.tsx` 8, `DashboardHero.tsx` 7, `LiveMatchPage.tsx` 3,
    `MatchesBrowser.tsx` 3, `DashboardRail.tsx` 3, `MatchSetupPage.tsx` 2, `DashboardLive.tsx` 2,
    and one each in `TeamStatsPage.tsx`, `TeamDetailPage.tsx`, `features/public/MatchesPage.tsx`,
    `Modal.tsx`.
- [x] **T05c — Stop Tailwind from scanning build output.** Done. A build-correctness defect, not
  cosmetics, and the build is now deterministic regardless of what is on disk.
  - Root cause pinned to a line: Vite runs `prepareOutDir` in the **`renderStart`** hook
    (`node_modules/vite/dist/node/chunks/node.js:33531`), which is *after* Tailwind's
    transform-time source scan. So a stale `dist/` is still on disk when Tailwind reads it, and any
    old bundle's class strings — including retired utilities — are regenerated into the new CSS.
  - The parent's prescribed probe was **unfaithful and the worker proved it**: a `.css` file
    containing `#4caf50` and `text-vt-canvas` yields 0, because `#4caf50` is not a utility and
    `text-vt-canvas` is undefined so emits no rule. The functioning probe is a `.js` file carrying
    `text-[#4caf50]`, which Tailwind *can* extract. With that probe and no cleaning, the count was
    **2**, emitting `.text-\[\#4caf50\]{color:#4caf50}` and changing the CSS hash.
    Important lesson: a non-reproduction is not evidence of absence when the probe cannot express
    the mechanism.
  - Fix: `dist/` added to `frontend/.gitignore` (matching that file's sparse style; the root
    `.gitignore` holds backend and Pi paths, not frontend build output), plus
    `@source not "../dist";` in `frontend/src/index.css`. The directive syntax was verified
    against the installed `tailwindcss@4.3.3` compiler source, not guessed: `@source` accepts a
    `not ` prefix with a quoted path, and the path resolves relative to the CSS file's directory,
    so `../dist` is `frontend/dist`. Isolated empirically — the directive alone dropped the count
    from 2 to 0 before the gitignore change was made.
  - Evidence with the probe still in place and no cleaning: `zz-probe-sentinel`, `#4caf50` and
    `vt-canvas` all **0**, while real utilities survived (`bg-vt-accent` 13, `text-vt-background` 3)
    and the stylesheet stayed at 87,004 B against an 87,024 B baseline. `git check-ignore -v
    frontend/dist/` now resolves to `frontend/.gitignore:3:dist/` and `dist/` no longer appears in
    `git status`.
  - Suite `49 files / 280 passed`, lint exit 0, build exit 0.
  - Residual uncertainty, reported rather than hidden: the 20-byte reduction against the pre-fix
    baseline was not byte-attributed to one specific removed rule, because the reproduction builds
    overwrote the stale bundle before it could be diffed. That is structurally safe, since the
    exclusion targets only `frontend/dist`, which contains no source of truth.
- [x] **T05b — Pin the layer mapping and make the non-design debt unable to grow.** Done.
  Reframed during planning, deliberately, from "migrate 106 consumers" to "fix the rule and
  ratchet the debt". The reasoning matters more than the outcome here.
  - The mismatch: the app has three tokens the design does not define. `--color-vt-panel`
    (`#0f1726`) sits *between* the design's `--bg` (`#0b1220`) and `--surface` (`#111a2b`) and is
    used in roughly 53 files. `--color-vt-raised` (`#1e293b`) is used as a **surface**, whereas the
    design uses that same value as `--border-2`, a **border**. `--color-vt-raised-border`
    (`#334155`) is used in about 10 places, including `primitives/Card.tsx` and `Modal.tsx`. The
    design's only border tones are `#243249` and `#1e293b`.
  - **Why the global migration was refused.** Moving 106 consumers from `#0f1726` to `surface-2`
    (`#162032`) would visibly LIGHTEN 53 files at once, and the design does not say which layer
    each individual surface is supposed to become. The orchestrator cannot inspect the captured
    PNGs (image reading is disabled), so there would be no way to judge the result. That is the
    same class of blind change this feature has been avoiding all along. Doing it would also not
    save anything: each consumer still has to be re-evaluated against the design when its screen
    is aligned, so a blind pass would be a guess now and a correction later.
  - **What lands instead.** The design-to-app mapping is written into `tokens.css` as an explicit
    rule, `panel` / `raised` / `raised-border` are marked as app-only layers with no design
    counterpart and barred from new code, and the counts are pinned by a **debt ratchet**: a guard
    asserting each count is less than or equal to its measured current value, so the debt can only
    shrink. The ratchet's asymmetry is the point — it tolerates a decrease from any screen
    migration and fails on an increase.
  - The per-screen migration is therefore not skipped; it moves into slices 2 to 4, where the
    design HTML states which layer each surface is and the harness can verify the computed result.
    This is also why T05b does not need to land *before* slice 2 as originally written: it is the
    **rule** that must exist first, not the migration.
  - **Measured counts**, which correct the estimates this document carried earlier. Occurrences,
    not lines, and deliberately excluding the guard and the token declaration, since those merely
    *name* the tokens and the comment block that documents the debt would otherwise look like new
    debt:

    | token | occurrences | files | ceiling |
    |---|---|---|---|
    | `vt-panel` | 97 | 51 | 97 |
    | `vt-raised` | 48 | 28 | 48 |
    | `vt-raised-border` | 9 | 7 | 9 |

    The patterns are `/vt-panel(?![-\w])/g`, `/vt-raised(?![-\w])/g` and `/vt-raised-border/g`.
    The negative lookahead is load-bearing: without it `vt-raised` also matches the prefix of
    `vt-raised-border` and double-counts. Raw counts including the guard and the declaration are
    107 in 53 files, 51 in 30, and 11 in 9. The earlier "106 in 53 files" in this document was the
    raw figure mislabelled as consumer usage.
  - The mapping rule and the semantic trap are now written into `tokens.css`: which design layer
    each app token corresponds to, that `panel` / `raised` / `raised-border` are app-only debt
    barred from new code, and an explicit warning that the design's `#1e293b` is the **border**
    tone `--border-2` while `--color-vt-raised` is a **surface** that merely shares the literal.
    That last one is the mistake most likely to be made by someone reading only the values.
  - The ratchet was proven to bite in both directions, not just claimed: introducing one
    `bg-vt-panel` usage failed with `expected 98 to be less than or equal to 97`, and with the
    scratch removed and the ceiling deliberately left at 98 the count fell to 97 and still passed.
    So it tolerates a decrease and rejects an increase. Scratch file deleted; `git status` for
    `frontend/src` shows only `tokens.css` and `tokens.test.ts` modified.
  - **Maintenance rule this creates.** The ceiling is pinned at the exact current count, so any new
    use fails immediately. It is equally important that the ceiling is LOWERED in the same commit
    as any migration, otherwise a decrease leaves the ratchet slack and the remaining debt can be
    re-spent. Every screen task in slices 2 to 4 that reduces one of these counts must also lower
    the corresponding ceiling.
  - Suite `49 files / 281 passed` (280 plus the new assertion), lint exit 0, build exit 0, and the
    built CSS still declares all three tokens (6, 4 and 2 occurrences).
- [x] **T06 — Add the primitives the design defines but the app lacks.** Done: nine new components
  (`Chip`, `StatePill`, `LivePill`, `FilterGroup`+`Filter`, `Toast`, `Kpi`+`KpiGrid`, `EmptyState`,
  `InfoRow`, `Avatar`) plus `ok`/`warn` on the existing `Badge` and a new `Field` inside
  `FormField.tsx`. All pure and props-driven — no internal state, deliberately, because the
  directory's tests render to static markup and could not exercise effects; the same trap that hid
  a real bug elsewhere in this repo.
  - Twelve tokens were added, each citing the design line it came from, because the design uses
    these values while keeping them outside its `:root`: the success-soft trio (`#0f2a1a`,
    `#86efac`, `#14532d`), the warn-soft trio (`#2a1e0a`, `#fde68a`, `#7c4d0a`), the avatar
    gradient stop `#ff6a3d`, `#ffffff` for ink on danger, the **third radius** 12px, the accent
    focus ring, the toast shadow, and two animations. Raw literals were refused, as the repo's
    tree-wide guards require.
  - Accessibility is implemented rather than claimed: a status pill always renders its status word
    with an `sr-only` prefix and is deliberately **not** a live region, since a listing renders many
    of them; `LivePill` is `role="status"` + `aria-live="polite"` with an `aria-hidden` dot and
    `motion-reduce:animate-none`; filters are real buttons with `aria-pressed` in a labelled group;
    `Field` wires `htmlFor`/`id`, `aria-describedby` (error then hint) and `aria-invalid`; the toast
    unmounts when closed so hidden text is never announced.
  - Tests: suite `49 files / 292 passed` (10 existing plus 11 new in `core.test.tsx`). Verified that
    the new tests are genuine rather than string matching: 27 `renderToStaticMarkup` calls against
    only 5 source-file reads. RED was observed for `Field`, `StatePill` and `Filter`; the worker
    stated plainly that the other eight tests were written after implementation and claimed no RED
    for them.
  - Additive discipline held: `git status` shows only `Badge.tsx`, `FormField.tsx`,
    `core.test.tsx` and `tokens.css` modified, with no screen, layout, feature, fixture or router
    touched. The debt ratchet stayed green and unchanged at 97 / 48 / 9, so no new debt was added.
  - **Three corrections the worker made to this document's spec**, which is exactly why the prompt
    told the design CSS to win:
    1. The design's `.badge` **base** is mono 10px/800 with tracking `.06em` and padding `5px 8px`,
       while the app's `Badge` uses `px-3 py-1 tracking-[0.2em]`, pinned by an existing test and
       consumed by screens. Only the `ok`/`warn` colours were added, so this remains a real parity
       gap and moves into T07.
    2. The design's `.s-envivo` has **no border** while programado and finalizado do. The component
       uses `border-transparent` so the pills size equally. A deliberate deviation from the CSS,
       flagged as a risk rather than hidden.
    3. The design's `select` chevron hardcodes `#64748b` **inside a data-URI**, which cannot be
       tokenised, so selects keep the native indicator.
  - Other judgement calls, reported: the toast uses a mount animation instead of the design's
    transition (a transition needs a mount tick, and this directory is SSR-tested); the toast close
    control is minimally styled because the design has no dismiss affordance; `--shadow-vt-toast`
    was added rather than reusing `--shadow-vt` since the values differ.
  - Verified independently by the parent: the new tests render markup rather than grepping source,
    and the accessibility attributes are present in the components, not merely claimed.
- [x] **T06b — Retire `FormField` in favour of `Field`.** Done. All 19 call sites migrated across the
  five admin files (`CreateTournamentPage` 3, `CreateMatchPage` 2, `StaffRegisterPage` 5,
  `CreateTeamPage` 5, `CreatePlayerPage` 4), and `FormField` is gone as a concept. `Field` was
  missing nothing, so no capability had to be added. Deleting the duplication outright is stronger
  than ratcheting it, which is why it was pulled forward once the measurement showed only five
  files. Admin tests stayed green: `49 files / 292 passed` before, `294 passed` after.
  - One limitation: the module keeps the filename `FormField.tsx` because deleting files was not
    permitted by the worker's tool safety. It now exports only `Field` and the control class
    constants. The filename is therefore misleading and is worth renaming in a later pass.
  - Incidental parity fixes that came with the migration, reported rather than smuggled:
    `CreateTeamPage` inputs move from the legacy `h-12` (48px) to the design's 46px, and error text
    in `CreatePlayer`/`StaffRegister` now renders in `text-vt-danger`. `aria-invalid="false"` is no
    longer emitted when the field is valid, per `Field`'s pinned contract.
- [x] **T07 — Align `Button`, the `Badge` base and `Card` with the design spec.** Done, and it
  surfaced the most consequential defect found so far (see T07b).
  - `Button` is now the design's pill: `rounded-full`, 40px tall, `px-4`, `gap-2`,
    `whitespace-nowrap`, 13px bold, 16px icons. Variants were **mapped** rather than renamed, so no
    call site broke: `primary` becomes `.btn.accent` with the dark ink and
    `hover:brightness-[1.06]`, the new `surface` becomes `.btn`, `ghost` becomes `.btn.ghost`, and
    `icon` survives as a legacy alias. The prop default is unchanged.
  - `Badge`'s **base** was the parity gap T06 flagged and is now the design's: mono, 10px,
    extrabold, tracking `.06em`, `px-2 py-[5px]`, with the default fill moved off `vt-panel` onto
    `vt-background`. This changes **40 call sites across 26 files**, which is intended, and it also
    lowered the `vt-panel` debt (see the ratchet below).
  - `Card` gained `CardHeader` (`.card-h`) and `CardBody` (`.card-b`) plus a `padded?: boolean`
    prop. The mechanism that resolves the problem described in this document's plan: `padded`
    defaults to `true` and renders exactly today's `p-6` with no clipping, while `padded={false}`
    renders the design's structural form with no padding and `overflow:hidden`. One padding value is
    chosen per card, so the structural spacer can never double up with `card-h`/`card-b`. All 66
    production `<Card>` tags are untouched.
  - **A reliable ratchet for the legacy card form was possible**, contrary to the concern raised
    when planning. The worker built a brace-aware tag scanner after establishing that a naive
    `<Card[^>]*>` regex silently truncates at the `>` inside an `onClick={() => …}` and would stop
    seeing `padded` — a trap that would have produced a guard that passes while measuring nothing.
    It also strips comments, and asserts no spread and no aliased import, with a floor of 66 tags in
    21 files and a ceiling of 66 legacy usages. Liveness was proven: adding a 67th card failed with
    `expected 67 to be less than or equal to 66`.
  - **Verified at the rendered level**, which is the point of T10b: the primitive `Button` on
    `/admin/tournaments/create` computes `border-radius: 3.35544e+07px`, i.e. Chromium's clamped
    999px on a 40px box, at `height: 40px`. So the pill radius genuinely reached the browser.
    Worth knowing for later tasks: the accent element on `/login` and on `/` is **not** the `Button`
    primitive at all (it measures 8px and 10px radius, 48px and 44px tall), so the harness's
    existing accent probe cannot see this component. The worker therefore added an additive
    `probes.accentControls` field rather than changing the existing probe's behaviour. Design
    disagreements it reported: `.card-h`/`.card-b` padding differs between `voleytrack.css:76,78`
    (`18px 20px 0` / `18px 20px`) and `voleytrack-admin.css:96-98` (`16px 18px` with a bottom border,
    and `18px`), so the shared-file values were implemented; `.btn` also carries `transition:.15s`
    (`voleytrack-admin.css:72`) which the prompt omitted.
  - Its correction to this document's call-site arithmetic: `Button` is **27 tags across 10 files**
    (22 of them `ghost`), not the 31 across 13 written earlier. `Card` (66/21) and `FormField` (19)
    were correct.
  - The ratchet was **lowered** as required: `vt-panel` went from 97 occurrences in 51 files to
    **94 in 48**, with the ceiling reduced to match, so the freed budget cannot be re-spent.
    `vt-raised` (48/28) and `vt-raised-border` (9/7) are unchanged and still at their ceilings.
  - Suite `49 files / 294 passed`, lint exit 0, build exit 0.
- [x] **T07b — Fix the unlayered base rules that silently defeated utilities on buttons and
  links.** Done, and the defect was **six** rules rather than the one originally spotted. Found by
  T07, outside that task's surfaces, and it is the most consequential defect discovered in this
  feature so far.
  `frontend/src/index.css:58-60` contains, at top level and **outside any `@layer`**:

  ```css
  a,
  button {
    font: inherit;
  }
  ```

  In CSS, unlayered declarations always beat layered ones regardless of source order. Every Tailwind
  utility lives in a layer, so this rule defeats **all** of them for `font-size`, `font-weight`,
  `font-family`, `letter-spacing` and `line-height` on every `<button>` and every `<a>` in the app.
  Confirmed two ways: the rule sits at column 0 outside any layer in the source, and in the built
  stylesheet the `@layer` blocks occupy the low byte offsets while `font:inherit` appears at 8523,
  8707 and 87505 — after them. Measured consequence: the primitive `Button` computes **16px/400**
  while its own classes say `text-[13px] font-bold`, whereas `height` and the pill radius do apply,
  because `font: inherit` does not touch them.
  This is why the design's typography could never take effect: `.btn` is 13px/700 and the public
  sidebar's `.nav-item` is 13px/600, and nav items are `<a>` elements. It compounds with the
  separate discovery that Inter was never loaded, so two independent silent failures were flattening
  typography at once.
  Deliverable: bring the rule into the correct cascade position so utilities win again — wrapping it
  in `@layer base` is the conservative fix, and removing it is defensible since Tailwind's preflight
  already sets font inheritance for form controls inside `@layer base`, but whichever is chosen must
  be justified. Note that `a { font: inherit }` is effectively a no-op in CSS, since anchors carry no
  user-agent font style.
  Consequence to expect and verify: this is an **app-wide visible change** to every button and link.
  Evidence: after the fix, the primitive `Button` must compute 13px/700 (not 16px/400) and a sidebar
  nav link must compute 13px/600, measured through the harness. This must land before slice 2, since
  every screen's typography depends on it.
  - **Full inventory of the unlayered rules, and what each was defeating.** The suspicion that
    `font: inherit` was not alone was correct:

    | unlayered rule | utilities it defeated |
    |---|---|
    | `a, button { font: inherit }` | `font-size`, `font-weight`, `font-family` (`font-sans`/`font-mono`), `font-style`, `line-height`, `tracking-*`, `font-variant` |
    | `button { cursor: pointer }` | `cursor-*`, i.e. **every `disabled:cursor-not-allowed`**, present on `Button`, `IconButton`, `MatchSetupPage`, `ScoringConsolePage` |
    | `button:focus-visible, a:focus-visible { outline }` | `outline-*`, including the 8 `focus-visible:outline-none` sites |
    | `* { box-sizing: border-box }` | `box-border` / `box-content` (no current usage, latent) |
    | `:root`, `html`, `html, body, #root`, `#root`, `body` | utilities on those elements (latent) |
    | `::selection` (twice) | `selection:*` (no current usage, latent) |

    Two of those were causing real visible defects, not just latent ones: disabled buttons showed a
    **pointer cursor**, and the `DashboardPage` link cards drew the base focus outline **in addition
    to** their own ring.
  - **Fix:** every application base rule is now inside `@layer base`, the same layer as Tailwind's
    preflight, so `@layer utilities` wins by design given the declared order
    (`theme, base, components, utilities`). The worker argued explicitly for layering over deleting
    the offending rule: deleting would fix one of six, leave the intent implicit, and make behaviour
    depend on preflight internals. Verified structurally by the parent: the only top-level lines in
    `index.css` are the ten `@import`s, the `@source` directive, and the `@layer base {` block with
    its closing brace, so no `a` or `button` selector sits outside a layer any more.
  - **Measured before and after**, which is the first time this feature has quantified a visible
    change. On `/admin/tournaments/create` the accent control (`probes.accentControls[0]`, the
    "Crear Torneo" button) went from **16px/400 to 13px/700** — exactly the design's `.btn`. The
    active nav link went from **16px to 14px** on both routes. The captured PNG checksums changed,
    confirming a real visual delta rather than a theoretical one.
  - **No regressions:** height stayed 40px with the pill radius, the nav link stayed 10px radius and
    44px tall, and the body font stayed Inter with the font set loaded. Built CSS confirms the
    cascade: `a,button{font:inherit}` and `button{cursor:pointer}` now sit inside `@layer base`,
    while `cursor-not-allowed` and `.focus-visible\:outline-none` sit later in `@layer utilities`,
    with the base focus outline still present for elements that declare none.
  - **Guard:** a brace-aware walker in `tokens.test.ts` records every style rule and whether an
    enclosing block is `@layer` — deliberately not counting `@media` — and fails listing any
    unlayered `a`/`button` type selector. RED proven by appending an unlayered
    `button { cursor: pointer }`, which failed with `expected [ 'button' ] to deeply equal []`, then
    GREEN after removal with no scratch file left behind.
  - Suite `49 files / 295 passed` (294 plus the new guard) with **no existing test expectation
    shifting**; lint exit 0; build exit 0. Ratchet unchanged at 94 / 48 / 9 and no token touched.
  - **Honest gap in the verification:** cursor and focus-visible were established from cascade
    position and the built stylesheet, not from a rendered probe, because the harness has no cursor
    or focus step and `frontend/tools/` was outside the task's surfaces. The cascade fact is
    deterministic, so the conclusion holds, but it is one step short of the rendered evidence used
    for font-size.
  - **New parity finding for T09:** both routes' nav renders `text-sm font-semibold`, i.e. 14px/600,
    whereas the design's `.nav-item` is **13px/600**. That is a markup-to-design divergence, not a
    cascade problem, and it is now visible precisely because this fix let the utilities take effect.
- [x] **T08 — Add the mono tabular numeric treatment.** Done. `frontend/src/components/primitives/Num.tsx`
  exports one constant, `numClasses = "font-mono tabular-nums text-right"` — the design's `.num`
  (`voleytrack.css:100`) as a single triplet over tokens — plus a small `Num` component.
  - **Both a constant and a component, on purpose.** The constant is what a table *cell* needs,
    because a wrapper `<span>` would make `text-align` inert; the component is the inline path for
    the per-screen usages later slices own. This follows the repo's existing precedent
    (`fieldControlClasses` / `fieldTextareaClasses`). Keeping it to one constant means
    `tabular-nums` cannot be forgotten, and a tree-wide guard fails if any production class string
    outside `Num.tsx` re-spells all three utilities.
  - **Applied** to `DataTableColumn` via a new `numeric?: boolean` prop that overrides in both
    directions. When omitted, the primitive decides: a column after the row's identity column whose
    values are all numbers and which has no `render`. Applied to both `<th>` and `<td>`, matching the
    design's `td.num` / `th.num`, and the identity column stays left-aligned because the design never
    marks a table's first column (`voleytrack-torneos.html`). Not applied to the other design usages;
    per-screen application belongs to the later slices.
  - **The font load is proven, and the proof required distinguishing two signals.** On
    `/tournaments/liga-a1-2026/standings`, `JetBrains Mono` went from `cssCheck: false` to
    **`cssCheck: true`**, with a header `th "PJ"` and a body `td "6"` both computing
    `font-family: "JetBrains Mono", ui-monospace, monospace`, `font-variant-numeric: tabular-nums`
    and `text-align: right`. The important nuance the worker caught: `loadedInFontFaceSet` was
    **already** true before the change, because `TournamentStandingsPage` renders a mono `Badge`;
    the meaningful flip is `cssCheck`, a weight-400 query that only resolves once normal-weight mono
    cells exist. Without that distinction the change would have looked proven when it was not.
  - Test-first with genuine RED: `expected '<th class="px-4 py-3 font-semibold" scope="col">Pts' to
    contain 'font-mono'`, then `expected '<td class="px-4 py-3">14<' to contain 'tabular-nums'`. The
    guard's REDs were also produced with temporary offending code and then removed. Stated honestly:
    the `Num` / `numClasses` guard test postdates the constant, so no RED is claimed for it.
  - Suite `49 files / 299 passed`, lint exit 0, build exit 0, ratchet unchanged at 94 / 48 / 9.
  - **A blind spot this exposed in the parent's own verification habit.** The built stylesheet is
    **byte-identical** before and after (`index-BEm63GH1.css`, 92,869 bytes) because those utilities
    were already emitted for other primitives. So "grep the built CSS" cannot distinguish *the class
    exists in the sheet* from *the class is applied to the markup*. Only computed styles prove the
    latter. The harness probe was extended additively (`probes.numericTreatment`).
  - Server hygiene: two Vite servers were already running before the worker started (5173 pid 215105,
    5174 pid 217688). It started and stopped nothing, used 5173, and confirmed both ports still
    listen under the same pids.
- [x] **T09 — Align the shell and navigation with the design.** Done, and every target was measured
  against the design at the rendered level rather than inferred.
  - Nav links: **14px/600 → 13px/600**, and padding, gap, radius and border aligned to the design's
    `.nav-item` (10px / 10px / 10px / 1px). Admin active state: was `rgb(248,250,252)` on
    `rgb(30,41,59)`; now `rgb(11,18,32)` ink on `rgb(255,140,66)` accent, **identical to the public
    shell**, with one active rule shared by both instead of an admin-only raised background.
  - `PageHeader`: 26px/700 → **28px/900** with `-0.02em` tracking, `line-height: 1` and the
    description at 13px, `margin-top: 6px`, `max-width: 60ch`. The smaller `compact` variant was
    collapsed into the single design `.page-head` and its `variant` prop is deprecated and no longer
    forwarded to the DOM.
  - Sidebar container padding closed to the design's `20px 14px`; topbar still **72px** and sidebar
    still **248px** on all three captured routes.
  - **Kept as a deliberate improvement over the design, and documented in code:** the nav's
    `min-h-11` 44px target. The design's nav item is roughly 36-40px, and 44px is the minimum
    accessible touch target, so this is a justified deviation rather than a missed value. The comment
    exists so a future reader does not "fix" it back to the design.
  - **The Estadísticas decision was resolved with evidence and went a step past the link.** `/stats`
    was a `placeholderRoute` whose rendered copy said the screen was not implemented, while the real
    statistics screens live at `/tournaments/$id/stats` and `/teams/$id/stats` and remain reachable
    from their own pages — so removing the dead global entry removed no working path. The nav item,
    the route itself, the `PublicShell` page-meta branch and the associated test rows were all
    removed, and a capture of `/stats` now returns TanStack's default not-found with no shell, so the
    route is genuinely gone rather than merely unlinked. `/teams` and `/players` are also placeholders
    and were **deliberately retained**, annotated in `router.tsx` as such, because they are real
    design destinations that T14 and T15 will build; `router.test.tsx` now asserts both survive and
    that `stats` no longer appears anywhere in the public subtree.
  - The missing destinations (Equipos, Jugadores, En vivo) were **not** added, as instructed: they
    would have linked to placeholders. `router.tsx` carries a comment naming the design's six public
    destinations and which task adds each one, so the gap cannot be silently dropped. T14, T15 and
    T16 must each add their destination when their real screen lands.
  - The ratchet was tightened to the measured counts: `vt-panel` 94 → **93** in 48 files, `vt-raised`
    48 → **46** in 26 files, `vt-raised-border` unchanged at 9. Ceilings now equal the real numbers,
    so there is no slack to re-spend.
  - Suite `49 files / 299 passed`, exit 0 (299 rather than 300 because the removed `/stats` row was a
    `test.each` case), lint exit 0, build exit 0.
  - **Transient red the user was told about, and its resolution:** an assertion in
    `DashboardPage.test.tsx` pinned `text-[26px] font-bold`, i.e. the **pre-design** value, so it
    contradicted the design rather than the component. The worker stopped and asked instead of
    weakening the component to satisfy it. The assertion was corrected to the design's values. Worth
    noting as a pattern: this is a case where the test encoded the old world and the component was
    right.
  - **Incident, self-reported and self-attributed:** its server cleanup used a broad
    `pkill -f` pattern that matched two other Vite servers in addition to its own, and its own shell
    was signalled too. It disclosed the exact command, did not restart third-party processes without
    authorization, and asked. The parent left them down deliberately — no other Pi session is active
    in this directory, so those servers were most likely orphaned leftovers from earlier worker
    rounds in this same feature rather than anyone's live work. Environment verified clean: no `vite`
    process remains and nothing listens on any 51xx port. The correct pattern for future cleanups is
    a single-pid kill, never a broad `-f` match.
- [x] **T09b — Align the sidebar's surface and border, and delete the orphaned models.** Done.
  - **Root cause:** both the background and the border were applied in the shared
    `components/navigation/Sidebar.tsx` aside, including a
    `variant === "admin" ? "bg-vt-background" : "bg-vt-surface"` branch. The design declares a
    single identical `.sidebar` rule (`voleytrack.css:50` and `voleytrack-admin.css:55`), so the
    admin variant was a divergence with no design basis. It is now one
    `border-r border-vt-border-2 bg-vt-surface` treatment, and the branch and its `variant` prop are
    gone. That API reduction was accepted as part of the fix rather than deferred: a variant whose
    only effect was to deviate from the design has no reason to exist.
  - **Measured before and after**, both shells: `/` keeps `rgb(17,26,43)` for the background and
    moves its border from `rgb(36,50,73)` to **`rgb(30,41,59)`**; `/admin/tournaments` moves its
    background from `rgb(11,18,32)` to **`rgb(17,26,43)`** and the same border change. Both shells
    are now identical. Geometry untouched: width 248, padding 20px/14px, nav links 13px/600 with
    10px padding, gap and radius.
  - Guards added: a source pin for the sidebar treatment citing both design lines, a whole-file ban
    on the old background utility and on the `variant === "admin"` branch in `Sidebar.tsx`, and a
    test asserting `expect(adminSidebar).toBe(publicSidebar)` as an explicit anti-divergence pin.
    Test-first with genuine RED: four focused assertions failed before the change.
    A fifth failure was the guard itself catching a hex literal **inside the new test's own
    comment** — the raw-colour guard working on its own author.
  - **Two orphaned modules deleted:** `features/dashboard/dashboard.models.ts` (121 lines) and
    `features/matches/matches.models.ts` (143 lines), 264 lines total. Re-verified before deleting:
    zero references to either path or specifier anywhere, and all twelve exported symbols appear
    only in their own defining file. Suite unchanged at `44 files / 287 passed`.
  - Suite `44 files / 287 passed`, lint exit 0, build exit 0. Ratchet re-measured and **unchanged**
    at 73/39, 46/26, 9/7, so no ceiling was lowered, correctly — nothing decreased.
  - **A delegation error the parent made, and the worker handled correctly:** the task instructed
    it to extend the screenshot probe additively but did not grant `frontend/tools/**` in the
    allowed surfaces. It made the instructed change anyway (23 added lines, no existing key,
    strategy order, output shape or exit code altered) and disclosed the discrepancy instead of
    hiding it. That is the second time in this feature that the parent's instruction and the
    parent's surface list disagreed; the lesson is that a task which says "extend the tool" must
    grant the tool.
- [~] **T10 — Remove the legacy duplicate component system.** **Partial, and correctly reported as
  such rather than forced to completion.** The removable half is gone; the half with live consumers
  needs per-screen work and is tracked as T10b and T10c below.
  - The map was built before anything was deleted, as required. Numbers: `ui/Badge` had 10 importers
    (6 live), `ui/SectionShell` 10 (9 live), `ui/Surface` 7 (2 live at the time), `ui/NavItem` 0 live,
    the three `Shell*` components and `layouts/AppShell` only each other, and
    `shared/app-shell.content.ts` plus `shared/navigation.models.ts` only the dead shell.
  - **Deleted:** 11 files — `ShellTopbar`, `ShellUtilityBar`, `ShellFooter`, `ui/Badge`,
    `ui/NavItem`, `layouts/AppShell`, `shared/app-shell.content.ts`, `shared/navigation.models.ts`,
    `pages/LoginPage.tsx`, `pages/MatchesPage.tsx` and the latter's test. Also 4 dead routes: the
    pathless `/shell` layout, `/results`, `/gallery` and `/fantasy`. 12 importers re-pointed and 4
    test references retired. Net diff **+231 / −713** across 33 paths.
  - **Live consumers migrated behaviour-preservingly:** `pages/PlanilleroPage.tsx`
    (`SectionShell`→`PageHeader`, `Surface`→`Card padded={false}`, `ui/Badge`→`primitives/Badge`)
    and `pages/AdminPage.tsx`. Plus 8 feature files with one-line import swaps whose output is
    byte-identical, because `primitives/Badge` already accepts the legacy `tone` prop. Incidental
    geometry changes on `/planillero` and `/admin`, disclosed rather than hidden: h2→h1, radius
    20px→16px, and `Surface`'s shadow dropped.
  - **All four carried-over items done.** `primitives/FormField.tsx` renamed to `Field.tsx` with its
    6 importers, and the single-field guard no longer strips import specifiers, so a stale
    `from "./FormField"` now fails too. `router.test.tsx` gained
    `afterEach(() => router.history.destroy())` using the public `@tanstack/history` API that an
    earlier worker had believed did not exist. The non-discriminating hook test was **relabelled**
    rather than padded: it is now "seeds the selected filter … on the first render", and the worker
    proved the weaker guarantee by disabling the sync and observing that it still passed while the
    other two tests failed (`2 failed | 1 passed`), then restored the hook byte-identically. The
    `vt-canvas` guard now uses `/[A-Za-z][\w-]*-vt-canvas\b/` across the whole tree with **no
    self-exclusion**, with liveness proven by injecting a class and seeing it named
    `PlanilleroPage.tsx:36`.
  - **Ratchet tightened:** `vt-panel` 93 → **85** in 43 files, ceiling lowered to match.
    `vt-raised` 46/26 and `vt-raised-border` 9/7 unchanged.
  - Suite `48 files / 297 passed`, exit 0 — one file fewer and one test fewer than the previous
    299, because `pages/MatchesPage.test.tsx` and a retired guard test are gone. Lint exit 0, build
    exit 0. Four harness captures on a self-started port: `/`, `/login`, `/admin/tournaments` and
    `/planillero` all exit 0 with `problems: []`, no Vite overlay and expected content present.
  - Server hygiene done right this time: one PID started, killed by that same PID, port released,
    other sessions' processes untouched.
- [x] **T10b — Delete the dead component cluster and the last dead legacy module.** Confirmed by the
  parent after T10 reported the cluster: `DashboardHero`, `DashboardLive`, `DashboardRail` (all in
  `features/dashboard/`) and `MatchesBrowser` (`features/matches/components/`) are imported **only**
  by each other and by the barrels `features/dashboard/index.ts` and `features/matches/index.ts`, and
  **nothing imports those barrels**. The live `/` route is `features/public/DashboardPage`, which
  imports only `Link`, the new primitives, `StateBoundary` and fixtures — it does not use any of
  them. `components/ui/Surface.tsx` is therefore dead too, since its only remaining importers are
  those four dead components.
  This corrects an earlier note in this document: the raw-colour debt counted in `DashboardHero` (7
  occurrences) and `DashboardRail` (3) was recorded as "genuine screen work for slices 2 to 4", but
  that was wrong — it is debt inside dead code, and it disappears with the deletion rather than
  needing migration.
  Deliverable: delete the four components, their tests, the two barrels if genuinely unused, and
  `ui/Surface.tsx`; update `styles/tokens.test.ts`, which references `DashboardHero` by path; and
  **determine whether `useMatchCenterFilter` itself is live**. If a live screen uses it, move that
  hook's test harness off the dead `MatchesBrowser`. If only dead code used it, then the hook and
  its test are dead too and should go with the cluster — a test for dead code is not a safety net,
  and the honest move is to say so rather than rewire a harness to keep it alive. Lower the ratchet
  ceilings for the debt this removes.
- [ ] **T10c — Retire `ui/SectionShell`.** The one legacy module still carrying live consumers: **9
  live screens** — the four scoring screens (`MatchSetupPage`, `PointEntryPage`, `ScoringConsolePage`,
  `PostMatchSummaryPage`), four admin create/staff screens (`CreateMatch`, `CreatePlayer`,
  `CreateTournament`, `StaffRegister`) and `pages/PlaceholderPage`.
  It was correctly **not** migrated in T10, because swapping it is not behaviour-preserving: its
  `eyebrow` slot has no counterpart in the design's `PageHeader`, and `DashboardLive.test.tsx` pinned
  that text. Restructuring nine screens' headers is per-screen design work, so it belongs with the
  tasks that already redesign those screens — the scoring screens in slice 4 (T25) and the admin
  forms in slice 3 (T17 to T24). Until then the module stays as explicitly tracked debt.
  Deliverable: migrate each screen as its own task touches it, and delete `ui/SectionShell` once the
  last importer is gone. The 85/9 counts in the ratchet do not cover it, so consider whether its
  importer count needs pinning in the same style as the other two ratchets.

### Superseded plan text for T10 (kept for traceability)

The line below was the original T10 plan. It is retained only so the numbering and the intent remain
readable against the completed record above; the carried-over items it lists were all done.

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
    the render-phase sync, or relabel it so its weaker guarantee is not mistaken for a pin;
  - make the `vt-canvas` guard cover the whole tree, including the guard file itself, by matching
    a class-like occurrence instead of the bare substring that its own literal contains.
  Note: `src/styles/tokens.test.ts` also references the legacy modules (`shellUtilityBarPath`,
  `navItemPath`, `shellTopbarPath`, `loginPagePath`), so it must be updated in the same commit.
- [x] **T10b — Establish a reproducible visual verification path.** Done, and it immediately paid
  for itself; it does not need a Firefox or Playwright dependency.
  - Tool: `frontend/tools/screenshot.mjs`, exposed as `pnpm screenshot`, documented in
    `frontend/tools/README.md`. Drives a hidden Electron `BrowserWindow` and captures through
    `webContents.capturePage()` at a 1440x900 viewport. Electron is reused from the sibling
    open-design checkout (`ELECTRON_BIN` overrides the path), so this repo gains no dependency.
  - The command, as actually used: `pnpm screenshot --route / --out <path>` against
    `pnpm run dev`. It waits for the app to mount, waits for fonts, settles, and freezes
    animations, transitions and the caret before capturing, so runs are comparable.
  - **Determinism proven, which is the whole point**: `/login` captured four times gave identical
    bytes (40,097) and an identical `sha256`, `cmp` byte-identical; `/` captured twice likewise
    (103,003). Independently re-run by the parent with the same byte count and dominant colour.
  - It emits a machine-readable `<png>.json` next to the image. That matters because **image
    reading is disabled in this harness**, so the parent cannot inspect a PNG; the JSON is the
    evidence the orchestrator can actually check, and the PNG is what the human reviewer judges.
    Division of labour, deliberate: the orchestrator asserts computed values, the human judges the
    visual result.
  - Probes are checked against a `designReference` block baked into the tool (canvas 1440, topbar
    72, sidebar 248, accent `#ff8c42`, body font Inter). Measured on `/`: topbar height **72** and
    sidebar width **248**, both flagged `matchesDesign: true`; body font **Inter** with
    `fontFaceSetSize: 8` and Inter `cssCheck: true`.
  - **This independently confirms T04 and T03b at the rendered level.** The accent probe on
    `aside [aria-current]` resolves `color: rgb(11, 18, 32)` over `background-color:
    rgb(255, 140, 66)`. T04's fix was reasoned from the design's `.nav-item.active{color:#0b1220}`
    and is now measured on a rendered page, not inferred from CSS text. And Inter, which the app
    had never actually loaded, is genuinely applied.
  - Its own failure paths were tested rather than assumed: a single-colour page exits 1 with
    `captured image is one flat colour`, a Vite error overlay exits 1 while quoting the overlay
    text, and an unreachable URL exits 68 without writing a PNG. A blank canvas or an error
    overlay cannot pass as a screenshot.
  - The parent independently re-ran it: same 103,003 bytes, same dominant colour, `problems: []`,
    and the dev server was cleaned up (port closed, no stray processes). Fourteen orphaned
    `/tmp/voleytrack-screenshot-*` profiles left by the worker's debugging were cleaned up too.
  - Findings this surfaced immediately, to be handled in T09 and T11: the public nav renders
    `01 Dashboard / 02 Partidos / 03 Torneos / 04 Estadísticas`, whereas the design's public
    sidebar is Dashboard / Partidos / Torneos / **Equipos / Jugadores / En vivo**. The app is
    missing three design nav destinations and has one the design lacks. The dashboard body copy
    (`COBERTURA`, `3 partidos en vivo`, `Datos actualizados ahora`) also has no counterpart in the
    design page. Both are real parity gaps, not capture artefacts.
  - JetBrains Mono reports `cssCheck: false` and `loadedInFontFaceSet: false`. This is expected and
    benign rather than a regression: browsers load a font lazily, only once something uses it, and
    nothing on these routes applies `font-mono` yet. T08 is the task that will exercise it, and
    this probe becomes the check that the mono face actually loads then.
  - Known fragility, reported by the worker instead of hidden: the harness depends on the sibling
    Electron binary at `/home/agustin/Dev/open-design/...` unless `ELECTRON_BIN` is set; a
    top-level `await app.whenReady()` deadlocks in an Electron ESM entry; hardware acceleration
    cannot be disabled without a capture hang, so GPU stays on; sharing Electron's default profile
    with the sibling app crashes the GPU process, so a dedicated `$TMPDIR` profile is used; and a
    hidden window never emits `requestAnimationFrame`, hence the timer race in the settle step.
  - Captures land in `frontend/screenshots/`, which is gitignored.

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
- **Package manager: pnpm**, decided by the product owner and pinned in `frontend/package.json` as
  `packageManager: pnpm@<local version>` (the local toolchain is 12.6.0). The stale tracked
  `frontend/bun.lock` was deleted and the previously untracked `frontend/pnpm-lock.yaml` becomes
  the tracked lockfile.
- `frontend/dist/`, `node_modules/` and `frontend/pnpm-lock.yaml` were **not** covered by
  `.gitignore`, so commits must stage explicit paths and must never use `git add -A`.
- Commands recorded earlier in this document were genuinely run with `bun`/`bunx` at the time.
  They are kept verbatim as history rather than rewritten; from T03b onward pnpm is canonical.
  Historical artifacts elsewhere (`openspec/**`, `frontend/design/voleytrack-webapp-uiux-audit.md`)
  still say `bun run`/`bunx` and are deliberately left as records of their own period.

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
