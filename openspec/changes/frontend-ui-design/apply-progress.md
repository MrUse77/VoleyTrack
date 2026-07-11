# Apply Progress: Frontend UI Design

## Current Boundary

- Active delivery slice: **Slice 1 — Foundations and Access**.
- Implementation status: **code complete for the planned Slice 1 foundation**, with visual comparison sign-off intentionally pending.
- No Slice 2 feature implementation was started.
- No commits, branches, or PRs were created.

## Recovery and Safety

The timed-out implementation attempt was stopped and preserved outside the repository:

- `/tmp/voleytrack-recovery-20260710T213759Z-272837/`
- `/tmp/voleytrack-recovery-20260710T214315Z-post-drift-274702/`
- `/tmp/voleytrack-quarantine-20260710T214950Z/`

The tracked frontend baseline was restored before the current implementation was rebuilt in bounded batches. The unrelated pre-existing worktree changes were not reverted.

## Slice 1 Delivered

- Canonical semantic tokens and 1440px desktop canvas policy.
- Nine presentational primitives: Button, IconButton, Card, FormField, TabBar, Modal, DataTable, Badge, and PageHeader.
- Public/admin shells and grouped active-path Sidebar.
- Immutable public, scoring, and admin fixtures with stable IDs and Spanish display data.
- Typed 45-artboard manifest and route integration for all manifest route bases and query entries.
- Local-only auth feature pages for Login and Change Password.
- Deterministic source boundary scanner/test preventing network, HTTP, WebSocket, auth, and persistence usage.
- Removed the stale `/src/style.css` link from `frontend/index.html`.

Unimplemented artboards intentionally render through the explicit generic placeholder route until Slices 2–5 replace them with their real UI; this is the planned slice boundary, not an integration.

## Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 15 files, 32 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir <temporary-directory>` | PASS — output under `/tmp`, no missing CSS warning |
| Manifest route parity | PASS — 33 route bases, 13 query entries, 0 missing |
| Network/auth/persistence boundary test | PASS — no violations |

## Remaining Slice 1 Evidence

The automated implementation evidence is complete. Visual side-by-side comparison against the OpenPencil artboards remains pending because this session has no browser screenshot harness. The next session should review the Login/Change Password artboards, shells, primitives, and desktop canvas before starting Slice 2.

## Task 2.1: Public dashboard (automated implementation ready)

- Added the local-only `/` public dashboard with fixture-driven live/upcoming match cards, tournament cards, and metric cards using `Card`, `Badge`, and `PageHeader` primitives.
- The legacy dashboard at `/` is removed. `/dashboard` is a removed non-goal: it does not redirect and does not retain duplicate route markup. All other canonical routes remain unchanged.
- Added Node-compatible SSR coverage for fixture rendering, shared-card markup, and active Dashboard navigation.
- Visual comparison at the canonical 1440×900 artboard is still pending. Task 2.1 remains unchecked in `tasks.md` until that evidence is recorded.

## Task 2.1 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/DashboardPage.test.tsx` | PASS — 1 file, 2 tests |
| `cd frontend && bun run test` | PASS — 16 files, 34 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-dashboard-build` | PASS — output under `/tmp` |

## Task 2.2: Public matches (automated implementation ready)

- Moved `/matches` to the `PublicShell` route branch and replaced the legacy page with the fixture-driven public matches page.
- The local status filter initializes from `?status=live|today|upcoming|finished`; its controlled `TabBar` and status summary cards update only local state.
- Artboards 4–8 use immutable public match fixtures and retain the canonical Spanish heading, description, status labels, palette, and desktop composition.
- Visual comparison at the canonical 1440×900 artboards is still pending because this session has no browser screenshot harness. Task 2.2 remains unchecked in `tasks.md` until that evidence is recorded.

## Task 2.2 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/MatchesPage.test.tsx src/router.test.tsx` | PASS — 2 files, 8 tests |
| `cd frontend && bun run test` | PASS — 16 files, 40 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-matches-build` | PASS — output under `/tmp` |

## Task 2.3: Public tournaments (automated implementation ready)

- Replaced only the public `/tournaments` placeholder with the fixture-driven `TournamentsPage` under `PublicShell`; all unrelated routes remain unchanged.
- The local controlled filter initializes from `?status=todos|en-curso|proximos|finalizados`, uses the shared `TabBar`, and never persists state.
- Artboards 9–13 use immutable public tournament fixtures with the canonical Spanish heading, description, status labels, dark palette, and desktop card composition.
- Visual comparison at the canonical 1440×900 artboards remains pending because this session has no browser screenshot harness. Task 2.3 remains unchecked in `tasks.md` until that evidence is recorded.

## Task 2.3 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentsPage.test.tsx` | PASS — 1 file, 6 tests |
| `cd frontend && bun run test -- src/features/public/TournamentsPage.test.tsx src/router.test.tsx` | PASS — 2 files, 9 tests |
| `cd frontend && bun run test` | PASS — 17 files, 46 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-tournaments-build-fUgnIU` | PASS — output under `/tmp` |

## Task 2.4: Bounded public navigation (automated implementation ready)

- Added local TanStack Router links from fixture-driven dashboard, matches, and tournaments content to the already-declared canonical `/matches/$id/live` and `/tournaments/$id` routes.
- The dashboard's existing live-match filter link now uses TanStack Router navigation to `/matches?status=live`; Matches and Tournaments retain their local, non-persistent filter state.
- No router, shell, fixture, detail-page, breadcrumb, network, auth, or persistence behavior changed. The canonical detail routes continue to render their existing placeholders under `PublicShell`.
- Node-compatible SSR assertions cover representative fixture IDs and canonical hrefs. Task 2.4 remains unchecked in `tasks.md`: remaining detail-page navigation, breadcrumbs, and visual comparison evidence are future work.

## Task 2.4 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/DashboardPage.test.tsx src/features/public/MatchesPage.test.tsx src/features/public/TournamentsPage.test.tsx` | PASS — 3 files, 16 tests |
| `cd frontend && bun run test` | PASS — 17 files, 49 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir <temporary-directory>` | PASS — output under `/tmp` |

## Current Build-Fix Batch

- Kept dynamic public detail-link runtime URLs unchanged while typing the links as dynamic paths because the generic placeholder route helper does not infer its path parameters.
- Narrowed route-child inspection in `router.test.tsx` and widened the manifest route collection only for the `/dashboard` negative assertion.

## Current Build-Fix Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 17 files, 49 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-frontend-build` | PASS — output under `/tmp` |

