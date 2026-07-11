# Shared Components Specification

## Purpose

Define the reusable application shells, layout components, and design tokens that MUST be shared across screens to ensure visual consistency and avoid duplicated markup where the canonical `.op` repeats the same structural elements.

## Requirements

### Requirement: Public Application Shell

The application MUST provide a shared public shell component that includes:

- A left sidebar (248px width, dark background #0b1220) with brand logo, navigation links, and active-state indication
- A main content area that receives route-specific content
- Consistent sidebar styling across all public spectator screens (dashboard, matches, tournaments, tournament detail, team detail, live match, player detail)

#### Scenario: Sidebar consistency across public screens

- GIVEN the public application shell
- WHEN rendered on any public spectator route (dashboard, matches, tournaments, etc.)
- THEN the sidebar has identical structure, branding, dimensions, and visual treatment

#### Scenario: Content area receives route content

- GIVEN the public shell is rendered
- WHEN the active route changes
- THEN only the main content area updates; the sidebar remains stable

### Requirement: Admin Application Shell

The application MUST provide a shared admin shell component that includes:

- A left sidebar (248px width, dark background #0b1220) with admin navigation links
- A main content area for admin route-specific content
- Consistent styling across all scorer/admin screens (match setup, scoring console, staff management, creation forms, management listings)

#### Scenario: Sidebar consistency across admin screens

- GIVEN the admin application shell
- WHEN rendered on any admin route
- THEN the sidebar has identical structure and visual treatment

#### Scenario: Admin shell distinct from public shell where canonical requires it

- GIVEN the canonical design uses different navigation items or branding for admin vs. public
- WHEN comparing admin and public shells
- THEN the navigation items and context-appropriate branding match the canonical design

### Requirement: Sidebar Navigation Component

The sidebar MUST be implemented as a reusable component supporting:

- Brand section (logo + "VoleyTrack" text + role badge)
- Navigation link list with active state
- Icon + text link items
- Visual separator between link groups

#### Scenario: Active link reflects current route

- GIVEN the sidebar is rendered
- WHEN the current route matches a navigation link's target
- THEN that link is visually highlighted as active

### Requirement: Tab Bar Component

A reusable tab bar component MUST be used wherever the canonical design shows tab-based navigation (tournament detail tabs, team detail tabs, match/tournament filter tabs, admin tournament tabs).

#### Scenario: Consistent tab styling

- GIVEN the tab bar component
- WHEN rendered in different contexts (tournament detail, team detail, matches filter)
- THEN the tab bar has consistent visual treatment matching the canonical design

### Requirement: Card Component

A reusable card component MUST be used for match cards, tournament cards, team cards, player cards, metric cards, and other repeated card patterns in the canonical design. The component MUST support:

- Dark surface background (#1e293b or as specified per context)
- Border styling (#334155 or as specified)
- Corner radius (16px or as specified)
- Content slots for text, metrics, badges, and action elements

#### Scenario: Match card reuse

- GIVEN the card component
- WHEN used for match listings on dashboard and matches page
- THEN the visual treatment is consistent across both contexts

#### Scenario: Tournament card reuse

- GIVEN the card component
- WHEN used for tournament listings
- THEN it matches the canonical tournament card visual treatment

### Requirement: Table Component

A reusable table component MUST be used for standings tables, player rosters, match lists in tabular format, and admin management listings. The component MUST support:

- Header row styling
- Data rows with consistent cell padding and alignment
- Sortable column indicators where the canonical design shows them
- Dark theme styling matching the canonical design

#### Scenario: Standings table consistency

- GIVEN the table component
- WHEN rendered for tournament standings and admin listings
- THEN the table structure, cell styling, and header treatment match the canonical design

### Requirement: Modal Component

A reusable modal component MUST be used for all modal overlays (player selection, substitution, player creation, player assignment). The component MUST support:

- Backdrop overlay
- Modal container with dark surface (#1e293b), border (#334155), corner radius (16px)
- Close button or mechanism
- Content slot for modal-specific content

#### Scenario: Modal consistency across contexts

- GIVEN the modal component
- WHEN used for player selection, substitution, or player assignment
- THEN the modal container, backdrop, and close behavior are visually consistent

### Requirement: Form Input Components

Reusable form input components MUST be used across all creation forms and the login/change-password screens. Components MUST include:

- Text input with label, placeholder, border, and dark-theme styling
- Select/dropdown input
- Form group layout (label + input + optional helper text)
- Consistent sizing and spacing matching the canonical design

#### Scenario: Form input consistency

- GIVEN the form input components
- WHEN used in login, change password, create player, create team, create tournament, and create match forms
- THEN the input styling, sizing, and layout are consistent

### Requirement: Button Components

Reusable button components MUST support the visual variants shown in the canonical design:

- Primary button (filled, dark or accent background)
- Ghost/secondary button (outlined or subtle background)
- Icon button
- Button sizes as represented

#### Scenario: Button variant consistency

- GIVEN the button components
- WHEN used across authentication, admin, and public screens
- THEN each variant maintains consistent visual treatment

### Requirement: Design Tokens

The application MUST define a centralized set of design tokens (CSS variables, Tailwind theme extensions, or equivalent) that encode the canonical color palette, typography scale, spacing values, border radii, and shadow values from the `.op` document.

#### Scenario: Token-driven styling

- GIVEN the design tokens are defined
- WHEN any component references a token for color, spacing, or typography
- THEN the resolved value matches the canonical `.op` design

#### Scenario: Token consistency

- GIVEN two components using the same token (e.g., surface background color)
- WHEN rendered side by side
- THEN their visual appearance for that property is identical

### Requirement: Mock Data Fixtures

The application MUST provide centralized, typed mock data fixtures organized by product area:

- Match fixtures (upcoming, live, today, finished)
- Tournament fixtures (todos, en curso, próximos, finalizados)
- Team fixtures with roster data
- Player fixtures with detail data
- Scoring console state fixtures
- Admin listing fixtures

Fixtures MUST contain realistic Spanish content matching the kind and presentation of data shown in the canonical design.

#### Scenario: Fixture reuse across screens

- GIVEN match fixtures are defined
- WHEN the dashboard and matches page both display match data
- THEN they consume the same fixture source with consistent data

#### Scenario: Typed fixtures

- GIVEN the fixture definitions
- WHEN consumed by components
- THEN TypeScript types ensure correct data shape without requiring runtime validation
