# Canonical UI Prototype Architecture

Implement the canonical OpenPencil document as a browser-reviewable React prototype, not as an integrated product. The existing Vite + React 19 + TanStack Router scaffold is retained; its placeholder routes and partial shell are replaced incrementally. `frontend/design/voleytrack-webapp-design.op` remains read-only and is the visual authority whenever code and existing styles differ.

## Guardrails

- Scope is `frontend/` only, including its tests and configuration required for the prototype. Do not modify backend files or the `.op` document.
- Use no `fetch`, Axios imports, React Query data fetching, API modules, backend URL/environment configuration, WebSocket/SSE/polling, auth guards, cookies, or browser storage. Do not add or import an HTTP client. `@tanstack/react-query` must not be imported for this prototype. Existing dependency declarations, including Axios, remain untouched; the boundary prohibits application imports and usage, not unrelated dependency cleanup.
- All interaction data is fixture data or React component state. A reload resets component state. A reviewer-supplied URL route/search value is a deep-link selector, not persisted application state.
- Match each canonical desktop artboard at its documented dimensions. At widths below the canonical desktop composition, retain a minimum desktop canvas and permit horizontal overflow; do not add a mobile/tablet layout.
- Preserve canonical Spanish copy exactly. Where an action has no depicted outcome, keep the user on the same screen with no invented confirmation or workflow.

## Component and module boundaries

| Area | Responsibility | Boundaries |
|---|---|---|
| `src/router.tsx` | Explicit TanStack route tree, typed route/search parsing, shell nesting, and canonical deep-link entry points. | Imports pages/layouts only; no fixtures, network, auth, or feature state. |
| `src/layouts/` | `AuthLayout`, `PublicShell`, and `AdminShell`; each owns the canonical outer geometry and supplies an `Outlet`. | Shells do not own page data, modals, or form state. Replace the current generic `AppShell` with distinct public/admin shells only where the artboards differ. |
| `src/components/primitives/` | Token-driven `Button`, `IconButton`, `Card`, `TabBar`, `Modal`, `FormField`/text input/select, `DataTable`, `Badge`, page header, and state-panel primitives. | Presentational and controlled through props; no routing, fixture imports, or product rules. |
| `src/components/navigation/` | `Sidebar` and navigation item/group components with route-derived active styling. | Receives a context-specific navigation model; does not hard-code public/admin page bodies. |
| `src/components/states/` | `LoadingState`, `EmptyState`, `ErrorState`, `OfflineState`, and `SyncState`, plus `StateBoundary` that replaces a supplied content region when an explicit review override is present. | State visuals never infer real connectivity or request status. |
| `src/fixtures/` | Type-only domain display shapes and immutable Spanish fixture records, grouped by `public`, `scoring`, and `admin`. | No services, mutations, random generation, timestamps, storage, or derived standings/scoring rules. Pages can derive a displayed subset by a selected fixture status only. |
| `src/features/public/` | Dashboard, matches, tournaments, tournament/team/player details, and live-match pages, composed from public primitives and fixtures. | Local tabs/filters only; no computation beyond fixture selection. |
| `src/features/scoring/` | Setup, player selection, scoring console, substitution modal, point-entry flow, and post-match summary. | Flow/score display state remains within the page or its immediate children; no volleyball-rule validation. |
| `src/features/admin/` | Staff registration, admin tournament tabs, creation forms/modals, listings, and the UI states board. | Form values are controlled local state; submit has no side effect unless a canonical in-place visual state exists. |
| `src/styles/` and `src/index.css` | Canonical CSS variables/Tailwind v4 theme aliases, global desktop-canvas policy, typography, and reset. | No feature-specific one-off layout values unless measured from that artboard. |

Pages should assemble primitives and feature sections rather than duplicate shell, table, card, tab, modal, or input markup. A component is extracted only when the canonical structure repeats; artboard-specific composition stays in its feature page to avoid a false generic design system.

## Routes and navigation

The root route remains an outlet. Auth routes render outside shells; public and admin branches each render their own stable sidebar shell. The public dashboard renders at `/` as its single canonical entry point. `/dashboard` is removed: it must not redirect to `/` or retain duplicate dashboard markup.

