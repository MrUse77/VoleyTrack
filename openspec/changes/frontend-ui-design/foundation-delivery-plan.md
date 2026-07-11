# Foundation Delivery Plan: Frontend UI Design

## Decision

The uncommitted Slice 1 foundation/access implementation is too large to land as one review unit. Replan it as **eight stacked foundation units, F-1 through F-8**, each with a target of **no more than 400 estimated changed lines** (additions plus deletions). Each unit must compile, have its focused verification, and be independently rollbackable before the next unit is started.

The public-discovery units remain **PD-1 Dashboard → PD-2 Matches → PD-3 Tournaments → PD-4 Integration and acceptance audit**. PD-1 must start only from the accepted, committed F-8 foundation; it must not be committed on top of the current 1,100+ LOC mixed worktree.

**Issue #5 remains the public-discovery parent tracker. No public-discovery PR may close #5 until every F unit and PD-1 through PD-4 have been accepted.** Foundation work requires a separate foundation tracker and one distinct child issue per F unit. No issue, branch, commit, PR, staging, or GitHub operation is performed by this planning change.

## Quick path

1. Create or identify a foundation tracker separate from #5 and create one child issue for each F unit.
2. Reconcile the current worktree into the F-1 through F-8 path allowlists below; do not carry public-discovery implementation into a foundation unit.
3. Land F-1 through F-8 in order. After each unit, verify the focused behavior, lint, TypeScript, and a temporary-output build.
4. At the F-8 gate, verify the full foundation with placeholder public routes, then commit the compilable foundation.
5. Start PD-1 from that committed foundation, followed by PD-2, PD-3, and PD-4 using the existing `delivery-plan.md` boundaries.

## Non-negotiable boundaries

- The canonical `.op` document remains read-only. Backend files remain untouched.
- F units establish reusable infrastructure and access artboards only. They do not implement dashboard, matches, or tournaments bodies.
- Public routes in the foundation route tree may exist as explicit placeholders so the 45-artboard map compiles; placeholder reachability is not public-discovery acceptance.
- Every unit is capped at 400 estimated changed lines. If an estimate approaches the cap, split at the next listed path or route boundary; do not use a size exception.
- Tests stay with the behavior they protect. A mixed test file is split by test block, not by moving unrelated tests into a separate generic test commit.
- Future commits must use an explicit path/hunk allowlist. Do not use `git add .` or include generated output.

## Safe stacked order

```text
F-1 visual baseline/config
  ↓
F-2 primitive set A
  ↓
F-3 primitive set B
  ↓
F-4 public/admin shells and navigation
  ↓
F-5 typed public fixture contract and records
  ↓
F-6 scoring/admin fixture records
  ↓
F-7 placeholder route tree and 45-artboard manifest
  ↓
F-8 boundary enforcement and access screens
  ↓
committed, compilable foundation/access baseline
  ↓
PD-1 → PD-2 → PD-3 → PD-4
```

Every F unit must leave the application compilable. F-7 intentionally binds public and admin feature destinations to placeholders; F-8 replaces only the auth placeholders with the access screens. PD units later replace only their own public placeholder bindings.

## Foundation work units

### F-1 — Canonical visual baseline and compile configuration

