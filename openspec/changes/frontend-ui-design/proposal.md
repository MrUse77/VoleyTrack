# Proposal: Implement the Canonical Frontend UI Design

Bring the complete, non-empty UI represented in `frontend/design/voleytrack-webapp-design.op` into the existing React frontend. The OpenPencil document is the sole canonical source for layout, visual hierarchy, copy, colors, spacing, states, and screen composition; implementation must not reinterpret or modernize it.

## Intent

VoleyTrack has an existing React frontend scaffold, while its full product UI is captured in a large OpenPencil document rather than faithfully implemented in the application. This change closes that gap so stakeholders can navigate and review the designed product experience in the browser before backend integrations and persistent business behavior are introduced.

The resulting frontend will be an interactive local prototype: navigation, tabs, modals, and forms can change routes or visible local state, but all content and outcomes remain mock/static.

## Canonical Source and Product Coverage

Direct inspection of `frontend/design/voleytrack-webapp-design.op` found 23 named design pages and 45 non-empty top-level artboards. The represented product areas include:

| Product area | Represented UI |
|---|---|
| Access | Login and change-password screens |
| Public discovery | Spectator dashboard; match lists and status filters; tournament lists and status filters |
| Public detail | Tournament overview, matches, standings, statistics, and bracket; team overview, roster, matches, and statistics; live match detail; player detail |
| Scorer workflow | Match setup, player-selection modal, scoring console, substitution modal, point-entry flow, and post-match summary |
| Administration | Scorer/staff registration; create-player, create-team, create-tournament, and create-match forms; player-assignment modals; tournament, match, team, and player listings |
| Shared states | Loading, empty, error, offline, and synchronization states |

Pages marked as moved or repeated in the design document should be reconciled into shared routes/components where they represent the same visual outcome. Every non-empty canonical artboard and state must remain reviewable; duplicated design structures do not require duplicated application implementations.

## Scope

### In Scope

- Implement every non-empty screen, tab, modal, flow step, and shared state represented in the canonical `.op` document.
- Match the canonical desktop layouts, typography, color palette, borders, spacing, visual hierarchy, content, and component states as faithfully as practical in React and Tailwind CSS.
- Add local routes and navigation paths needed to reach the represented screens.
- Add visual local state for links, filters, tabs, modal open/close behavior, multi-step flows, and forms.
- Use mock/static data matching the kind and presentation of data shown in the design.
- Reuse shared application shells and components where the `.op` repeats the same header, sidebar, tables, cards, controls, or detail structures.
- Preserve Spanish product copy where it appears in the canonical design.
- Keep all changes inside the frontend and its frontend tests/configuration as required by later specs and tasks.

### Interaction Boundary

Interactions demonstrate visual behavior only:

- Navigation may change local routes.
- Tabs and filters may switch between mock views.
- Buttons may open or close modals and advance local flow steps.
- Form controls may accept input and show local visual states.
- Submit actions may show a local success, confirmation, or next-screen state where the design represents one.
- Reloading the application may reset all mock state.

### Non-Goals

- APIs, HTTP requests, network clients, or any other data integration.
- Authentication or authorization implementation, credential validation, sessions, or security policy enforcement.
- WebSockets, server-sent events, polling, or real-time score transport.
- Backend source, backend configuration, database, or migration changes.
- Persistent business logic, browser persistence, durable form submission, or domain-rule enforcement.
- Inventing screens, copy, behaviors, or visual improvements not represented in the `.op` document.
- Mobile or tablet redesigns where the canonical document provides desktop artboards only.
- Treating mock UI states as production-complete business workflows.

## Product Rules and Decisions

| Topic | Decision |
|---|---|
| Source of truth | `frontend/design/voleytrack-webapp-design.op` overrides existing frontend visuals and assumptions for this change |
| Fidelity | Preserve canonical UI decisions, including unusual or repeated details, unless technically impossible in the browser |
| Data | Static fixtures and component-local state only |
| Navigation | All meaningful canonical screens and states must be reachable without backend services |
| Reuse | Repeated artboards should share components while preserving each canonical visual outcome |
| Responsiveness | Desktop fidelity at the represented canvas dimensions is required; smaller viewports must not justify redesigning the canonical desktop UI |
| Existing behavior | No backend-connected or persistent behavior is introduced or implied |

## Proposal Question Round

These questions are intended to improve the downstream PRD/spec by exposing product implications, edge cases, and tradeoffs. They do not block this proposal, but should be reviewed before implementation planning:

1. For repeated or legacy `Z.*` design pages that duplicate newer tournament/team tabs, is one shared implementation reachable through the current product route sufficient as long as the visible canonical outcome is preserved?
2. When the `.op` does not depict a destination or post-submit state, should local actions remain visual-only on the same screen rather than inventing confirmation behavior?
3. Should desktop-only artboards use a minimum-width/overflow treatment on narrow screens, or should later specs define a basic adaptive layout that preserves the desktop composition without adding a new mobile design?
4. Which review order provides the most product value: public spectator journeys first, or scorer/admin operational journeys first?