| Branch | Routes and local entry convention |
|---|---|
| Auth | `/login`, `/change-password` |
| Public shell | `/`; `/matches` with optional `?status=live|today|upcoming|finished`; `/tournaments` with optional `?status=todos|en-curso|proximos|finalizados`; detail paths below |
| Tournament detail | `/tournaments/:id`, `/matches`, `/standings`, `/stats`, `/bracket` appended to `:id` |
| Team/detail | `/teams/:id`, `/roster`, `/matches`, `/stats` appended to `:id`; `/matches/:id/live`; `/players/:id` |
| Scoring/admin shell | `/admin/matches/setup`, `/admin/matches/:id/scoring`, `/admin/matches/:id/point-entry`, `/admin/matches/:id/summary`, `/admin/staff/register` |
| Admin management | `/admin/tournaments/:id/matches`, `/standings`, `/stats`; `/admin/ui-states`; `/admin/players/create`; `/admin/teams/create`; `/admin/tournaments/create`; `/admin/matches/create`; `/admin/tournaments`, `/admin/matches`, `/admin/teams`, `/admin/players` |

Use route nesting for visual shell persistence and route paths for distinct detail tabs, exactly as the catalog specifies. `TabBar` receives both the active value and a route/local-state change callback; it must not independently decide navigation. Matches and tournament list filters use local state after initial render. Search values are accepted solely as review deep links to a canonical variant. Modal and flow variants use explicit review search entries: `?modal=player-selection` on setup, `?modal=substitution` on scoring, `?modal=player|assign-player` on create-team, and `?step=<canonical-step>` on point-entry. Triggers use the same local state, so close/cancel/backdrop returns to the underlying route without history or persistence.

## Fixtures and local visual-state mechanics

### Fixture policy

Define immutable, typed records at `src/fixtures/` for matches (upcoming/live/today/finished), tournaments (all/in-progress/upcoming/finished), team/roster, player detail, scoring display, and admin listings. Cross-screen entities use stable fixture IDs so dashboard cards, list rows, and detail paths show the same Spanish record. Fixtures contain the exact kind of labels, scores, dates, badges, and table rows observed in the artboard; they are not a data layer and must not be mutated.

Each page selects a fixture subset from the active local filter. Standings, statistics, bracket contents, and match outcomes are authored fixture views rather than computed from other fixtures. This makes all canonical variants deterministic and prevents accidental domain logic.

### Interaction policy

| Interaction | State owner | Permitted result |
|---|---|---|
| Sidebar/link/breadcrumb | Router + navigation component | Local route change and route-derived active indication. No guard. |
| List filter and in-page tab | Owning page `useState` after an optional deep-link initial value | Swap canonical fixture/content variant and active styling. |
| Detail tab path | Router | Render only the selected canonical tab panel. |
| Modal | Owning feature page `useState` | Open from trigger; close via close control, cancel, or overlay click (`event.target === event.currentTarget`). |
| Forms | Owning page `useState` | Reflect typed/selected values. `onSubmit` prevents navigation/network work; show an in-place result only if the matching artboard depicts it. |
| Point-entry/setup flow | Owning flow page `useState` | Advance forward through only depicted steps; initialize from its first step after reload. |
| Scoring console | Owning scoring page `useState` | Highlight selected team and update only the visible mock score/point display; opening substitution is local. Do not enforce sets, rotations, limits, or outcomes. |
| Shared state override | `StateBoundary` from route search (`state=loading|empty|error|offline|sync`) | Replace the target content area with the canonical state visual. It never observes browser/network status. |

No state crosses a reload through localStorage, sessionStorage, IndexedDB, cookies, or a custom persistence abstraction. Avoid timers, polling, randomness, and current-time-derived fixture values so visual tests stay deterministic.

## Shared visual primitives and tokens

Centralize measured canonical values as semantic CSS variables and expose matching Tailwind v4 theme aliases. Use semantic token names in components, not arbitrary hex classes. The initial token set is verified against the `.op` during implementation and includes the observed canonical values:

| Token family | Canonical values / rule |
|---|---|
| Canvas and surfaces | `canvas #0b1220`, `surface #111a2b`, `panel #0f1726`, plus context-specific raised surface `#1e293b` only where the artboard uses it. |
| Content | `text #f8fafc`, `muted #94a3b8`, and artboard-specific secondary text values. |
| Accent/feedback | `accent #ff8c42`, success `#4caf50`, danger `#f44336`; do not introduce a new semantic color. |
| Borders | Base `#243249`; use `#334155` only in the card/modal/table contexts specified by the artboard. Keep one-pixel inside strokes. |
| Type | Inter with system fallbacks; define Space Grotesk only for artboards that explicitly use it. Do not fetch web fonts or change copy. Preserve each artboard's size, weight, line height, tracking, and casing. |
| Geometry | 8px spacing scale supplemented by measured artboard values; 248px sidebar; 16px cards/modals; 12px inner panels; artboard-specific control heights and shadows. |
| Desktop policy | `min-width: 1440px` for desktop compositions (or the artboard width when different) with horizontal overflow below it. The point-entry flow is its represented 1544px-wide board; it is not responsively recomposed. |

