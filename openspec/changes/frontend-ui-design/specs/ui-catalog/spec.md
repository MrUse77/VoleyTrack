# UI Catalog Specification

## Purpose

Define the complete set of canonical artboards that MUST be reachable and visually reviewable in the React application, their route assignments, and the visual fidelity requirements against `frontend/design/voleytrack-webapp-design.op`.

## Requirements

### Requirement: Complete Artboard Coverage

The application MUST provide a reachable route or visual entry point for every non-empty top-level artboard in the canonical `.op` document. The full set of 45 artboards across 15 design pages is:

**Authentication (2):**
1. Login Desktop
2. Cambio Contraseña Desktop

**Spectator Dashboard (1):**
3. VoleyTrack Public Dashboard – Desktop

**Public Matches (5):**
4. VoleyTrack Public Matches – Main
5. VoleyTrack Public Matches – Live
6. VoleyTrack Public Matches – Today
7. VoleyTrack Public Matches – Upcoming
8. VoleyTrack Public Matches – Finished

**Public Tournaments (5):**
9. VoleyTrack Public Tournaments – Main
10. VoleyTrack Public Tournaments – Todos
11. VoleyTrack Public Tournaments – En Curso
12. VoleyTrack Public Tournaments – Próximos
13. VoleyTrack Public Tournaments – Finalizados

**Tournament Detail (5):**
14. VoleyTrack Public Tournament Detail – Desktop (Overview)
15. VoleyTrack Public Tournament Matches – Desktop
16. VoleyTrack Public Tournament Standings – Desktop
17. VoleyTrack Public Tournament Stats – Desktop
18. VoleyTrack Public Tournament Bracket – Desktop

**Team Detail (4):**
19. VoleyTrack Team Detail – Desktop (Overview/Roster)
20. VoleyTrack Team Roster – Desktop
21. VoleyTrack Team Matches – Desktop
22. VoleyTrack Team Stats – Desktop

**Live Match Detail (1):**
23. VoleyTrack Live Match Detail – Desktop

**Player Detail (1):**
24. VoleyTrack Public Player Detail – Desktop

**Scorer – Match Setup (2):**
25. Modal Card (player-selection modal)
26. VoleyTrack Admin Match Setup – Flow

**Scorer – Scoring Console (2):**
27. VoleyTrack Admin Scoring Console – Desktop
28. Scoring Console – Substitution Modal

**Scorer – Point Entry (1):**
29. CU-21 Anotar Punto Flow (multi-step)

**Scorer – Post Match (1):**
30. VoleyTrack Admin Post Match Summary – Desktop

**Admin – Staff Management (5):**
31. Registro Planillero Desktop
32. VoleyTrack Tournament Matches Tab – Desktop
33. VoleyTrack Tournament Standings Tab – Desktop
34. VoleyTrack Tournament Stats Tab – Desktop
35. VoleyTrack UI States Board

**Admin – Creation Forms (6):**
36. Crear Jugador Desktop
37. Crear Equipo Desktop
38. Crear Torneo Desktop
39. Crear Partido Desktop
40. Crear Equipo – Modal Jugador
41. Crear Equipo – Modal Asignar Jugador

**Admin – Management Listings (4):**
42. Admin Torneos Dashboard
43. Admin Partidos Dashboard
44. Admin Equipos Dashboard
45. Admin Jugadores Dashboard

#### Scenario: All artboards are reachable

- GIVEN the application is running locally
- WHEN a reviewer navigates through the route map or uses a dev-only navigation index
- THEN all 45 artboards can be displayed and compared against the corresponding named `.op` artboard

#### Scenario: Canonical duplicated views share one route

- GIVEN two or more `.op` artboards represent the same visual outcome (e.g., legacy `Z.*` pages duplicating newer tournament/team tabs)
- WHEN the implementation consolidates them into one route and component
- THEN the visible canonical outcome is preserved and no non-empty artboard is left unreachable

### Requirement: Route Map

The application MUST define a local route for each distinct screen or modal entry point. Routes MUST be organized by product area:

