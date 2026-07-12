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
- Commit `2856c21 feat(frontend): add public team matches (artboard 21)` contains the fixture-driven Team matches page, match filtering/order/link coverage, explicit route registration, and isolated future-stats links.
- Commit `bc8a4c1 feat(frontend): add public team stats (artboard 22)` contains the fixture-driven Team stats page, statistics grid, active Estadísticas tab, route wiring, and isolated follow-up links (PR #25).
- Commit `f8ab934 feat(frontend): add public live match detail (artboard 23)` contains the fixture-driven static Live match page with score, teams, venue, badge, unknown-match fallback, and route wiring (PR #26).
- Commit `3ef35bf feat(frontend): add public player detail (artboard 24)` contains the fixture-driven Player detail page with bio, team lookup, back navigation, unknown-player fallback, and route wiring (PR #27).
- The earlier delivery note stating that the foundation/public-discovery commit was not created is historical and is superseded by the thirteen implementation commits above plus the documentation synchronization commits `d87a6fc`, `b10e4d0`, and `5484c4f`.

## Remaining Work Map

1. **Scorer workflows:** setup/player modal, scoring/substitution, point entry, and post-match summary (artboards 25–30).
2. **Administration:** staff, admin tournament tabs, creation forms/modals, and listings (31–45).
3. **Shared states and closeout:** loading/empty/error/offline/sync states, state injection, route/manifest audit, and visual comparisons.

Artboards 1–24 (public discovery, tournament detail, team detail, live match, and player detail) are implemented and committed via PRs #24, #25, #26, and #27. Visual comparison and remaining detail-navigation evidence are still pending for the integration audit (#9) and visual baseline (#11).

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
| `cd frontend && bun run test` | PASS at Task 2.9 completion — 22 files, 67 tests; current baseline is 25 files, 80 tests |
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
| `cd frontend && bun run test` | PASS — 25 files, 80 tests |
| `cd frontend && bun run test -- src/features/public/TeamDetailPage.test.tsx src/features/public/TeamRosterPage.test.tsx src/features/public/TeamMatchesPage.test.tsx src/router.test.tsx` | PASS — 4 files, 19 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-team-roster-build` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — no network/auth/persistence |
| Review controller | APPROVED — artboard 19 lineage `team-overview-2026-07-11-v4`; artboard 20 lineage `team-roster-2026-07-11-v3` |

### Task 3.2 Boundary

- Commit `e61de45` contains the 4-file Team overview unit: 171 insertions and 1 deletion.
- Commit `d39ce00` contains the 4-file Team roster unit: 150 insertions and 3 deletions.
- Commit `2856c21` contains the 4-file Team matches unit: 177 insertions and 1 deletion.
- Commit `bc8a4c1` contains the 4-file Team stats unit: 166 insertions and 1 deletion.
- Commit `f8ab934` contains the 4-file Live match unit: 191 insertions and 1 deletion.
- Commit `3ef35bf` contains the 4-file Player detail unit: 140 insertions and 1 deletion.
- All seven units (artboards 19–24) remain below the chained-PR budget.

## Task 3.6: Public team stats (artboard 22)

- PR #25 replaced `/teams/$id/stats` placeholder with fixture-driven `TeamStatsPage` rendering team context, statistics tiles (PJ, PG, PP, sets ganados/perdidos, puntos a favor), local team tabs with Estadísticas active, and unknown-team fallback.
- No backend/API/auth/persistence/network/WebSocket changes.

### Task 3.6 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 28 files, 90 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-team-stats-build` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — no network/auth/persistence |
| Review controller | APPROVED — lineage `team-stats-2026-07-11-v1` |

## Task 3.7: Public live match detail (artboard 23)

- PR #26 replaced `/matches/$id/live` placeholder with fixture-driven `LiveMatchPage` rendering static match context, score, venue, scheduled label, status badge, and unknown-match fallback.
- No WebSockets, polling, real-time, backend/API/auth/persistence changes.

### Task 3.7 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 28 files, 90 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-live-match-build` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — no network/auth/persistence |
| Review controller | APPROVED — lineage `live-match-2026-07-11-v1` |

## Task 3.8: Public player detail (artboard 24)

- PR #27 replaced `/players/$id` placeholder with fixture-driven `PlayerDetailPage` rendering player name, number, position, team lookup, biography, back navigation, and unknown-player fallback.
- No backend/API/auth/persistence/network/WebSocket changes.

### Task 3.8 Verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test` | PASS — 28 files, 90 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-player-detail-build` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — no network/auth/persistence |
| Review controller | APPROVED — lineage `player-detail-2026-07-11-v1` |



The gentle-pi `gentle_review` controller was investigated end to end this session with the operator's authorization. Findings to save the next session a re-investigation:

- The `start` operation requires `input` as a JSON-encoded string with: `mode` = `"ordinary"` or `"judgment-day"`; `projection.kind` = `"complete"` or `"intended-commit"` (the latter requires `projection.tree: string`); `policyHash` and `evidenceHash` each as a 64-character lowercase hex SHA-256 digest; and `budget` with all 8 zero counters (`review_batches`, `review_actors`, `refuter_batches`, `fix_batches`, `validator_runs`, `final_verifications`, `judgment_rounds`, `judge_runs`).
- The `reset` operation requires `input` JSON with all four fields: `repositoryId`, `commonDirHash`, `inventoryHash`, `confirmation`. The confirmation string comes from `inspect.reset_request.confirmation` and must match byte-perfect (including surrounding whitespace).
- The legacy review authority at `.git/gentle-ai/reviews/{lineages,locks,snapshots}` blocks `start` with `Review authority blocked (blocked-legacy)`. Authorized destructive reset was executed this session (`reset_id=50cd238f913a4c0f72a7fba1bd216bcdfd26969fc0b9ed43576a0f2e33a9c285`, `initialization_kind="destructive-reset"`); current authority is `clean`.
- After reset and `start`, ordinary transactions require 6 transitions (`ordinary-discovery`, `ordinary-evidence`, `ordinary-fix` or `ordinary-no-fix`, `ordinary-validation`, `ordinary-final-verification`) each routing through actor + refuter + validator cycles. A `start` capturing 854+ changed lines, hot-path files (`frontend/src/router.tsx`), or large evidence (`frontend/dist/`) defaults to the `full-4R` route (4 lens reviews in parallel).
- One transaction (`stats-pr-2026-07-11`, `phase=started, revision=0`) was opened this session and intentionally left persisted. It captured the full working tree as the diff because the file inventory at start time included Bracket + `frontend/dist/` + apply-progress. The next session should NOT advance it; instead, after each manual commit lands, the next session opens a fresh lineage id (`gr-pr-<yyyy-mm-dd>` style) with a properly narrowed snapshot limited to one task unit's files.

## Task 4.1 bounded unit: player-selection modal (artboard 25)

- Added the local-only `PlayerSelectionModal` with fixture-driven team rosters, checkbox selection, close behavior, and confirmation action.
- Replaced only the `/admin/matches/setup` placeholder with a minimal route host that opens the modal for `?modal=player-selection`; the artboard 26 forward-only setup flow remains intentionally unimplemented.
- Added SSR tests for modal rendering/closed state and canonical query-driven opening. No network, auth, persistence, or scoring-rule behavior was added.

### Task 4.1 bounded unit verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/PlayerSelectionModal.test.tsx src/features/scoring/MatchSetupPage.test.tsx src/router.test.tsx` | PASS — 3 files, 7 tests |

## Task 4.1 bounded unit: scorer match setup flow (artboard 26)

- Extended the immutable `SCORING.matchSetup` fixture with three setup steps and descriptions.
- Implemented local forward-only step state in `MatchSetupPage`; mounting starts at step one, `Siguiente` advances without a back control, and the final step cannot advance further.
- Preserved the artboard 25 player-selection modal query behavior and unrelated search values; no network, auth, persistence, WebSockets, backend, or scoring-rule behavior was added.
- Added interaction coverage for first-step rendering, forward navigation, remount reset, and existing modal query behavior.

### Task 4.1 scorer match setup verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/MatchSetupPage.test.tsx` (RED) | FAIL — 2 new flow assertions failed before implementation |
| `cd frontend && bun run test -- src/features/scoring/MatchSetupPage.test.tsx src/features/scoring/PlayerSelectionModal.test.tsx src/fixtures/scoring-admin.test.ts` | PASS — 3 files, 11 tests |
| `cd frontend && bun run test -- src/features/scoring/MatchSetupPage.test.tsx src/features/scoring/PlayerSelectionModal.test.tsx src/router.test.tsx` | PASS — 3 files, 12 tests |
| `cd frontend && bun run test` | PASS — 30 files, 99 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && bun run build -- --outDir /tmp/voleytrack-scorer-match-setup-build-final` | PASS — output under `/tmp/voleytrack-scorer-match-setup-build-final` |

## Task 4.2 bounded unit: scorer console (artboard 27)

- Added failing-first SSR and interaction coverage in `frontend/src/features/scoring/ScoringConsolePage.test.tsx` for fixture teams, current set, local score display, point recording, repeated points without volleyball-rule enforcement, and route registration.
- Implemented `frontend/src/features/scoring/ScoringConsolePage.tsx` using immutable `SCORING.console` fixture data and local React state only. The `/admin/matches/$id/scoring` route now renders the page.
- Artboard 28 substitution modal is explicitly out of scope; no modal behavior, persistence, APIs, auth, or real-time behavior was added.

### Task 4.2 scorer console verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/ScoringConsolePage.test.tsx` (RED) | FAIL — module was missing before implementation |
| `cd frontend && bun run test -- src/features/scoring/ScoringConsolePage.test.tsx src/router.test.tsx` | PASS — 2 files, 6 tests |

## Task 4.2 follow-up unit: scorer substitution modal (artboard 28, issue #34)

- Extended only `ScoringConsolePage` and its existing scoring route with the URL-driven `?modal=substitution` artboard variant. The existing artboard 27 score display and repeated local point recording remain unchanged.
- The substitution action copies the current search object and sets `modal: "substitution"`; every close path removes only that key, preserving unrelated query values.
- The modal presents the immutable local home-team/player fixture context from `SCORING.console`, `PUBLIC_TEAMS`, and `PUBLIC_PLAYERS`. Its outgoing/incoming selections use page-local React state only and reset after a remount; no mutation, persistence, API, auth, WebSocket, or volleyball-rule behavior was added.
- Added SSR coverage for the canonical modal query, interaction coverage for query-preserving open/close and local remount reset, route-tree coverage for the scoring route search contract, and real-router URL integration coverage for the canonical substitution URL.
- The shared `Modal` now connects a rendered title to its dialog with `aria-labelledby`; the substitution dialog therefore exposes an accessible name.

### Task 4.2 substitution modal TDD and verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/ScoringConsolePage.test.tsx src/router.test.tsx` (RED) | FAIL — the new accessible-dialog-name assertion found no `aria-labelledby` on the substitution dialog |
| `cd frontend && bun run test -- src/features/scoring/ScoringConsolePage.test.tsx src/router.test.tsx` (GREEN/TRIANGULATE) | PASS — 2 files, 10 tests; covers the canonical query, real-router URL rendering, accessible dialog naming, preserved unrelated query values on open/close, unchanged repeated scoring, and remount reset |
| `cd frontend && bun run test` | PASS — 31 files, 105 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — 1 file, 1 test |
| `cd frontend && bun run build -- --outDir /tmp/voleytrack-scorer-substitution-artboard-28-build` | Not rerun — generated output is outside the authorized edit surfaces |

### Task 4.2 substitution modal boundary

- Changed only the scoring console source/tests, scoring route/test, and these Task 4.2 artifacts (244 changed lines, below the 400-line unit cap).
- Artboards 25–26 and 29–30 remain outside this issue's implementation scope; artboard 27 point scoring is unchanged. Visual comparison of artboard 28 remains pending.

## Task 4.3 bounded unit: point entry flow (artboard 29, issue #36)

- Replaced only the `/admin/matches/$id/point-entry` placeholder with fixture-driven `PointEntryPage`; artboards 25–28 and 30 remain unchanged.
- The page owns local forward-only step state. A valid canonical `?step=point-step-team|point-step-action` selects its matching immutable fixture step on mount; missing or invalid values start at step one. `Siguiente` is disabled on the terminal step. No API, backend, auth, persistence, WebSocket, score mutation, or volleyball-rule behavior was added.
- Added focused SSR, interaction, route-tree, and real-router URL query coverage. RED observed the missing `PointEntryPage` module; GREEN passed after the page and route replacement.

### Task 4.3 verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/PointEntryPage.test.tsx` (RED) | FAIL — `PointEntryPage` module could not be resolved |
| `cd frontend && bun run test -- src/features/scoring/PointEntryPage.test.tsx` (GREEN) | PASS — 1 file, 4 tests |
| `cd frontend && bun run test -- src/features/scoring/PointEntryPage.test.tsx src/router.test.tsx` | PASS — 2 files, 10 tests |
| `cd frontend && bun run test` | PASS — 32 files, 110 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — 1 file, 1 test |
| `cd frontend && bun run build -- --outDir /tmp/voleytrack-scorer-point-entry-artboard-29-build` | PASS |

### Task 4.3 boundary

- Changed only `PointEntryPage`, its focused test, point-entry route/router test coverage, and these Task 4.3 artifacts. Generated build output is under `/tmp`; no commits, staging, push, or PR operations were performed.
- Visual comparison with artboard 29 remains pending.

## Task 4.4 bounded unit: post-match summary (artboard 30, issue #38)

- Replaced only `/admin/matches/$id/summary` with `PostMatchSummaryPage`, selected by the canonical immutable `SCORING.summary.matchId` fixture.
- The display-only page renders the final score, both team names, Finalizado status, and each fixture set row. An unrecognized route ID renders a clear `Partido no encontrado` fallback.
- Focused SSR coverage verifies canonical fixture content and the unknown-match fallback; router coverage verifies component registration and real navigation to the known fixture URL. No mutations, APIs, auth, persistence, WebSockets, or rule enforcement were added.

### Task 4.4 TDD and focused verification

| Command | Result |
| --- | --- |
| `cd frontend && bun run test -- src/features/scoring/PostMatchSummaryPage.test.tsx` (RED) | FAIL — `PostMatchSummaryPage` module could not be resolved |
| `cd frontend && bun run test -- src/features/scoring/PostMatchSummaryPage.test.tsx src/router.test.tsx` (GREEN/TRIANGULATE) | PASS — 2 files, 9 tests |
| `cd frontend && bun run test` | PASS — 33 files, 113 tests |
| `cd frontend && bun run lint` | PASS |
| `cd frontend && ./node_modules/.bin/tsc -b --noEmit --pretty false` | PASS |
| `cd frontend && bun run test src/boundary.test.ts` | PASS — 1 file, 1 test |
| `cd frontend && bun run build -- --outDir /tmp/voleytrack-scorer-post-match-summary-artboard-30-build` | PASS |

### Task 4.4 remaining evidence

- REFACTOR: no refactor was necessary after focused tests passed; the page remains a small presentational fixture lookup.
- Visual comparison with artboard 30 remains pending.