### Current Assumptions Requiring Review

- Non-empty artboards are required; empty pages explicitly marked as moved are organizational markers rather than additional screens.
- Canonically duplicated views can share one implementation and route destination.
- Missing interaction outcomes will not be invented; controls may update only the local state directly implied by the design.
- Desktop visual fidelity takes priority over unrepresented responsive behavior.
- Public UI foundations should be delivered first because their repeated shell and components reduce risk for later slices.

## Affected Areas

| Area | Expected impact |
|---|---|
| `frontend/design/voleytrack-webapp-design.op` | Read-only canonical reference; must remain unchanged |
| `frontend/src/` | Routes, pages, shared shells, feature components, local mock data, and visual state |
| `frontend/src/**/*.test.ts(x)` | Focused tests for routing and important local interaction/state behavior |
| Frontend styling/configuration | Reusable design tokens and shared styling needed to reproduce the `.op` |
| `backend/` | No changes permitted |
| `openspec/changes/frontend-ui-design/` | Planning artifacts for this change |

## Acceptance Outcomes

- [ ] Every non-empty top-level artboard in the canonical `.op` can be reached and visually reviewed in the React application, including modal/flow/state variants.
- [ ] Public dashboard, matches, tournaments, tournament detail tabs, team detail tabs, live match detail, and player detail match their represented canonical outcomes.
- [ ] Match setup, scoring, substitution, point-entry, and post-match screens can be exercised as local visual flows with mock data.
- [ ] Administrative registration, creation forms, assignment modals, and management listings can be exercised locally with mock data.
- [ ] Loading, empty, error, offline, and synchronization states are explicitly reviewable.
- [ ] Repeated headers, sidebars, controls, tables, cards, and tab systems are implemented consistently through reusable frontend components where possible.
- [ ] Links, tabs, modals, filters, and forms provide the local visual state changes implied by the design.
- [ ] The implementation performs no API, HTTP, WebSocket, authentication, persistence, or backend work.
- [ ] The canonical `.op` file and all backend/application source outside the scoped frontend implementation remain unchanged.
- [ ] Reviewers can compare each delivered slice directly against named `.op` artboards without reconstructing intended behavior.

## Review Workload and Delivery Slicing

This is substantially larger than the repository's 400 changed-line review budget. A single PR would create unacceptable visual-review load and make regressions difficult to isolate.

**Chained PRs recommended: Yes.** Downstream tasks should define independently reviewable slices, each with a direct `.op` comparison checklist. A likely sequence is:

1. Shared visual foundations, application shells, route map, and fixture conventions.
2. Access and public dashboard/match discovery.
3. Tournament and team detail journeys, live match detail, and player detail.
4. Match setup and scoring-console flows.
5. Administrative forms, modals, and management listings.
6. Shared loading/empty/error/offline/sync states plus final cross-screen fidelity pass.

Exact boundaries may be adjusted in the tasks phase to keep each PR coherent and reviewable. Each slice should avoid mixing unrelated visual areas merely to reduce PR count.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scope and review fatigue across 45 artboards | High | High | Use chained, product-area slices with named artboard checklists |
| Visual drift from the canonical `.op` | High | High | Compare implementation directly with the source at represented desktop dimensions; do not redesign |
| Duplicated markup from repeated shells and tabs | Medium | High | Establish shared shells/components before feature slices |
| Ambiguity from repeated, moved, or legacy design pages | Medium | Medium | Preserve all non-empty outcomes while consolidating equivalent implementations |
| Mock interactions being mistaken for production behavior | Medium | High | Keep fixtures/local state explicit and enforce strict integration non-goals |
| Invented behavior where designs show only static states | Medium | Medium | Implement only directly implied local transitions and document unresolved outcomes |
| Desktop designs degrading on narrow viewports | Medium | Medium | Preserve desktop fidelity and define a non-redesign overflow/adaptation policy in specs |
| Large fixture sets becoming inconsistent | Medium | Medium | Centralize typed mock fixtures by product area without creating persistent domain services |

## Rollback

Rollback is frontend-only and slice-based:

1. Revert the affected frontend delivery slice or the entire chained change.
2. Remove routes/components/fixtures introduced only by that slice.
3. Restore the previous frontend entry points and styles.
4. Leave `frontend/design/voleytrack-webapp-design.op` and all backend files untouched.

No data migration, backend rollback, or cleanup of persistent state is required because this change introduces no persistence or integrations.

## Success Criteria

- The browser provides a coherent, navigable local representation of the full canonical VoleyTrack design.
- Product and design reviewers can validate all represented UI areas and edge states without running backend services.
- Visual fidelity is traceable to named `.op` pages/artboards rather than subjective reinterpretation.
- Local interactions communicate the intended journeys while remaining clearly mock/static.
- Delivery remains reviewable through focused slices rather than one oversized PR.
- The next SDD phases can define detailed screen coverage and architecture without expanding into APIs, authentication, WebSockets, backend changes, or persistent business logic.
