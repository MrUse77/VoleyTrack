# SDD Init — VoleyTrack Frontend

> Persisted: 2026-07-10
> Branch: frontend-redesign
> Artifact store: openspec
> Preflight: execution_mode=interactive, artifact_store=openspec, chained_pr_strategy=auto-forecast, review_budget_lines=400

## Stack Detection

| Attribute | Value |
|-----------|-------|
| Framework | React 19 + TypeScript ~6.0 |
| Build tool | Vite 8.0 |
| Package manager | Bun 1.3.11 |
| CSS Framework | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Component framework | @tanstack/react-router (file-based routing) |
| State / data | @tanstack/react-query (installed, but scoped out of this change) |
| HTTP client | axios (installed, but scoped out of this change) |
| Icons | lucide-react |
| Linting | ESLint 9 + typescript-eslint + react-hooks + react-refresh |
| Test runner | Vitest 4.1 (globals: true, environment: node) |
| Design file | OpenPencil `.op` at `frontend/design/voleytrack-webapp-design.op` |

## Existing Frontend Structure

```
frontend/src/
├── App.tsx                          — Root: <RouterProvider router={router} />
├── main.tsx                         — Entry: createRoot + StrictMode
├── index.css                        — Tailwind v4 import + custom CSS variables (vt-*)
├── router.tsx                       — @tanstack/react-router tree
├── layouts/
│   └── AppShell.tsx                 — Sidebar + <main><Outlet /></main>
├── components/
│   └── Sidebar.tsx                  — Nav links (Dashboard, Matches, Tournaments, Teams, Players) + Sign In
└── pages/
    ├── DashboardPage.tsx            — "Spectator Dashboard" with static match cards
    └── LoginPage.tsx                — Branding panel + login form (static)
```

No tests exist yet (`src/**/*.test.*`, `src/**/*.spec.*` — none found).

## Available Tools (verified)

| Tool | Command | Status |
|------|---------|--------|
| TypeScript check | `bun x tsc -b` | Available |
| Vite dev server | `bun run dev` | Available |
| Build | `bun run build` | Available |
| Test | `bun run test` / `bun x vitest run` | Available |
| Lint | `bun run lint` / `bun x eslint .` | Available |
| Design viewer | `op open frontend/design/voleytrack-webapp-design.op` | Available |

## Design Scope (from `frontend/design/voleytrack-webapp-design.op`)

The canonical OpenPencil design file contains **23 pages** (verified via `op page list`):

| # | Page Name | Notes |
|---|-----------|-------|
| 1 | **0.01 Autenticación** | Login screen (already scaffolded in LoginPage.tsx) |
| 2 | **1.01 Spectator Dashboard** | Public-facing |
| 3 | **1.02 Matches** | Public-facing match listing |
| 4 | **1.03 Tournaments** | Future-scope (excluded from V1) |
| 5 | **1.04 Tournament Detail** | Future-scope (excluded from V1) |
| 6 | **1.05 Team Detail** | Team info page |
| 7 | **1.06 Live Match Detail** | Live match view |
| 8 | **1.07 Player Detail** | Player info page |
| 9 | **2.01 Match Setup** | Pre-match configuration |
| 10 | **2.02 Scoring Console** | Live scoring interface |
| 11 | **2.03 Anotar Punto Flow** | Point-scoring flow |
| 12 | **2.04 Post Match Summary** | Results and stats after match |
| 13 | **3.01 Gestión de Staff** | Staff management listing |
| 14 | **3.02 Formularios de Gestión** | Admin forms (6 children) |
| 15 | **3.03 Listados de Gestión** | Admin listings (4 children) |
| 16 | **Z.07 Public Tournament Matches Tab** | Future-scope (excluded from V1) |
| 17 | **Z.08 Public Tournament Standings Tab** | Future-scope (excluded from V1) |
| 18 | **Z.09 Public Tournament Stats Tab** | Future-scope (excluded from V1) |
| 19 | **Z.10 Public Team Roster Tab** | Future-scope; empty (Moved to 05) |
| 20 | **Z.11 Public Team Matches Tab** | Future-scope; empty (Moved to 05) |
| 21 | **Z.12 Public Team Stats Tab** | Future-scope; empty (Moved to 05) |
| 22 | **Z.18 Public Tournament Bracket** | Future-scope; empty (Moved to 04) |
| 23 | **Z.20 UI States** | Generic patterns: loading, empty, error, edge cases — V1-ready reference |

**V1 implementation boundary** (per `frontend/design/README.md`): Tournament views (1.03, 1.04) and all `Z.*`-prefixed pages **except Z.20** are future-scope exploratory design. The `Z.20 UI States` page remains a generic V1-ready design reference for common UI patterns across all V1 flows.

## Scope Constraint for This Change

**UI-only implementation.** No APIs, network/data integrations, authentication logic, WebSockets, or backend changes. All UI components render with static/mock data. The existing LoginPage and Sidebar serve as reference style.

## Conventions

- Commit style: conventional-commits (from existing project root)
- Review budget: 400 lines (from preflight)
- Chained PR strategy: auto-forecast (let tasks analysis decide)
- Naming: PascalCase for components, camelCase for handlers/utilities
- CSS: Tailwind v4 utility classes + custom `vt-*` theme tokens in `index.css`
- Font: Inter (via Tailwind font-family)
- Color tokens: `vt-background`, `vt-surface`, `vt-panel`, `vt-border`, `vt-text`, `vt-muted`, `vt-accent`, `vt-success`, `vt-danger`
- Test pattern: Vitest with globals, pattern `src/**/*.test.ts` / `src/**/*.test.tsx`

## OpenSpec State

- `openspec/config.yaml` — ✅ Updated with frontend stack info
- `openspec/sdd-init-context.md` — ✅ This file
- Skill registry at `.atl/skill-registry.md` — loaded, 10+ user skills available
- Existing OpenSpec specs (backend-focused): iam-auth, plantel-commands, plantel-queries
