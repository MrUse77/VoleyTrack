# Tasks: Frontend UI Design Implementation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | Existing Slice 1 foundation/access plus four public-discovery units; each unit is capped at 400 changed lines |
| 400-line budget risk | High for the overall change; controlled per unit with no size exception |
| Chained PRs recommended | Yes |
| Approved delivery | Stacked sequence; Slice 1 foundation/access is separate from issue #5 public discovery |
| Public-discovery tracker | GitHub issue #5 is the parent tracker only; no child unit may close it |
| Public-discovery sequence | PD-1 Dashboard (artboard 3) → PD-2 Matches (artboards 4–8) → PD-3 Tournaments (artboards 9–13) → PD-4 Integration and artboard 3–13 acceptance audit |
| Unit budgets | PD-1 ≤300, PD-2 ≤360, PD-3 ≤360, PD-4 ≤300 estimated changed lines |
| Distinct issue rule | Each PD unit requires its own future child issue and closes only that child; PRs use `Refs #5`, never `Closes #5` |
| Detailed plan | `openspec/changes/frontend-ui-design/delivery-plan.md` |

Decision needed before apply: No new scope decision; apply only after each unit has its distinct child issue and review boundary.
Chained PRs recommended: Yes
Chain strategy: approved stacked delivery; branch/PR operations are not performed by this planning change.
400-line budget risk: High overall, bounded per unit.

The existing Slice 1 foundation/auth work (tokens, primitives, shells, fixtures, manifest, boundary test, and artboards 1–2) is not issue #5 work. The current public-discovery material remains unaccepted until it is isolated into PD-1 through PD-4. Public detail artboards 14–24 and all scorer/admin/state work require later, distinct tracking.

---

## Slice 1: Foundations and Access (~400 lines)

Establish canonical tokens, desktop canvas policy, public/admin/auth shells, navigation model, primitives, immutable fixture convention, manifest, boundary test, and login/change-password.

