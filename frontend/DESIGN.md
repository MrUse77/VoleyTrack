Design System Documentation: VoleyTrack

1. Product Vision
VoleyTrack is a professional web application for managing and following indoor volleyball matches in real time.  
The interface must feel serious, fast, and data-driven, while still being visually clean and premium.
The product has 4 major domains:

- IAM: authentication and user access
- Plantel: teams, players, and roster management
- Encuentros: match creation and live match operation
- Proyecciones: live scoreboard, timeline, and statistics for spectators

---
1. Core Design Principles
Web-first
This is a browser application first.  
Desktop layout is the primary target. Mobile should still work, but it is not the main design driver.
Clarity over decoration
The UI must never feel overloaded.  
Information density is allowed, but it must always remain readable and structured.
Operational speed
Critical flows like live match scoring must minimize clicks, cognitive load, and visual noise.
Consistency
All modules must share:

- typography
- spacing
- color usage
- component behavior
- status patterns

---
1. Visual Direction
The visual style should feel like:

- professional sports software
- modern dashboard
- premium editorial interface
- clean dark theme with strong contrast
Mood
- authoritative
- technical
- calm
- precise
- live and reactive
Avoid
- playful visuals
- excessive gradients
- noisy decorations
- unnecessary borders
- cluttered cards

---
1. Layout System
Global structure
Use a stable application shell:

- top header or app bar
- optional left navigation for desktop
- main content area with clear section hierarchy
Page patterns
Each page should follow one of these patterns:

1. Dashboard overview
2. List + filters + actions
3. Form / editor
4. Live operation screen
5. Read-only live projection
Spacing
Use generous spacing between major blocks.  
Prefer visual separation through surface contrast instead of borders.

---
1. Color Architecture
Base theme
Use a dark professional palette.
Suggested roles

- Background: deep dark neutral
- Surface: slightly lighter dark layer
- Primary: navy / blue tone
- Success: green for live and positive actions
- Danger: red for errors and critical states
- Warning: amber only if needed
Rules
- no pure black backgrounds
- no heavy border grids
- no saturated colors except for status and action emphasis

---
1. Typography
Headings
Use a modern geometric sans-serif with strong presence.
Body
Use a highly readable sans-serif for all forms, tables, and metadata.
Hierarchy

- large titles for sections
- medium titles for cards and modules
- compact labels for form metadata
- small text for auxiliary context only

---
1. Core Components
App shell

- header
- navigation
- page title
- content container
Cards
Use cards for summaries, forms, and compact info blocks.
Tables
Use tables for:
- players
- teams
- planilleros
- match lists
- stats
Rules:
- no harsh dividers
- alternate row tone or subtle surface shifts
- fixed action area on the right
Forms
Use:
- clear labels
- inline validation
- visible primary action
- error states with strong contrast
Chips / badges
Use for:
- live
- active
- finished
- suspended
- selected
- error
Live scoreboard component
This is the hero component for live match views:
- team names
- current set
- score
- sets won
- serve indicator
- live status
Timeline
Show recent actions in chronological order with:
- event type
- player
- team
- timestamp / match context

---
1. Module Experience
IAM
Should feel secure, minimal, and direct.
Screens:

- login
- change password
- create scorer
- scorer list
Plantel
Should feel structured and administrative.
Screens:
- team list
- player list
- create/edit team
- create/edit player
- assign players to team
Encuentros
Should feel operational and fast.
Screens:
- create match
- pre-match setup
- live scoring
- substitutions
- match summary
Proyecciones
Should feel broadcast-like and readable.
Screens:
- live matches list
- live match view
- live stats
- timeline

---
1. Interaction Rules

- primary actions must always be obvious
- destructive actions need confirmation
- live updates must be visually noticeable
- successful operations must provide feedback
- empty states must guide the user, not feel broken

---
1. Do / Don’t
Do

- use tonal layering
- keep layouts spacious
- make live data obvious
- preserve consistent component logic
- favor browser readability
Don’t
- use heavy borders
- overload the UI with decorations
- mix visual styles across modules
- make tables dense without hierarchy
- bury critical actions

---
1. Output Expectations
Generate a complete VoleyTrack web UI from scratch with:

- coherent visual identity
- all 4 modules represented
- desktop-first browser layout
- clean, consistent component system
- ready to evolve into implementation