| Field | Boundary |
|---|---|
| Estimated changed lines | **170 maximum target** |
| Dependency | Current repository baseline; no application feature dependency |
| Exact paths | `frontend/index.html`; `frontend/src/index.css`; `frontend/src/styles/tokens.css`; `frontend/src/styles/tokens.test.ts`; `frontend/tsconfig.app.json`; the baseline route-shape assertions in `frontend/src/router.test.tsx` |
| Artboard scope | Shared canvas/token policy for artboards 1–45. This unit does not claim any artboard implementation or visual sign-off. |
| Work | Remove the stale stylesheet entry only if required by the foundation baseline; establish canonical semantic tokens, Inter/system typography fallback, 1440px desktop minimum canvas, overflow policy, reset, and the minimal TypeScript include/compiler settings needed to compile `src/`. Align the existing baseline router test with TanStack's normalized route IDs and child paths so the untouched repository baseline is green. Do not modify unrelated frontend configuration or generated output. |
| Verification | `cd frontend && bun run test -- src/styles/tokens.test.ts`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f1-build` |
| Rollback boundary | Revert only the listed baseline/config paths and the baseline router-test assertion hunk. Do not revert existing feature files, old worktree churn, or generated `frontend/dist`. |
| Issue requirement | One child issue under the separate foundation tracker, for example **Foundation: canonical visual baseline and compile configuration**. The future PR closes only that child and must not reference #5 with a closing keyword. |

### F-2 — Shared primitives set A

| Field | Boundary |
|---|---|
| Estimated changed lines | **220 maximum target** |
| Dependency | Accepted F-1 tokens and compile configuration |
| Exact paths | `frontend/src/components/primitives/Button.tsx`; `IconButton.tsx`; `Card.tsx`; `FormField.tsx`; the corresponding test blocks in `frontend/src/components/primitives/core.test.tsx` |
| Artboard scope | Primitive-level support for all artboards; review the button, card, and field geometry used by artboards 1–2, without accepting a screen implementation. |
| Work | Deliver token-driven primary/ghost/icon buttons, accessible icon buttons, raised cards, and labeled dark-theme form fields. Keep components presentational: no routing, fixture imports, product copy, or product state. F-2 owns the initial `core.test.tsx` blocks for these four primitives. |
| Verification | `cd frontend && bun run test -- src/components/primitives/core.test.tsx`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f2-build` |
| Rollback boundary | Revert only the four primitive modules and their F-2 test blocks. Retain F-1 and unrelated pre-existing `components/ui/` or legacy component files. |
| Issue requirement | One distinct child issue, for example **Foundation: primitives set A**. The future PR closes only its F child; it is not issue #5 work. |

### F-3 — Shared primitives set B

| Field | Boundary |
|---|---|
| Estimated changed lines | **280 maximum target** |
| Dependency | Accepted F-2 primitive conventions |
| Exact paths | `frontend/src/components/primitives/TabBar.tsx`; `Modal.tsx`; `DataTable.tsx`; `Badge.tsx`; `PageHeader.tsx`; only the additional test blocks in `frontend/src/components/primitives/core.test.tsx` |
| Artboard scope | Primitive-level support for filter/tab, modal, table, status badge, and page-header structures across artboards 1–45; no feature screen is accepted here. |
| Work | Deliver controlled tabs, modal backdrop/close/content slots, deterministic presentational tables, badges, and page headers. F-3 appends its focused assertions to the mixed `core.test.tsx`; it must not rewrite or remove the F-2 assertions. No routing, fixtures, or product rules. |
| Verification | `cd frontend && bun run test -- src/components/primitives/core.test.tsx`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f3-build` |
| Rollback boundary | Revert only the five F-3 primitive modules and F-3 test blocks. F-2 remains usable after rollback. |
| Issue requirement | One distinct child issue, for example **Foundation: primitives set B**. The future PR closes only that child issue and performs no #5 closure. |

### F-4 — Public/admin shells and navigation

| Field | Boundary |
|---|---|
| Estimated changed lines | **250 maximum target** |
| Dependency | Accepted F-1 through F-3 primitives |
| Exact paths | `frontend/src/components/navigation/Sidebar.tsx`; `frontend/src/layouts/PublicShell.tsx`; `frontend/src/layouts/AdminShell.tsx`; `frontend/src/layouts/shells.test.tsx` |
| Artboard scope | Shared outer geometry for auth-adjacent review context and public/admin artboards 3–45: 248px sidebar, brand/role badge, grouped navigation, active route styling, stable outlet content. No public page body is included. |
| Work | Make public and admin shells independent, each owning its outlet and context navigation model through `Sidebar` props. F-4 owns the full shell test file and its route-neutral test fixtures. Leave legacy `frontend/src/layouts/AppShell.tsx`, old shell helpers, and unrelated navigation files untouched unless a later route unit needs to stop importing them. |
| Verification | `cd frontend && bun run test -- src/layouts/shells.test.tsx`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f4-build`; manual shell check at the canonical desktop width |
| Rollback boundary | Revert only Sidebar, the two new shells, and the shell test. Keep F-1 through F-3 and all legacy shell files. |
| Issue requirement | One distinct child issue, for example **Foundation: public and admin shells**. Close only that F child in the future PR; do not alter #5. |

