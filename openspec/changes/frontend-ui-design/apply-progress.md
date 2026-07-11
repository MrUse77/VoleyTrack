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

## Current State Reconciliation — 2026-07-11

- Commit `530211f feat(frontend): implement UI foundation and public discovery` contains the foundation, dashboard, matches, tournaments, and SDD artifacts.
- Commit `4a9d35b feat(frontend): add tournament overview` contains artboard 14.
- Commit `ac598ba feat(frontend): add tournament matches and standings` (2026-07-11) contains artboards 15 and 16 (Tournament Matches and Tournament Standings), the router integration, and the matching section of this progress file.
- Commit `e008c0d feat(frontend): add tournament stats tab (artboard 17)` contains the Tournament Stats page + SSR test, the public Stats route (`/tournaments/$id/stats` switched from placeholder to `createRoute`), and this progress file.
- Commit `ed758f5 feat(frontend): add tournament bracket tab (artboard 18)` contains the Tournament Bracket page + SSR test.
- Commit `e8290b5 feat(frontend): wire tournament bracket route` mounts `TournamentBracketPage` at `/tournaments/$id/bracket` through `createRoute`.
- Commit `e61de45 feat(frontend): add public team overview (artboard 19)` contains the fixture-driven Team overview page, SSR coverage, router registration, and isolated future-tab links.
- Commit `d39ce00 feat(frontend): add public team roster (artboard 20)` contains the fixture-driven Team roster page, roster join coverage, explicit route registration, and isolated future-tab links.
- The earlier delivery note stating that the foundation/public-discovery commit was not created is historical and is superseded by the eight implementation commits above plus the documentation synchronization commit `d87a6fc`.

## Remaining Work Map

1. **Public detail:** team matches (artboard 21), team stats (22), live match detail (23), and player detail (24). Artboards 19–20 Team overview and roster are implemented and committed; visual comparison and remaining detail-navigation evidence are still pending.
2. **Scorer workflows:** setup/player modal, scoring/substitution, point entry, and post-match summary (25–30).
3. **Administration:** staff, admin tournament tabs, creation forms/modals, and listings (31–45).
4. **Shared states and closeout:** loading/empty/error/offline/sync states, state injection, route/manifest audit, and visual comparisons.

Every screen unit requires focused SSR tests, full tests/lint/TypeScript/build validation, and a manual visual comparison when the screenshot harness is available.

## Task 2.8: Public tournament stats tab (artboard 17)

- Replaced only `/tournaments/$id/stats` placeholder with a fixture-driven stats screen using the selected tournament context, canonical Spanish local navigation, a static leaders grid (Puntos/Remates/Bloqueos/Saques/Recepciones), and the shared `Card`, `Badge`, and `PageHeader` primitives.
- Standings, bracket, APIs, auth, persistence, WebSockets, backend, and `.op` files remain unchanged; overview, matches, and standings routes remain unchanged.
- The stats route switches from `placeholderRoute` to `createRoute` pointing at the new `TournamentStatsPage` component.
- Added Node-compatible SSR coverage for tournament context, leaders content, active tab links, alternate tournament status (finished), and unknown-tournament handling.

### Task 2.8 Verification (final)

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentStatsPage.test.tsx src/router.test.tsx` | PASS — 2 files, 7 tests |
| `cd frontend && bun run test` | PASS — 22 files, 67 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-tournament-stats-bracket-build` | PASS |
| Boundary test | PASS — no network/auth/persistence in new page |

### Task 2.8 Boundary

- Changed only the delegated page, SSR test, public stats route, and this progress file. The page and test contain 200 lines; the router diff is ~6 source lines. Total implementation unit ~206 touched source lines, below the 300-line limit. Stats is one self-contained committed unit (`e008c0d`); Bracket (Task 2.9) was intentionally split off and remains the next unit.

## Task 2.9: Public tournament bracket tab (artboard 18)

- Replaced only `/tournaments/$id/bracket` placeholder with a fixture-driven bracket screen using the selected tournament context, canonical Spanish local navigation, a static elimination grid (Cuartos → Semifinal → Final), per-match scores/status badges, and the shared `Card`, `Badge`, and `PageHeader` primitives.
- Stats, APIs, auth, persistence, WebSockets, backend, and `.op` files remain unchanged; overview, matches, standings, and stats routes remain unchanged.
- Commit `ed758f5` contains the page and SSR test; commit `e8290b5` wires `/tournaments/$id/bracket` from `placeholderRoute` to `createRoute` with `TournamentBracketPage`.
- The active tab is labeled "Cuadro" to match the overview (artboard 14) and standings page; the matches page still uses "Llave" (a known minor inconsistency carried over from commit `ac598ba` and deliberately left untouched under the non-goal of not modifying delivered artboards in this scope).
- Added Node-compatible SSR coverage for tournament context, bracket rounds, active tab links, alternate tournament status (upcoming), and unknown-tournament handling.