`Modal` supplies the canonical dark backdrop, `#1e293b`/contextual surface, border, 16px radius, focusable close control, and content slot. `DataTable` owns header, row, cell alignment, and optional visual-only sort indicator; it does not sort data. Use Lucide React only for icons actually represented by the `.op`, with accessible labels on icon-only controls; no emoji replacement or icon reinterpretation.

## Artboard-to-implementation traceability

This table is the reviewable mapping required by the catalog. Implementation should also retain the same rows as an exported, non-product `artboardManifest` used by tests/review tooling; it is metadata only and does not create another product screen. `Source` always means the identically named top-level artboard in `frontend/design/voleytrack-webapp-design.op`.

| # | Source artboard | Route or visual entry point |
|---:|---|---|
| 1 | Login Desktop | `/login` |
| 2 | Cambio Contraseña Desktop | `/change-password` |
| 3 | VoleyTrack Public Dashboard – Desktop | `/` |
| 4–8 | VoleyTrack Public Matches – Main, Live, Today, Upcoming, Finished | `/matches`; direct review entries `?status=live`, `today`, `upcoming`, `finished` (Main is no status) |
| 9–13 | VoleyTrack Public Tournaments – Main, Todos, En Curso, Próximos, Finalizados | `/tournaments`; direct review entries `?status=todos`, `en-curso`, `proximos`, `finalizados` (Main is no status) |
| 14 | VoleyTrack Public Tournament Detail – Desktop (Overview) | `/tournaments/:id` |
| 15 | VoleyTrack Public Tournament Matches – Desktop | `/tournaments/:id/matches` |
| 16 | VoleyTrack Public Tournament Standings – Desktop | `/tournaments/:id/standings` |
| 17 | VoleyTrack Public Tournament Stats – Desktop | `/tournaments/:id/stats` |
| 18 | VoleyTrack Public Tournament Bracket – Desktop | `/tournaments/:id/bracket` |
| 19 | VoleyTrack Team Detail – Desktop (Overview/Roster) | `/teams/:id` |
| 20 | VoleyTrack Team Roster – Desktop | `/teams/:id/roster` |
| 21 | VoleyTrack Team Matches – Desktop | `/teams/:id/matches` |
| 22 | VoleyTrack Team Stats – Desktop | `/teams/:id/stats` |
| 23 | VoleyTrack Live Match Detail – Desktop | `/matches/:id/live` |
| 24 | VoleyTrack Public Player Detail – Desktop | `/players/:id` |
| 25 | Modal Card | `/admin/matches/setup?modal=player-selection` or the setup trigger |
| 26 | VoleyTrack Admin Match Setup – Flow | `/admin/matches/setup` and its forward-only local steps |
| 27 | VoleyTrack Admin Scoring Console – Desktop | `/admin/matches/:id/scoring` |
| 28 | Scoring Console – Substitution Modal | `/admin/matches/:id/scoring?modal=substitution` or the scoring trigger |
| 29 | CU-21 Anotar Punto Flow | `/admin/matches/:id/point-entry`; `?step=<canonical-step>` for direct review; trigger advances forward |
| 30 | VoleyTrack Admin Post Match Summary – Desktop | `/admin/matches/:id/summary` |
| 31 | Registro Planillero Desktop | `/admin/staff/register` |
| 32 | VoleyTrack Tournament Matches Tab – Desktop | `/admin/tournaments/:id/matches` |
| 33 | VoleyTrack Tournament Standings Tab – Desktop | `/admin/tournaments/:id/standings` |
| 34 | VoleyTrack Tournament Stats Tab – Desktop | `/admin/tournaments/:id/stats` |
| 35 | VoleyTrack UI States Board | `/admin/ui-states` |
| 36 | Crear Jugador Desktop | `/admin/players/create` |
| 37 | Crear Equipo Desktop | `/admin/teams/create` |
| 38 | Crear Torneo Desktop | `/admin/tournaments/create` |
| 39 | Crear Partido Desktop | `/admin/matches/create` |
| 40 | Crear Equipo – Modal Jugador | `/admin/teams/create?modal=player` or the player-add trigger |
| 41 | Crear Equipo – Modal Asignar Jugador | `/admin/teams/create?modal=assign-player` from the depicted modal context |
| 42 | Admin Torneos Dashboard | `/admin/tournaments` |
| 43 | Admin Partidos Dashboard | `/admin/matches` |
| 44 | Admin Equipos Dashboard | `/admin/teams` |
| 45 | Admin Jugadores Dashboard | `/admin/players` |

