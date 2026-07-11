# Delivery Plan: Frontend UI Design

## Decision

Replace the former two-PR public-discovery proposal with **four independently reviewable stacked work units**, each capped at **400 estimated changed lines** (additions plus deletions). The approved stacked delivery remains in force; this plan changes only the public-discovery slicing and tracking boundaries.

GitHub issue **#5 is the public-discovery parent tracker only**. No issue, pull request, branch, commit, or staging operation was performed while preparing this plan.

## Baseline and scope boundary

The uncommitted Slice 1 foundation/access material is replanned into the independently reviewable F-1 through F-8 units in [foundation-delivery-plan.md](./foundation-delivery-plan.md). PD-1 must begin only after that foundation sequence has been accepted and committed; the public-discovery boundaries below remain unchanged.

### Existing Slice 1: Foundations and Access

Slice 1 is a separate foundation/access delivery boundary and is **not** public-discovery work for issue #5. It covers:

- Canonical tokens and the desktop canvas policy.
- Shared primitives, public/admin/auth shells, and navigation primitives.
- Fixture conventions, the 45-artboard manifest, route scaffolding, and the integration-boundary test.
- Login and change-password artboards 1–2.

The current worktree contains this foundation plus uncommitted public-discovery implementation material for the dashboard, matches, tournaments, and bounded navigation. That material is not treated as accepted until it is isolated into the units below and passes each unit's verification. Visual comparison for artboards 3–13 remains explicit review evidence, not an assumption of completion.

Public detail journeys (artboards 14–24), scorer workflows (25–30), admin workflows (31–45), and shared states remain outside issue #5 and require later distinct work tracking.

## Stacked order

```text
Slice 1 foundation/access (existing baseline)
        |
        v
PD-1 Dashboard (artboard 3)
        |
        v
PD-2 Matches discovery (artboards 4–8)
        |
        v
PD-3 Tournaments discovery (artboards 9–13)
        |
        v
PD-4 Discovery integration and acceptance audit (artboards 3–13)
```

A unit may use only behavior already available from its predecessors. No unit may pull public-detail implementation forward merely to make an outbound link look complete.

## Work units

Every unit below requires a distinct future child issue before implementation. The child issue should reference #5 with `Refs #5` or `Part of #5`; it must not close #5.

### PD-1 — Public dashboard

| Field | Boundary |
|---|---|
| Estimated changed lines | **300 maximum target**; split again before review if the estimate reaches 400 |
| Dependency | Existing Slice 1 foundation/access; no dependency on public-detail implementation |
| Exact artboard and feature scope | **Artboard 3, `VoleyTrack Public Dashboard – Desktop`** at `/`. Implement the canonical public shell composition already supplied by Slice 1, metric cards, live-match card, upcoming-match cards, tournament cards, canonical Spanish copy, fixture-backed values, and only the depicted local links. `/dashboard` remains absent. |
| Verification commands | `cd frontend && bun run test -- src/features/public/DashboardPage.test.tsx src/router.test.tsx`<br>`cd frontend && bun run lint`<br>`cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-pd1-build`<br>Manual: compare `/` with artboard 3 at 1440×900 and record the comparison evidence. |
| Rollback boundary | Revert only the dashboard page, dashboard tests, dashboard-specific fixture additions, and the `/` route binding introduced by PD-1. Retain Slice 1 primitives, shells, manifest, boundary test, auth screens, and placeholders for later artboards. |
| Distinct future issue requirement | Create one child issue titled **Public discovery: dashboard artboard 3**. The PD-1 PR may close that child issue only; it must use `Refs #5`, never `Closes #5`. |

### PD-2 — Public matches discovery

| Field | Boundary |
|---|---|
| Estimated changed lines | **360 maximum target**; status variants and tests must be split at the route/artboard boundary if needed |
| Dependency | Accepted PD-1 plus Slice 1 primitives and public fixtures; no tournament-detail dependency |
| Exact artboard and feature scope | **Artboards 4–8**: `VoleyTrack Public Matches – Main`, `Live`, `Today`, `Upcoming`, and `Finished`. Implement `/matches`, the five local status variants, controlled filter tabs/cards, optional `?status=live|today|upcoming|finished` deep links, deterministic fixture selection, canonical Spanish labels, and links to already-declared match-detail route entries only. Do not implement live-match detail or real-time behavior. |
| Verification commands | `cd frontend && bun run test -- src/features/public/MatchesPage.test.tsx src/router.test.tsx`<br>`cd frontend && bun run lint`<br>`cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-pd2-build`<br>Manual: compare all five status entries with artboards 4–8 at their canonical desktop dimensions; verify reload resets local filter state. |
| Rollback boundary | Revert only the matches page, matches tests, matches-specific fixture additions, and matches route/search wiring introduced by PD-2. Retain PD-1, Slice 1, and all unrelated route placeholders. |
| Distinct future issue requirement | Create one child issue titled **Public discovery: matches artboards 4–8**. The PD-2 PR may close that child issue only; it must reference #5 without closing it. |