## Next Action

Capture and record the 1440×900 visual comparisons for artboards 3–13 before marking Tasks 2.1, 2.2, or 2.3 complete; then resume the remaining Slice 2 public pages and Task 2.4 detail-page navigation/breadcrumbs in bounded review slices.

## Delivery Note

The current UI implementation and SDD artifacts were staged for the authorized commit `feat(frontend): implement UI foundation and public discovery`, excluding generated `frontend/dist/**`, `.atl/**`, and archived OpenSpec artifacts. The commit was not created because the runtime pre-commit gate requires a registered review-controller authorization derived from an approved receipt. `gentle_review start` is unsupported in this session, so no receipt can be produced and the gate must not be bypassed or fabricated. The staged index remains intact for a later authorized commit.

## Next Action

Resolve the review-controller receipt limitation, then run the exact authorized commit. After that, continue screen-by-screen with one commit per coherent unit.

## Task 2.5: Public tournament overview

- Replaced only the `/tournaments/$id` placeholder with a fixture-driven `TournamentDetailPage` selected by the route id.
- Added the canonical overview composition with Spanish tournament title, status, dates, location, category, summary information, and local navigation links for Resumen, Partidos, Tabla, Estadísticas, and Cuadro.
- Matches, standings, stats, and bracket bodies remain delegated to their existing placeholder routes.
- Added SSR coverage for fixture selection, overview content, alternate status data, and canonical tab hrefs.

## Task 2.5 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentDetailPage.test.tsx` | PASS — 1 file, 3 tests |
| `cd frontend && bun run test` | PASS — 18 files, 52 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-tournament-detail-build` | PASS — output under `/tmp` |

## Task 2.5 Boundary

- Changed source/progress files only within the delegated edit surfaces.
- The page and test contain 181 lines; including the 7-line router diff, the implementation unit is 188 touched source lines, below the 300-line limit. No commits, staging, branches, pushes, or PRs were created.

## Task 2.6: Public tournament matches tab

- Replaced only `/tournaments/$id/matches` with a fixture-driven public matches screen for the selected tournament.
- Added canonical Spanish tournament context, local tab navigation, status/date/venue match rows, static scores, and live-detail links using immutable public fixtures. Standings, stats, and bracket remain placeholder routes; the overview route is unchanged.
- Added SSR coverage for tournament selection, all fixture statuses, local tab hrefs/active state, match rows, and unknown-tournament handling.

## Task 2.6 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentMatchesPage.test.tsx src/router.test.tsx` | PASS — 2 files, 6 tests |
| `cd frontend && bun run test` | PASS — 19 files, 55 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-tournament-matches-build` | PASS — output under `/tmp` |

## Task 2.6 Boundary

- Changed source/progress files only within the delegated edit surfaces.
- The page and test contain 180 lines; including the 7-line router diff, the implementation unit is 187 touched source lines, below the 300-line limit. No commits, staging, branches, pushes, or PRs were created.

## Task 2.7: Public tournament standings tab

- Replaced only `/tournaments/$id/standings` with a fixture-driven standings screen using the selected tournament context, canonical Spanish local navigation, a static standings table, status badges, and the shared `Card`, `DataTable`, and `PageHeader` primitives.
- Added local immutable display rows because the public fixture contract has no standings data. Stats, bracket, APIs, auth, persistence, WebSockets, backend, and `.op` files remain unchanged; overview and matches routes remain unchanged.
- Added Node-compatible SSR coverage for tournament context, standings headers/rows, active tab links, alternate tournament status, and unknown-tournament handling.

## Task 2.7 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentStandingsPage.test.tsx` | PASS — 1 file, 4 tests |
| `cd frontend && bun run test` | PASS — 20 files, 59 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-tournament-standings-build` | PASS — output under `/tmp` |

## Task 2.7 Boundary

- Changed only the delegated page, SSR test, public standings route, and this progress file. The page and test contain 201 lines; including the 7-line router diff, the implementation unit is 208 changed source lines, below the 300-line limit. No commits, staging, branches, pushes, or PRs were created.