| Area | Route pattern | Artboards covered |
|------|---------------|-------------------|
| Auth | `/login`, `/change-password` | 1–2 |
| Spectator Dashboard | `/` | 3 |
| Public Matches | `/matches`, `/matches?status=live\|today\|upcoming\|finished` | 4–8 |
| Public Tournaments | `/tournaments`, `/tournaments?status=todos\|en-curso\|proximos\|finalizados` | 9–13 |
| Tournament Detail | `/tournaments/:id`, `/tournaments/:id/matches`, `/tournaments/:id/standings`, `/tournaments/:id/stats`, `/tournaments/:id/bracket` | 14–18 |
| Team Detail | `/teams/:id`, `/teams/:id/roster`, `/teams/:id/matches`, `/teams/:id/stats` | 19–22 |
| Live Match | `/matches/:id/live` | 23 |
| Player Detail | `/players/:id` | 24 |
| Match Setup | `/admin/matches/setup`, player-selection modal | 25–26 |
| Scoring Console | `/admin/matches/:id/scoring`, substitution modal | 27–28 |
| Point Entry | `/admin/matches/:id/point-entry` (multi-step flow) | 29 |
| Post Match | `/admin/matches/:id/summary` | 30 |
| Staff Registration | `/admin/staff/register` | 31 |
| Admin Tournament Tabs | `/admin/tournaments/:id/matches`, `/admin/tournaments/:id/standings`, `/admin/tournaments/:id/stats` | 32–34 |
| UI States | `/admin/ui-states` (dev/review reference) | 35 |
| Create Player | `/admin/players/create` | 36 |
| Create Team | `/admin/teams/create`, modal variants | 37–41 |
| Create Tournament | `/admin/tournaments/create` | 38 |
| Create Match | `/admin/matches/create` | 39 |
| Admin Torneos | `/admin/tournaments` | 42 |
| Admin Partidos | `/admin/matches` | 43 |
| Admin Equipos | `/admin/teams` | 44 |
| Admin Jugadores | `/admin/players` | 45 |

#### Scenario: Every distinct screen has a unique route

- GIVEN the route map is defined
- WHEN a reviewer navigates to any listed route
- THEN the corresponding canonical artboard is displayed

### Requirement: Root Dashboard Entry

The public dashboard MUST render at `/` as its only canonical entry point. `/dashboard` MUST NOT remain as a route, redirect, or duplicate dashboard screen.

#### Scenario: Reviewer opens the public dashboard

- GIVEN the application is running locally
- WHEN a reviewer navigates to `/`
- THEN the public dashboard and its public shell are rendered
- AND `/dashboard` is not available as a canonical route

#### Scenario: Filter-driven artboard variants share a route with query/state

- GIVEN matches page has Main, Live, Today, Upcoming, Finished variants
- WHEN the reviewer navigates to `/matches` and changes the status filter
- THEN the view switches to the corresponding filter variant without requiring a new route

### Requirement: Desktop Visual Fidelity

The application MUST reproduce the canonical `.op` layouts at their represented desktop dimensions (1440×900, 375×812 for mobile, or as specified per artboard). Visual properties MUST match:

- Typography: font families (Inter, Space Grotesk as used), sizes, weights, line heights, letter spacing
- Color palette: background colors (#0b1220, #0f172a, #1e293b), text colors (#f8fafc, #94a3b8), accent colors, border colors
- Spacing: padding, gaps, margins as represented in the `.op` tree
- Layout: sidebar width (248px), content area dimensions, grid/flex arrangements
- Component dimensions: card sizes, button sizes, input heights, modal dimensions
- Border radius, shadows, stroke widths, opacity values

#### Scenario: Side-by-side comparison shows no visual drift

- GIVEN the canonical `.op` artboard rendered at its designed dimensions
- WHEN the implementation is displayed at the same dimensions in the browser
- THEN a reviewer can confirm structural and visual correspondence without subjective reinterpretation

#### Scenario: Spanish product copy is preserved

- GIVEN the canonical design uses Spanish copy (e.g., "Partidos", "Torneos", "Equipos", "Jugadores", "En Curso", "Próximos", "Finalizados")
- WHEN the implementation renders text content
- THEN the Spanish copy matches the canonical design exactly

### Requirement: Artboard-to-Route Traceability

The implementation MUST maintain a documented mapping between each named `.op` artboard and its route or entry point. This mapping MUST be reviewable without inspecting source code.

#### Scenario: Reviewer can verify coverage

- GIVEN the artboard-to-route mapping document
- WHEN a reviewer selects any named `.op` artboard
- THEN they can identify the exact route or interaction needed to view it in the application