### PD-3 — Public tournaments discovery

| Field | Boundary |
|---|---|
| Estimated changed lines | **360 maximum target**; split fixture, filter, and artboard work before review if the estimate reaches 400 |
| Dependency | Accepted PD-2, the Slice 1 shared primitives/fixture convention, and no public-detail implementation |
| Exact artboard and feature scope | **Artboards 9–13**: `VoleyTrack Public Tournaments – Main`, `Todos`, `En Curso`, `Próximos`, and `Finalizados`. Implement `/tournaments`, the four status variants plus the main view, controlled filter tabs/cards, optional `?status=todos|en-curso|proximos|finalizados` deep links, deterministic tournament fixture selection, canonical Spanish labels, and links to already-declared tournament-detail route entries only. Do not implement tournament detail tabs. |
| Verification commands | `cd frontend && bun run test -- src/features/public/TournamentsPage.test.tsx src/router.test.tsx`<br>`cd frontend && bun run lint`<br>`cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-pd3-build`<br>Manual: compare all five status entries with artboards 9–13 at their canonical desktop dimensions; verify reload resets local filter state. |
| Rollback boundary | Revert only the tournaments page, tournaments tests, tournament-specific fixture additions, and tournaments route/search wiring introduced by PD-3. Retain PD-1, PD-2, Slice 1, and the public-detail placeholders. |
| Distinct future issue requirement | Create one child issue titled **Public discovery: tournaments artboards 9–13**. The PD-3 PR may close that child issue only; it must reference #5 without closing it. |

### PD-4 — Public-discovery integration and acceptance audit

| Field | Boundary |
|---|---|
| Estimated changed lines | **300 maximum target**; this is an integration/audit unit, not a place to add new product screens |
| Dependency | Accepted PD-1, PD-2, and PD-3, plus the Slice 1 route/manifest and shell foundation |
| Exact artboard and feature scope | **Artboards 3–13 only**, without adding a new artboard. Verify and complete public sidebar active styling, dashboard-to-list links, list-to-declared-detail links, filter deep-link parity, route/manifest traceability, deterministic local-state reset behavior, and the review checklist/evidence for all dashboard, matches, and tournaments entries. Public detail page bodies remain out of scope. |
| Verification commands | `cd frontend && bun run test -- src/features/public/DashboardPage.test.tsx src/features/public/MatchesPage.test.tsx src/features/public/TournamentsPage.test.tsx src/router.test.tsx src/artboardManifest.test.ts`<br>`cd frontend && bun run lint`<br>`cd frontend && ./node_modules/.bin/vite build --outDir /tmp/voleytrack-pd4-build`<br>Manual: perform the complete artboard 3–13 side-by-side audit, exercise every `?status` entry, verify all outbound route targets, and confirm no network/auth/persistence behavior. |
| Rollback boundary | Revert only cross-page link, active-navigation, route-parity test, and acceptance-evidence changes introduced by PD-4. Retain the independently reviewable dashboard, matches, tournaments, and Slice 1 implementations. Any feature drift found in a prior unit is returned to that unit's child issue rather than folded into PD-4. |
| Distinct future issue requirement | Create one child issue titled **Public discovery: integration and artboard 3–13 acceptance audit**. The PD-4 PR may close that child issue only; it must reference #5 without closing it. |

## Tracker and closure protocol

- Keep **#5 open as the parent tracker** until PD-1 through PD-4 are accepted.
- Each unit gets a different child issue. A PR references both its child issue and #5, but uses a closing keyword only for its own child issue.
- Never put `Closes #5`, `Fixes #5`, or `Resolves #5` in more than one PR. The parent tracker is closed once, by a final maintainer action or one explicitly designated final integration PR after PD-4; the other PRs must use non-closing references.
- A child issue is not closed by a later unit, and a rollback does not close or reopen unrelated tracker issues automatically.
- Do not create, edit, comment on, or close any issue or PR as part of this planning change.

## Review gate for every unit

Before a unit advances, confirm its diff is at or below 400 changed lines, its named artboards are visually compared, its focused tests/lint/build pass, and its rollback leaves all earlier accepted units intact. If any unit exceeds the cap, split it at the listed artboard boundary; do not use a size exception for this public-discovery work.

## Next step

Use [foundation-delivery-plan.md](./foundation-delivery-plan.md) to isolate and accept F-1 through F-8, then use this plan to execute PD-1 through PD-4 from the committed foundation. After PD-4, plan public detail artboards 14–24 under a new tracker/child-issue boundary rather than extending issue #5.
