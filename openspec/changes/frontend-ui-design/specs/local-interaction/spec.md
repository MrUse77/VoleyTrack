# Local Interaction Specification

## Purpose

Define the visual-only local interactions that the application MUST support for navigation, tabs, filters, modals, forms, and multi-step flows. All interactions are mock/static — they demonstrate visual behavior without any backend, persistence, or business-logic integration.

## Requirements

### Requirement: Navigation Interaction

Links, sidebar items, and navigation controls MUST change the active route when clicked, displaying the corresponding screen. Navigation state MUST be reflected visually (active link highlighting, current page indication).

#### Scenario: Sidebar navigation changes screen

- GIVEN the user is on the spectator dashboard
- WHEN they click the "Partidos" sidebar link
- THEN the application navigates to `/matches` and the matches screen is displayed with the sidebar highlighting "Partidos" as active

#### Scenario: Breadcrumb or back navigation

- GIVEN the user is on a tournament detail tab
- WHEN they click a navigation element to return to the tournaments list
- THEN the application navigates to `/tournaments`

### Requirement: Tab Switching

Tab bars within screens MUST switch the visible content area between the represented tab views. Only the active tab's content is visible; the others are hidden. Tab state MUST be visually indicated.

#### Scenario: Tournament detail tabs

- GIVEN the user is on the tournament detail overview tab
- WHEN they click the "Partidos" tab
- THEN the content area switches to show the tournament matches view, and the "Partidos" tab is visually highlighted as active

#### Scenario: Team detail tabs

- GIVEN the user is on the team roster tab
- WHEN they click the "Estadísticas" tab
- THEN the content area switches to show the team statistics view

#### Scenario: Match listing status filter tabs

- GIVEN the user is on the matches page with "Main" view
- WHEN they click the "En Vivo" filter
- THEN the match list updates to show only live matches as represented in the "Live" artboard

### Requirement: Filter Controls

Filter dropdowns, toggle groups, and status selectors MUST update the visible content to reflect the selected filter value. Filter state is local and resets on page reload.

#### Scenario: Tournament status filter

- GIVEN the user is on the tournaments page showing "Todos"
- WHEN they select "En Curso" from the status filter
- THEN the tournament list updates to show only in-progress tournaments as represented in the "En Curso" artboard

#### Scenario: Match status filter

- GIVEN the user is on the matches page
- WHEN they select "Finalizados"
- THEN the match list shows finished matches as represented in the "Finished" artboard

### Requirement: Modal Open/Close

Modals MUST open when their trigger element is activated and close when a close button, backdrop click, or cancel action is performed. Modal content MUST match the canonical `.op` design.

#### Scenario: Player selection modal in match setup

- GIVEN the user is on the match setup screen
- WHEN they click the player-selection trigger
- THEN the "Modal Card" player-selection modal opens, overlaying the match setup content

#### Scenario: Substitution modal in scoring console

- GIVEN the user is on the scoring console
- WHEN they click the substitution trigger
- THEN the "Scoring Console – Substitution Modal" opens showing the substitution interface

#### Scenario: Create team player modal

- GIVEN the user is on the "Crear Equipo" form
- WHEN they click the player addition trigger
- THEN the "Crear Equipo – Modal Jugador" opens

#### Scenario: Assign player modal

- GIVEN the user is in the "Crear Equipo – Modal Jugador" context
- WHEN they trigger player assignment
- THEN the "Crear Equipo – Modal Asignar Jugador" opens

#### Scenario: Modal close via backdrop

- GIVEN a modal is open
- WHEN the user clicks the backdrop/overlay area
- THEN the modal closes and the underlying screen is visible again

### Requirement: Multi-Step Flows

Multi-step flows (such as "CU-21 Anotar Punto Flow") MUST advance through their represented steps using local state. Each step MUST display the visual content shown in the canonical flow artboard. Step progression is forward-only for visual demonstration; the flow resets on reload.

#### Scenario: Point entry flow progression

- GIVEN the user is on the point entry flow screen
- WHEN they complete step 1 ("Select Scoring Team") and advance
- THEN step 2 is displayed with its canonical visual content

#### Scenario: Match setup flow

- GIVEN the user is on the match setup flow
- WHEN they proceed through the represented flow steps
- THEN each step's visual content matches the corresponding section of the "VoleyTrack Admin Match Setup – Flow" artboard

### Requirement: Form Local State

Form controls (text inputs, selects, dropdowns, checkboxes) MUST accept user input and reflect the entered values visually. Form state is local only — no validation against backend, no persistence. Submit buttons MAY show a local success/confirmation state where the design represents one.

#### Scenario: Create player form input

- GIVEN the user is on the "Crear Jugador" form
- WHEN they type into the name, number, and position fields
- THEN the form displays the entered values

#### Scenario: Create tournament form

- GIVEN the user is on the "Crear Torneo" form
- WHEN they fill in the tournament name, format, and dates
- THEN the form displays the entered values

#### Scenario: Form submit shows local success state

- GIVEN the user has filled a creation form
- WHEN they click the submit button
- THEN a local success or confirmation visual state is shown (if the canonical design represents one), without any network request

### Requirement: Scoring Console Interaction

The scoring console MUST support visual interaction for team score selection, point recording display, and substitution initiation. All scoring actions update local display state only.

#### Scenario: Select scoring team

- GIVEN the user is on the scoring console
- WHEN they click a team's score button
- THEN the visual state updates to reflect that team was selected for scoring

#### Scenario: Substitution flow initiation

- GIVEN the user is on the scoring console
- WHEN they trigger a substitution
- THEN the substitution modal opens with the canonical visual content

### Requirement: Interaction Boundary Compliance

No interaction defined in this specification SHALL perform API calls, HTTP requests, WebSocket connections, authentication checks, database operations, or any form of backend communication. All state changes are component-local or route-local and are lost on page reload.

#### Scenario: No network activity during interaction

- GIVEN the application is running with network monitoring active
- WHEN a user navigates, clicks tabs, opens modals, fills forms, or advances flows
- THEN zero network requests are made to any backend endpoint

#### Scenario: State resets on reload

- GIVEN a user has navigated through several screens, opened modals, and filled forms
- WHEN the page is reloaded
- THEN all local interaction state is reset to the initial default state