### F-5 — Typed public fixture contract and records

| Field | Boundary |
|---|---|
| Estimated changed lines | **320 maximum target** |
| Dependency | Accepted F-1 through F-4; no route dependency |
| Exact paths | `frontend/src/fixtures/types.ts`; `frontend/src/fixtures/public.ts`; the public fixture assertions in `frontend/src/fixtures/public.test.ts`; the public/type export lines in `frontend/src/fixtures/index.ts` |
| Artboard scope | Fixture/data foundation for public artboards 3–24 and stable cross-screen IDs. No public page is implemented or visually accepted. |
| Work | Establish readonly TypeScript shapes and deterministic Spanish fixture records for matches, tournaments, teams, and players. Keep records immutable, stable, non-random, non-time-derived, and free of derived volleyball/business rules. F-5 owns the public/type portion of the mixed fixture barrel. |
| Verification | `cd frontend && bun run test -- src/fixtures/public.test.ts`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f5-build` |
| Rollback boundary | Revert only the public fixture/type blocks and F-5 barrel exports. Do not remove F-6 scoring/admin fixtures if they have already landed; a rollback before F-6 is the normal supported boundary. |
| Issue requirement | One distinct child issue, for example **Foundation: public fixture contract and records**. It is tracked outside #5 and closes only its own child issue. |

### F-6 — Scoring/admin fixture records

| Field | Boundary |
|---|---|
| Estimated changed lines | **230 maximum target** |
| Dependency | Accepted F-5 stable IDs and fixture types |
| Exact paths | `frontend/src/fixtures/scoring.ts`; `frontend/src/fixtures/admin.ts`; `frontend/src/fixtures/scoring-admin.test.ts`; the scoring/admin export lines added to `frontend/src/fixtures/index.ts` |
| Artboard scope | Fixture/data foundation for scorer and admin artboards 25–45. No scorer/admin screen implementation is included. |
| Work | Add immutable scoring setup/console/point-entry/summary records and admin staff/tournament/match/team/player listing records, reusing F-5 IDs. Do not add services, mutations, random values, timestamps, persistence, or domain-rule calculations. F-6 owns only its additions to the mixed fixture barrel. |
| Verification | `cd frontend && bun run test -- src/fixtures/scoring-admin.test.ts`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f6-build` |
| Rollback boundary | Revert the scoring/admin fixture modules, their tests, and their barrel export lines. F-5 public fixtures and types remain intact. |
| Issue requirement | One distinct child issue, for example **Foundation: scoring and admin fixture records**. The future PR closes only this F child and does not close #5. |

### F-7 — Placeholder route tree and 45-artboard manifest