### Task 2.9 Verification (final)

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/public/TournamentBracketPage.test.tsx` | PASS — 1 file, 4 tests |
| `cd frontend && bun run test` | PASS — 22 files, 67 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-bracket-router-build` | PASS |
| Boundary test | PASS — no network/auth/persistence in new page |

### Task 2.9 Boundary

- Changed only the delegated Bracket page, SSR test, public bracket route, and this progress file across commits `ed758f5` and `e8290b5`. The page and test contain 242 lines; the router diff contains 6 source lines. Total implementation unit is ~248 touched source lines, below the 300-line limit. The route is now wired through `createRoute`.

## Task 3.2: Public team overview and roster (artboards 19–20)

- Commit `e61de45` replaced only `/teams/$id` with fixture-driven `TeamDetailPage`, rendering team metadata, roster preview, not-found handling, and prepared local links.
- Commit `d39ce00` replaced only `/teams/$id/roster` with fixture-driven `TeamRosterPage`, preserving `rosterPlayerIds` order, handling empty/orphaned roster entries, and marking Plantel active.
- Artboards 21–22 remain intentionally isolated placeholders/follow-up units. No backend/API/auth/persistence/network/WebSocket changes.

### Task 3.2 Verification (final)

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 24 files, 76 tests |
| `cd frontend && bun run test -- src/features/public/TeamDetailPage.test.tsx src/features/public/TeamRosterPage.test.tsx src/router.test.tsx` | PASS — 3 files, 12 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-team-roster-build` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — no network/auth/persistence |
| Review controller | APPROVED — artboard 19 lineage `team-overview-2026-07-11-v4`; artboard 20 lineage `team-roster-2026-07-11-v3` |

### Task 3.2 Boundary

- Commit `e61de45` contains the 4-file Team overview unit: 171 insertions and 1 deletion.
- Commit `d39ce00` contains the 4-file Team roster unit: 150 insertions and 3 deletions.
- Both units remain below the chained-PR budget. Artboards 21–22 are explicitly out of scope.
## Review Controller Diagnostic (carried forward to next session)

The gentle-pi `gentle_review` controller was investigated end to end this session with the operator's authorization. Findings to save the next session a re-investigation:

- The `start` operation requires `input` as a JSON-encoded string with: `mode` = `"ordinary"` or `"judgment-day"`; `projection.kind` = `"complete"` or `"intended-commit"` (the latter requires `projection.tree: string`); `policyHash` and `evidenceHash` each as a 64-character lowercase hex SHA-256 digest; and `budget` with all 8 zero counters (`review_batches`, `review_actors`, `refuter_batches`, `fix_batches`, `validator_runs`, `final_verifications`, `judgment_rounds`, `judge_runs`).
- The `reset` operation requires `input` JSON with all four fields: `repositoryId`, `commonDirHash`, `inventoryHash`, `confirmation`. The confirmation string comes from `inspect.reset_request.confirmation` and must match byte-perfect (including surrounding whitespace).
- The legacy review authority at `.git/gentle-ai/reviews/{lineages,locks,snapshots}` blocks `start` with `Review authority blocked (blocked-legacy)`. Authorized destructive reset was executed this session (`reset_id=50cd238f913a4c0f72a7fba1bd216bcdfd26969fc0b9ed43576a0f2e33a9c285`, `initialization_kind="destructive-reset"`); current authority is `clean`.
- After reset and `start`, ordinary transactions require 6 transitions (`ordinary-discovery`, `ordinary-evidence`, `ordinary-fix` or `ordinary-no-fix`, `ordinary-validation`, `ordinary-final-verification`) each routing through actor + refuter + validator cycles. A `start` capturing 854+ changed lines, hot-path files (`frontend/src/router.tsx`), or large evidence (`frontend/dist/`) defaults to the `full-4R` route (4 lens reviews in parallel).
- One transaction (`stats-pr-2026-07-11`, `phase=started, revision=0`) was opened this session and intentionally left persisted. It captured the full working tree as the diff because the file inventory at start time included Bracket + `frontend/dist/` + apply-progress. The next session should NOT advance it; instead, after each manual commit lands, the next session opens a fresh lineage id (`gr-pr-<yyyy-mm-dd>` style) with a properly narrowed snapshot limited to one task unit's files.