### Task 1.1: Design tokens and desktop canvas policy
- [x] **RED**: Write failing test asserting `src/index.css` contains canonical canvas (#0b1220), surface (#111a2b), panel (#0f1726), text (#f8fafc), muted (#94a3b8), accent (#ff8c42), success (#4caf50), danger (#f44336), and border (#243249) CSS variables
- [x] **GREEN**: Implement `src/styles/tokens.css` with semantic CSS variables and `src/index.css` import; set `min-width: 1440px` canvas policy with horizontal overflow below
- [x] **REFACTOR**: Add Tailwind v4 theme aliases mapping to semantic tokens; verify no arbitrary hex classes in components
- [ ] **Evidence**: Test passes; `frontend/bun run build` succeeds; visual inspection confirms dark theme and desktop canvas constraint

### Task 1.2: Shared primitive components
- [x] **RED**: Write failing tests for `Button` (primary/ghost/icon variants), `IconButton`, `Card` (surface #1e293b, border #334155, radius 16px), `TabBar` (controlled active value + callback), `Modal` (backdrop, surface, close control, content slot), `FormField` (label + input + dark theme), `DataTable` (header, rows, optional sort indicator), `Badge`, and `PageHeader`
- [x] **GREEN**: Implement each primitive in `src/components/primitives/` with token-driven styling; no routing, fixtures, or product rules
- [x] **REFACTOR**: Centralize DataTable sort symbols and ARIA values while focused primitive tests remain green
- [ ] **Evidence**: All primitive tests pass; components accept props only; no hardcoded product content

### Task 1.3: Public and admin shells with sidebar
- [x] **RED**: Write failing tests asserting `PublicShell` and `AdminShell` each render a 248px sidebar with brand/logo/role badge, navigation links, and active-state indication; assert `Outlet` receives route content; assert sidebar remains stable on route change
- [x] **GREEN**: Implement `src/layouts/PublicShell.tsx` and `src/layouts/AdminShell.tsx` with `Outlet`; implement `src/components/navigation/Sidebar.tsx` accepting navigation model and route-derived active styling; remove generic `AppShell`
- [x] **REFACTOR**: Keep shells independent and preserve legacy `AppShell` until route migration is complete
- [ ] **Evidence**: Shell tests pass; sidebar highlights active route; public/admin shells use identical structure with context-specific navigation items

### Task 1.4: Fixture convention and immutable mock data
- [x] **RED**: Write failing test asserting `src/fixtures/` exports typed, immutable records for matches (upcoming/live/today/finished), tournaments (all/in-progress/upcoming/finished), teams, players, scoring display, and admin listings; assert Spanish copy matches artboard labels
- [x] **GREEN**: Implement fixture files grouped by `public`, `scoring`, `admin`; use stable IDs across screens; no services, mutations, random generation, timestamps, or storage
- [x] **REFACTOR**: Verify recursive immutability and cross-record stable IDs without derived business rules
- [ ] **Evidence**: Fixture tests pass; no fixture mutation; Spanish labels match canonical artboard labels

### Task 1.5: Artboard manifest and route map
- [x] **RED**: Write failing test asserting every row in the 45-artboard manifest (design.md "Artboard-to-implementation traceability" table) has a valid route/entry; assert each route renders its named page
- [x] **GREEN**: Implement `src/router.tsx` with explicit TanStack route tree for auth (`/login`, `/change-password`), public shell (`/`, `/matches`, `/tournaments`, detail paths), and admin shell (`/admin/*`); use typed route/search parsing; nest routes under shells; create placeholder page components for all 45 artboards. `/dashboard` is removed and is not a redirect or duplicate entry.
- [x] **REFACTOR**: Consolidate unimplemented artboards behind explicit generic placeholders while preserving manifest route and query entries
- [ ] **Evidence**: Manifest test passes; all routes render; deep links work (`?status=`, `?modal=`, `?step=`); no placeholder copy remains

### Task 1.6: Boundary test (no network/auth/persistence)
- [x] **RED**: Write failing boundary test asserting no application source imports `fetch`, `axios`, HTTP/API modules, `WebSocket`, `EventSource`, `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or auth guards; test must ignore its own search literals and build-tool internals
- [x] **GREEN**: Ensure no prohibited imports exist in `src/`; verify test passes
- [x] **REFACTOR**: Centralize deterministic source scanning and exclude only test/scanner literals and build internals
- [ ] **Evidence**: Boundary test passes; `grep -r "fetch\|axios\|WebSocket\|localStorage" src/` returns only test literals

### Task 1.7: Login and change-password screens
- [x] **RED**: Write failing tests for `/login` (artboard 1) and `/change-password` (artboard 2): assert login form accepts credentials, submits without network/auth, and shows local visual state; assert change-password form accepts old/new passwords and submits without network
- [x] **GREEN**: Implement `src/features/auth/LoginPage.tsx` and `src/features/auth/ChangePasswordPage.tsx` using primitives; preserve Spanish copy exactly; `onSubmit` prevents navigation/network; show in-place result only if artboard depicts it
- [x] **REFACTOR**: Centralize repeated local field presentation while preserving the canonical desktop composition
- [ ] **Evidence**: Login and change-password tests pass; visual comparison with artboards 1-2 at canonical dimensions

**Slice 1 PR**: ~400 lines; delivers tokens, primitives, shells, fixtures, manifest, boundary test, and access screens

---

## Slice 2: Public Discovery (~400 lines)

Implement dashboard, matches status variants, tournaments status variants, and public navigation/filter mechanics using shared fixtures.

### Task 2.1: Public dashboard
- [x] **RED**: Write failing test for `/` (artboard 3): assert dashboard renders match cards, tournament cards, and metric cards from fixtures; assert sidebar highlights "Dashboard" as active; assert cards use shared `Card` primitive
- [x] **GREEN**: Implement `src/features/public/DashboardPage.tsx` at `/` composing primitives and fixtures; match artboard layout, typography, and Spanish copy. `/dashboard` is a removed non-goal, not a redirect or duplicate route.
- [x] **Automated evidence**: Dashboard tests pass; fixture-driven cards and active navigation are covered.
- [ ] **Visual evidence**: Compare with artboard 3 at 1440×900

### Task 2.2: Matches page with status filters
- [x] **RED**: Write failing tests for `/matches` (artboards 4-8): assert Main view renders with no `?status`; assert `?status=live` renders live matches (artboard 5), `?status=today` renders today's matches (artboard 6), `?status=upcoming` renders upcoming (artboard 7), `?status=finished` renders finished (artboard 8); assert status filter tabs swap content; assert state resets on reload
- [x] **GREEN**: Implement `src/features/public/MatchesPage.tsx` with `useState` for filter state initialized from optional `?status` search value; use `TabBar` primitive; filter fixtures by status; preserve Spanish copy
- [x] **Automated evidence**: Matches tests pass; all five filter variants and deep links are covered.
- [ ] **Visual evidence**: Compare with artboards 4-8

### Task 2.3: Tournaments page with status filters
- [x] **RED**: Write failing tests for `/tournaments` (artboards 9-13): assert Main view renders with no `?status`; assert `?status=todos` renders all tournaments (artboard 10), `?status=en-curso` renders in-progress (artboard 11), `?status=proximos` renders upcoming (artboard 12), `?status=finalizados` renders finished (artboard 13); assert status filter tabs swap content; assert state resets on reload
- [x] **GREEN**: Implement `src/features/public/TournamentsPage.tsx` with `useState` for filter state initialized from optional `?status` search value; use `TabBar` primitive; filter fixtures by status; preserve Spanish copy
- [x] **Automated evidence**: Tournaments tests pass; all five filter variants and deep links are covered.
- [ ] **Visual evidence**: Compare with artboards 9-13

### Task 2.4: Public navigation mechanics
- [x] **RED**: Write failing tests asserting sidebar navigation changes routes and highlights active link; assert breadcrumb/back navigation works on detail pages; assert clicking match/tournament cards navigates to detail routes
- [x] **GREEN**: Implement navigation handlers in public shell and pages using TanStack Router; no guards or persistence
- [x] **Automated evidence**: Navigation tests pass for delivered dashboard, matches, tournaments, and canonical detail links.
- [ ] **Remaining evidence**: Detail-page breadcrumbs and the complete visual comparison are still pending.

**Slice 2 PR**: ~400 lines; delivers dashboard, matches, tournaments, and public navigation

---

## Slice 3: Public Detail Journeys (~400 lines)

Implement tournament tabs, team tabs, live match detail, player detail, tables/cards, and detail navigation.

### Task 3.1: Tournament detail tabs
- [x] **RED**: Write failing tests for `/tournaments/:id` (artboard 14), `/tournaments/:id/matches` (artboard 15), `/tournaments/:id/standings` (artboard 16), `/tournaments/:id/stats` (artboard 17), `/tournaments/:id/bracket` (artboard 18): assert overview tab renders tournament info, matches tab renders match list, standings tab renders standings table (static fixture, not computed), stats tab renders statistics, bracket tab renders bracket; assert tab bar switches content; assert state resets on reload
- [x] **GREEN**: Implement `src/features/public/TournamentDetailPage.tsx` and the four tab pages with explicit routes; use shared `Card`, `Badge`, `DataTable`, and `PageHeader` primitives; load fixture-driven tournament data by `:id`; preserve Spanish copy
- [x] **Automated evidence**: Tournament detail tests pass; all five tabs render; Stats and Bracket routes are wired through `createRoute`. The current full suite baseline is 25 files and 80 tests; the historical baseline at Task 3.1 completion was 24 files and 76 tests.
- [ ] **Visual evidence**: Compare artboards 14-18 at canonical dimensions; breadcrumb/state-reset evidence remains pending.

### Task 3.2: Team detail tabs
- [x] **RED**: Write failing tests for `/teams/:id` (artboard 19), `/teams/:id/roster` (artboard 20), and `/teams/:id/matches` (artboard 21): assert overview renders team info and roster preview, roster renders ordered roster rows, matches render ordered fixture rows and detail links, route registration is correct, and unknown-team fallbacks render. Artboard 22 has a separate follow-up issue and task.
- [x] **GREEN**: Implemented artboards 19–21 in isolated units: `TeamDetailPage.tsx` at `/teams/$id`, `TeamRosterPage.tsx` at `/teams/$id/roster`, and `TeamMatchesPage.tsx` at `/teams/$id/matches`, using fixture-driven team data, explicit route registration, ordered roster/match joins, and prepared links for future tabs. Artboard 22 remains intentionally isolated as a follow-up unit.
- [x] **Automated evidence**: Team overview, roster, and matches SSR tests plus router registration tests pass; full suite passes with 25 files and 80 tests; lint, TypeScript, build, and boundary checks pass.
- [ ] **Visual/follow-up evidence**: Compare artboards 19–21 at canonical dimensions; implement artboard 22 and its route-specific active state in the next unit.

### Task 3.3: Live match detail
- [x] **RED**: Write failing test for `/matches/:id/live` (artboard 23): assert page renders live match detail with static score, teams, and match state from fixtures; assert no real-time updates or polling; assert state resets on reload
- [x] **GREEN**: Implement `src/features/public/LiveMatchPage.tsx` using primitives; load live match fixture by `:id`; display static score and match state; no WebSocket/polling
- [x] **Automated evidence**: Live match SSR tests and router registration pass. Full suite: 28 files, 90 tests.
- [ ] **Visual evidence**: Compare with artboard 23 at canonical dimensions

### Task 3.4: Player detail
- [x] **RED**: Write failing test for `/players/:id` (artboard 24): assert page renders player detail with stats, bio, and match history from fixtures; assert state resets on reload
- [x] **GREEN**: Implement `src/features/public/PlayerDetailPage.tsx` using primitives; load player fixture by `:id`; preserve Spanish copy
- [x] **Automated evidence**: Player detail SSR tests and router registration pass. Full suite: 28 files, 90 tests.
- [ ] **Visual evidence**: Compare with artboard 24 at canonical dimensions

### Task 3.5: Detail navigation
- [ ] **RED**: Write failing tests asserting tournament detail tabs navigate to correct routes; asserting team detail tabs navigate to correct routes; asserting clicking tournament/team/match/player cards navigates to detail routes
- [ ] **GREEN**: Implement navigation handlers in detail pages; no guards or persistence
- [ ] **Evidence**: Detail navigation tests pass; all detail routes reachable

**Slice 3 PR**: ~400 lines; delivers tournament detail, team detail, live match, player detail, and detail navigation

---

## Slice 4: Scorer Workflows (~400 lines)

Implement match setup/player modal, scoring console/substitution, point-entry steps, and post-match summary with local-only state.

### Task 4.1: Match setup flow
- [x] **RED**: Added failing interaction tests for `/admin/matches/setup` (artboard 26): page renders forward-only steps, clicking "Siguiente" advances, remount resets to the first step, and `?modal=player-selection` opens the player-selection modal (artboard 25)
- [x] **GREEN**: Implemented `src/features/scoring/MatchSetupPage.tsx` with local `useState` flow step, forward-only advancement, fixture-driven step content, and query/local modal opening while preserving unrelated search values
- [x] **Bounded artboard 25 unit**: Implemented the local player-selection modal and wired `?modal=player-selection` to the setup route.
- [ ] **Evidence**: Match setup tests pass; flow advances forward; modal opens; visual comparison with artboards 25-26

### Task 4.2: Scoring console and substitution modal (artboards 27–28)
- [x] **RED (artboard 27)**: Added failing SSR and interaction tests for `/admin/matches/:id/scoring`: fixture teams, current set, score display, point recording, repeated points without volleyball-rule enforcement, and route registration.
- [x] **GREEN (artboard 27)**: Implemented `src/features/scoring/ScoringConsolePage.tsx` with immutable `SCORING.console` data and local `useState` score updates. No sets, rotations, limits, APIs, persistence, auth, or real-time behavior were added.
- [x] **Original boundary (issue #33)**: Artboard 28 was deliberately excluded from the artboard 27 unit.
- [x] **RED/GREEN (issue #34, artboard 28)**: Added then satisfied focused SSR, interaction, route-tree, and real-router URL coverage for `?modal=substitution`, including query-preserving open/close behavior and local selection reset after remount.
- [x] **Accessibility (issue #34)**: The shared `Modal` associates its rendered title with the dialog through `aria-labelledby`, giving the substitution dialog an accessible name.
- [x] **Bounded scope (issue #34)**: The substitution modal uses immutable local team/player fixtures and URL-driven modal state only. It changes no artboard 27 point scoring, volleyball rules, backend/API/auth/persistence/WebSocket behavior, and leaves artboards 25–26 and 29–30 untouched.
- [x] **Automated evidence (issue #34)**: Focused tests (2 files, 10 tests), full frontend tests (31 files, 105 tests), lint, TypeScript, and boundary test pass. Production build was not rerun because generated output is outside the authorized edit surfaces.
- [ ] **Visual evidence**: Compare artboards 27–28 at canonical dimensions.

### Task 4.3: Point entry flow
- [x] **RED**: Added failing tests for `/admin/matches/:id/point-entry` (artboard 29): SSR default step, canonical/invalid `?step` initialization, forward-only interaction, terminal disabled state, and remount reset. Observed failure: `PointEntryPage` module did not exist.
- [x] **GREEN**: Implemented `src/features/scoring/PointEntryPage.tsx` with local `useState` initialized from a valid optional `?step` search value; invalid or absent values initialize step one, `Siguiente` advances only forward, and immutable `SCORING.pointEntry` fixtures provide content. Replaced only the point-entry placeholder route and added route-tree/real-router query coverage.
- [x] **Automated evidence**: Focused tests (2 files, 10 tests), full frontend tests (32 files, 110 tests), lint, TypeScript, boundary test, and Vite production build to `/tmp/voleytrack-scorer-point-entry-artboard-29-build` pass.
- [ ] **Visual evidence**: Compare with artboard 29 at canonical dimensions.

### Task 4.4: Post-match summary
- [x] **RED**: Added a failing SSR test for `/admin/matches/:id/summary` (artboard 30). Observed failure: `PostMatchSummaryPage` module could not be resolved.
- [x] **GREEN**: Implemented `src/features/scoring/PostMatchSummaryPage.tsx` with immutable canonical summary fixtures, primitives, known-match selection by `:id`, and a clear unknown-match fallback; replaced only the summary placeholder route.
- [ ] **Evidence**: Focused SSR and real-router coverage pass; visual comparison with artboard 30 remains pending.

**Slice 4 PR**: ~400 lines; delivers match setup, scoring console, point entry, and post-match summary

---

## Slice 5: Admin Workflows (~400 lines)

Implement staff registration, admin tournament tabs, creation forms, create-team modal chain, and management listings.

### Task 5.1: Staff registration
- [x] **RED**: Added failing SSR/interaction coverage for `/admin/staff/register`; observed failure: `StaffRegisterPage` module could not be resolved before implementation.
- [x] **GREEN**: Implemented `src/features/admin/StaffRegisterPage.tsx` with controlled local `useState`, `FormField`, local-only submit feedback, and canonical Spanish copy; replaced only the staff registration placeholder route.
- [ ] **Evidence**: Focused SSR/interaction and real-route tests pass; full frontend tests, lint, TypeScript, boundary test, and Vite production build pass. Visual comparison with artboard 31 remains pending.

### Task 5.2: Admin tournament tabs
- [x] **RED (artboard 32)**: Added failing SSR coverage for `/admin/tournaments/:id/matches`; observed failure: `AdminTournamentMatchesPage` module could not be resolved before implementation.
- [x] **GREEN (artboard 32)**: Implemented `src/features/admin/AdminTournamentMatchesPage.tsx` with immutable admin fixtures selected by `:id`, Spanish tournament context, fixture-driven match rows, and local admin tab links with Matches active. Replaced only the matches placeholder route.
- [x] **Evidence (artboard 32)**: Focused SSR and real-route coverage pass; full frontend tests, lint, TypeScript, boundary test, and Vite production build pass. Visual comparison remains pending.
- [x] **GREEN (artboard 33)**: Implemented `/admin/tournaments/:id/standings` with a fixture-selected admin tournament context, static standings table, local admin tab navigation with Tabla active, and an explicit unknown-tournament fallback. Added focused SSR and router registration/real-route coverage; no API, auth, persistence, network, or mutation behavior was added.
- [x] **GREEN (artboard 34)**: Implemented `/admin/tournaments/:id/stats` with immutable local rankings, default Puntos state, Puntos/Ataques/Bloqueos local filter interaction, Estadísticas active, and the existing unknown-tournament fallback. Added focused SSR/interaction coverage plus concrete route registration and real-route rendering coverage; no API, auth, persistence, network, or mutation behavior was added.

### Task 5.3: Create player form
- [ ] **RED**: Write failing test for `/admin/players/create` (artboard 36): assert page renders create-player form; assert form accepts input (name, number, position) and reflects typed values; assert submit prevents navigation/network; assert state resets on reload
- [ ] **GREEN**: Implement `src/features/admin/CreatePlayerPage.tsx` with `useState` for form values; use `FormField` primitive; `onSubmit` prevents navigation/network; preserve Spanish copy
- [ ] **Evidence**: Create player test passes; form reflects input; visual comparison with artboard 36

### Task 5.4: Create team form with modal chain
- [ ] **RED**: Write failing tests for `/admin/teams/create` (artboard 37): assert page renders create-team form; assert form accepts input and reflects typed values; assert `?modal=player` opens "Modal Jugador" (artboard 40); assert `?modal=assign-player` opens "Modal Asignar Jugador" (artboard 41); assert modal close returns to underlying route; assert state resets on reload
- [ ] **GREEN**: Implement `src/features/admin/CreateTeamPage.tsx` with `useState` for form values and modal state; use `Modal` primitive; open modals via search values or local triggers; close via close control, cancel, or backdrop (`event.target === event.currentTarget`); preserve Spanish copy
- [ ] **Evidence**: Create team tests pass; modal chain works; visual comparison with artboards 37, 40-41

### Task 5.5: Create tournament form
- [ ] **RED**: Write failing test for `/admin/tournaments/create` (artboard 38): assert page renders create-tournament form; assert form accepts input (name, format, dates) and reflects typed values; assert submit prevents navigation/network; assert state resets on reload
- [ ] **GREEN**: Implement `src/features/admin/CreateTournamentPage.tsx` with `useState` for form values; use `FormField` primitive; `onSubmit` prevents navigation/network; preserve Spanish copy
- [ ] **Evidence**: Create tournament test passes; form reflects input; visual comparison with artboard 38

### Task 5.6: Create match form
- [ ] **RED**: Write failing test for `/admin/matches/create` (artboard 39): assert page renders create-match form; assert form accepts input and reflects typed values; assert submit prevents navigation/network; assert state resets on reload
- [ ] **GREEN**: Implement `src/features/admin/CreateMatchPage.tsx` with `useState` for form values; use `FormField` primitive; `onSubmit` prevents navigation/network; preserve Spanish copy
- [ ] **Evidence**: Create match test passes; form reflects input; visual comparison with artboard 39

### Task 5.7: Admin management listings
- [ ] **RED**: Write failing tests for `/admin/tournaments` (artboard 42), `/admin/matches` (artboard 43), `/admin/teams` (artboard 44), `/admin/players` (artboard 45): assert each page renders management listing with `DataTable`; assert listings use admin fixtures; assert state resets on reload
- [ ] **GREEN**: Implement `src/features/admin/AdminTournamentsPage.tsx`, `AdminMatchesPage.tsx`, `AdminTeamsPage.tsx`, `AdminPlayersPage.tsx` using `DataTable` primitive; load admin listing fixtures; preserve Spanish copy
- [ ] **Evidence**: Admin listing tests pass; all four listings render; visual comparison with artboards 42-45

**Slice 5 PR**: ~400 lines; delivers staff registration, admin tournament tabs, creation forms, create-team modal chain, and management listings

---

## Slice 6: Shared States and Fidelity Closeout (~200 lines)

Implement UI States Board and reusable state override, then perform missing-artboard/route audit and all-slice visual comparison remediation only.

### Task 6.1: State primitives and StateBoundary
- [ ] **RED**: Write failing tests for `LoadingState`, `EmptyState`, `ErrorState`, `OfflineState`, `SyncState` primitives: assert each renders canonical visual treatment from artboard 35; assert `StateBoundary` replaces content area when `state=loading|empty|error|offline|sync` search value is present; assert states never infer real connectivity or request status
- [ ] **GREEN**: Implement state primitives in `src/components/states/`; implement `StateBoundary` that reads `state` search value and replaces content; match artboard 35 visuals
- [ ] **Evidence**: State primitive tests pass; `StateBoundary` replaces content on search value; visual comparison with artboard 35

### Task 6.2: UI States Board
- [ ] **RED**: Write failing test for `/admin/ui-states` (artboard 35): assert page renders all five state panels (loading, empty, error, offline, sync) on a single page; assert layout matches artboard at 1440×900
- [ ] **GREEN**: Implement `src/features/admin/UIStatesBoardPage.tsx` rendering all five state primitives; match artboard 35 layout and Spanish copy
- [ ] **Evidence**: UI States Board test passes; all five states visible; visual comparison with artboard 35 at 1440×900

### Task 6.3: State override on representative screens
- [ ] **RED**: Write failing tests asserting `?state=loading` on `/tournaments` renders loading state; asserting `?state=empty` on `/matches` renders empty state; asserting `?state=error` on `/dashboard` renders error state; asserting states are mock-only (no network requests)
- [ ] **GREEN**: Wrap content areas in representative public pages with `StateBoundary`; ensure override works without network
- [ ] **Evidence**: State override tests pass; states render on search value; no network activity

### Task 6.4: Final manifest and fidelity audit
- [ ] Verify all 45 artboards have valid routes/entries and render correctly
- [ ] Verify all filter deep links (`?status=`, `?modal=`, `?step=`, `?state=`) work
- [ ] Verify all detail tab paths work
- [ ] Verify boundary test passes (no network/auth/persistence)
- [ ] Perform side-by-side visual comparison of each artboard at canonical dimensions
- [ ] Remediate any visual drift from canonical `.op` (do not redesign)
- [ ] **Evidence**: Manifest test passes; all routes/deep links/tabs work; boundary test passes; visual comparison shows no drift

**Slice 6 PR**: ~200 lines; delivers UI States Board, state override, and final audit/remediation

---

## Summary

Total estimated lines: ~2800-3200 across 6 chained PRs

Each slice is a coherent, reviewable unit with clear start, finish, verification, and rollback boundaries. Each PR targets ~400 lines or fewer, protecting reviewer cognitive load.

Delivery decision required before apply: confirm chain strategy (stacked-to-main vs. feature-branch-chain) or request size exception.