During implementation, an artboard comparison checklist records: source page/artboard name, artboard dimensions, route/entry, shell, expected state, and screenshot/test evidence. Empty or moved pages are excluded; repeated non-empty outcomes point to this single canonical route rather than duplicated markup. Known reference geometry includes the 1440×900 UI States Board and the 1544×620 point-entry flow; all remaining dimensions are measured from their source nodes before their slice is coded.

## Test and verification strategy

Strict TDD applies: write the focused failing test before each behavior or shared primitive implementation, make it pass, then refactor without widening scope.

1. **Route and manifest tests:** assert that every row in the 45-artboard manifest has a valid route/entry and that each route renders its named page. Exercise filter deep links, detail tab paths, modal deep links, and point-entry step entries.
2. **Interaction tests:** use deterministic fixture data to verify active sidebar state, tabs/filters swapping content, modal trigger/close/cancel/backdrop behavior, controlled form reflection, flow forward progression, and local scoring selection. Assert state starts at its default on a fresh render.
3. **Shared-state tests:** assert `/admin/ui-states` renders all five canonical panels and `state` overrides replace content on a representative data screen without a request.
4. **Boundary test:** statically scan application source for prohibited imports/references (`axios` imports, `fetch`, HTTP/API modules, `WebSocket`, `EventSource`, storage APIs, auth guards) and inspect the production bundle for those application imports. The test must ignore its own search literals and build-tool/dev-server internals. It must fail when a prohibited application import or network integration is introduced.
5. **Visual regression/review:** at each artboard's documented canvas size, capture a deterministic browser screenshot and compare its shell, geometry, Spanish copy, palette, type, and component state with the named `.op` artboard. Use manual side-by-side sign-off if no approved screenshot baseline harness exists; do not substitute subjective redesign review.
6. **Commands:** from the repository root, run `cd frontend && bun run test`; from `frontend/`, run `bun run lint` and `bun run build`. Build and lint are required before a slice is reviewed; no test may depend on a backend service or network.

## Six-slice implementation sequence

Each slice is a coherent chained review unit with a hard target of **at most 400 changed lines per PR** (additions plus deletions). Write tests first. If measured implementation exceeds the budget, split the slice at the next route/artboard boundary before review; do not mix unrelated areas or waive the limit. Each PR description lists only the artboards in its row and the comparison evidence.

| Slice | Scope and review order | Artboards / evidence |
|---|---|---|
| 1. Foundations and access | Establish canonical tokens, desktop canvas policy, public/admin/auth shells, navigation model, primitives, immutable fixture convention, manifest, boundary test, and login/change-password. | 1–2; shared shell/token comparisons; boundary test. |
| 2. Public discovery | Implement dashboard, matches status variants, tournaments status variants, and public navigation/filter mechanics using shared fixtures. | 3–13; all five match and five tournament entries. |
| 3. Public detail journeys | Implement tournament tabs, team tabs, live match detail, player detail, tables/cards, and detail navigation. | 14–24; each tab path and public detail route. |
| 4. Scorer workflows | Implement match setup/player modal, scoring console/substitution, point-entry steps, and post-match summary with local-only state. | 25–30; modal close paths and forward-only flow evidence. |
| 5. Admin workflows | Implement staff registration, admin tournament tabs, creation forms, create-team modal chain, and management listings. | 31–34 and 36–45; controlled-input and modal evidence. |
| 6. Shared states and fidelity closeout | Implement UI States Board and reusable state override, then perform missing-artboard/route audit and all-slice visual comparison remediation only. | 35 plus final 1–45 manifest and boundary/fidelity audit. |

## Rollout and rollback

The rollout is frontend-local and slice-by-slice: reviewers compare the named routes against the `.op` before the next slice proceeds. There is no feature flag, deployment dependency, data migration, or backend coordination. Roll back by reverting the affected frontend slice; remove only its routes, pages, fixtures, and tests while retaining previously accepted shared foundations. Never alter the canonical design file or compensate with persistence/integration work.

## Design decisions requiring implementation discipline

- The current source says “Figma” in a placeholder and uses a generic shell; neither is canonical. Replace that placeholder implementation rather than retaining its copy or visual assumptions.
- The current global style's Roboto declaration is not canonical for artboards inspected here, which use Inter. Tokens/global styles must be corrected from measured `.op` values before feature styling expands.
- The state board represents visual feedback only. “Offline,” “sync,” and “error” must be deliberately injected review states, never inferred through real network behavior.