| Field | Boundary |
|---|---|
| Estimated changed lines | **380 maximum target** |
| Dependency | Accepted F-4 shells and F-5/F-6 fixture contracts; route consumers may still be placeholders |
| Exact paths | `frontend/src/router.tsx`; foundation route assertions in `frontend/src/router.test.tsx`; `frontend/src/artboardManifest.ts`; `frontend/src/artboardManifest.test.ts`; `frontend/src/pages/PlaceholderPage.tsx` |
| Artboard scope | Route/entry reachability metadata for all 45 artboards. This unit proves route parity and shell nesting only; it does **not** accept public discovery artboards 3–13 or any detail/scorer/admin body. |
| Work | Replace the generic route tree with explicit auth, public, and admin shell branches; declare all canonical route bases and query entries; remove `/dashboard` as a route; bind all unimplemented destinations to explicit placeholders; and maintain the typed 45-entry manifest. F-7 owns the route-map portion of `router.tsx` and the route/manifest portions of `router.test.tsx`. It must not import `features/public` pages. Keep public `/`, `/matches`, and `/tournaments` as placeholder bindings for the foundation handoff. |
| Mixed-file rule | `router.tsx` is intentionally split by hunk: F-7 owns shell creation, navigation models, placeholder route declarations, and route-tree assembly; F-8 owns only auth imports/bindings; PD-1, PD-2, and PD-3 later own their respective public route-binding hunks. `router.test.tsx` similarly remains foundation route parity in F-7; later PD tests add only their feature assertions. `artboardManifest.ts` is wholly foundation metadata, even though it lists future artboards. |
| Verification | `cd frontend && bun run test -- src/router.test.tsx src/artboardManifest.test.ts`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f7-build`; verify manifest route parity reports zero missing entries |
| Rollback boundary | Revert only the F-7 route/manifest/placeholder paths or F-7 hunks. Preserve shells, primitives, fixtures, and unrelated legacy route files. A rollback returns all canonical destinations to the pre-F-7 route state; it must not delete public feature files. |
| Issue requirement | One distinct child issue, for example **Foundation: canonical route map and artboard manifest**. Close only that child issue in its future PR; #5 remains untouched. |

### F-8 — Boundary enforcement and access screens

| Field | Boundary |
|---|---|
| Estimated changed lines | **350 maximum target** |
| Dependency | Accepted F-7 placeholder route tree and all previous foundation units |
| Exact paths | `frontend/src/boundary.ts`; `frontend/src/boundary.test.ts`; `frontend/src/features/auth/LoginPage.tsx`; `frontend/src/features/auth/ChangePasswordPage.tsx`; `frontend/src/features/auth/auth.test.tsx`; only the auth import/route-binding hunks in `frontend/src/router.tsx` |
| Artboard scope | Artboards 1–2: `Login Desktop` and `Cambio Contraseña Desktop`, plus the integration boundary for the entire frontend prototype. Public artboards 3–13 remain placeholders and are not accepted here. |
| Work | Add the deterministic source boundary scanner/test for network, HTTP/API, WebSocket/SSE, auth guards, and browser persistence; implement local-only login and change-password screens with shared primitives; bind only `/login` and `/change-password` to those screens. Form submission must not authenticate, persist, or call a backend. Do not add public feature imports to the router. |
| Mixed-file rule | The only F-8 edit to `router.tsx` is replacing the two auth placeholder components with the auth feature components. Any root/dashboard, matches, or tournaments binding belongs to PD-1/PD-2/PD-3. |
| Verification | `cd frontend && bun run test -- src/boundary.test.ts src/features/auth/auth.test.tsx`; `cd frontend && bun run test`; `cd frontend && bun run lint`; `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false`; `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-f8-build`; manual comparison of artboards 1–2 at their canonical desktop dimensions |
| Rollback boundary | Revert boundary scanner/tests, auth feature files/tests, and the auth-only router hunk. Leave the F-7 route map and all shared foundations intact; auth routes may temporarily return to placeholders. |
| Issue requirement | One distinct child issue, for example **Foundation: access screens and integration boundary**. The future PR closes only its F child issue and must not close #5. |

## Foundation completion gate before PD-1

F-8 is not complete until the foundation can stand alone as a coherent committed baseline:

- [ ] F-1 through F-8 are accepted in order and each stayed at or below 400 estimated changed lines.
- [ ] The worktree diff for the foundation contains only the F-unit allowlists; public-discovery files are excluded from the foundation commit.
- [ ] `/login` and `/change-password` render the access screens; all other canonical route entries compile and render explicit placeholders.
- [ ] `cd frontend && bun run test` passes with the foundation-only route bindings.
- [ ] `cd frontend && bun run lint` passes.
- [ ] `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` passes.
- [ ] `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-foundation-final-build` passes without writing `frontend/dist`.
- [ ] The boundary test passes and no backend, network, auth, persistence, or canonical `.op` file changed.
- [ ] Visual sign-off exists for shared shell/token primitives and artboards 1–2; placeholder artboards are recorded as intentionally deferred, not falsely accepted.
- [ ] Only after this gate is the foundation committed and handed to PD-1.

## Public-discovery handoff and current-worktree reconciliation

The existing public implementation is assigned as follows and must remain outside F units:

| Public unit | Exact implementation paths | Foundation interaction |
|---|---|---|
| PD-1 | `frontend/src/features/public/DashboardPage.tsx`; `DashboardPage.test.tsx`; the root-route hunk in `frontend/src/router.tsx`; legacy `frontend/src/pages/DashboardPage.tsx` and `.test.tsx` removal only when required to complete the `/dashboard` non-goal | Starts from committed F-8; no foundation file is rewritten wholesale. |
| PD-2 | `frontend/src/features/public/MatchesPage.tsx`; `MatchesPage.test.tsx`; the `/matches` route/search hunk in `frontend/src/router.tsx` | Uses F-5 public match fixtures and F-3 `TabBar`; does not implement live-match detail. |
| PD-3 | `frontend/src/features/public/TournamentsPage.tsx`; `TournamentsPage.test.tsx`; the `/tournaments` route/search hunk in `frontend/src/router.tsx` | Uses F-5 public tournament fixtures and F-3 `TabBar`; does not implement tournament detail tabs. |
| PD-4 | Focused cross-page link/active-navigation changes, route-parity assertions, and acceptance evidence in the relevant public tests and route hunk only | Audits artboards 3–13; does not absorb foundation drift or add new screens. |

The mixed files are therefore deliberately sequenced rather than copied into multiple oversized commits: `router.tsx` is partitioned by route-binding hunk, `router.test.tsx` by foundation versus public assertions, `artboardManifest.ts` is foundation-owned metadata, `fixtures/types.ts` is foundation-owned shared contract, and `fixtures/index.ts` is extended first by F-5 and then by F-6. `index.css` and `tsconfig.app.json` are entirely F-1-owned. A unit review must show only its assigned hunks when a file is shared.

## Explicit exclusions from every F unit

Do not include or stage the following in the foundation sequence:

- Generated or staged `frontend/dist/**` output, including screenshots, JPEGs, bundles, and `code.html`.
- `.atl/**`, including its unrelated tracked registry modification.
- Unrelated OpenSpec changes such as `openspec/config.yaml`, `openspec/sdd-init-context.md`, archived changes, or any change directory other than the two delivery-plan files explicitly named by this task.
- Pre-existing legacy worktree churn outside the F allowlists, including old `frontend/src/pages/**` implementations, `frontend/src/features/dashboard/**`, `frontend/src/features/matches/**`, `frontend/src/components/ShellFooter.tsx`, `ShellTopbar.tsx`, `ShellUtilityBar.tsx`, `frontend/src/components/ui/**`, `frontend/src/shared/**`, `frontend/src/layouts/AppShell.tsx`, and unrelated assets/configuration.
- Public detail, scorer, admin, UI-state, backend, persistence, authentication enforcement, API, real-time, and mobile-redesign work.

If a file is both dirty from old worktree activity and needed by a listed unit, isolate only the named F hunk; never clean up or revert the unrelated portion as part of this plan.

## Closure protocol

- Foundation F children are tracked under a foundation tracker separate from #5. Each F PR closes only its own child issue.
- PD-1 through PD-4 retain the existing `delivery-plan.md` issue boundaries: each gets a distinct child issue and uses `Refs #5` or `Part of #5`, never `Closes #5`.
- **No public-discovery PR can close #5 until F-1 through F-8 and PD-1 through PD-4 are all accepted.** A final maintainer action or explicitly designated final integration PR closes #5 only after that gate.
- After PD-4, public detail artboards 14–24 move to a new tracker rather than extending #5.

## Next step

Create the foundation tracker/child issues, reconcile the current mixed worktree against the F-unit allowlists, and execute F-1 through F-8 in order. Do not begin or commit PD-1 until the Foundation completion gate passes and the foundation is committed as a compilable baseline.
