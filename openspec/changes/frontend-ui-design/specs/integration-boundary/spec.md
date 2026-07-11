# Integration Boundary Specification

## Purpose

Define the strict, immutable exclusions that govern this change. These are non-negotiable constraints: the application MUST NOT perform any form of backend integration, data persistence, authentication enforcement, or real-time communication. This specification exists to prevent scope creep into areas explicitly excluded by the proposal.

## Requirements

### Requirement: No API or HTTP Integration

The application MUST NOT contain any HTTP client configuration, API service modules, fetch/axios calls, REST endpoint definitions, or network request logic. No module in the frontend SHALL import or reference any backend URL, API key, or HTTP utility for data fetching.

#### Scenario: No HTTP client in dependency graph

- GIVEN the frontend application's dependency tree
- WHEN inspected for HTTP client libraries or custom API modules
- THEN no HTTP client is configured for data fetching (only build-tool and dev-server HTTP is permitted)

#### Scenario: No API service files

- GIVEN the frontend source directory
- WHEN searched for files containing fetch(), axios, or API endpoint constants
- THEN no such files exist in the application source

### Requirement: No Authentication or Authorization Implementation

The application MUST NOT implement credential validation, session management, token storage, authentication guards, role-based access control, or security policy enforcement. Login and change-password screens are visual-only; submitting them does not validate credentials or create sessions.

#### Scenario: Login form does not authenticate

- GIVEN the user is on the login screen
- WHEN they enter any credentials and click "Sign In"
- THEN no credential validation occurs; the form MAY navigate to a post-login screen as a visual demonstration, but no session is created

#### Scenario: No auth guards on routes

- GIVEN the application's route definitions
- WHEN any route is accessed directly
- THEN no authentication check blocks or redirects the user

### Requirement: No WebSocket or Real-Time Communication

The application MUST NOT contain WebSocket connections, Server-Sent Events, polling intervals, or any real-time data transport mechanism. The scoring console and live match detail display static/mock data only.

#### Scenario: No WebSocket connections

- GIVEN the application is running
- WHEN network activity is monitored
- THEN no WebSocket connections are opened

#### Scenario: Live match detail is static

- GIVEN the user is viewing the live match detail screen
- WHEN they observe the displayed score and match state
- THEN the data is static mock data that does not update in real time

### Requirement: No Backend Modifications

The application MUST NOT modify, create, or reference any backend source files, configuration, database schema, migration, or service. All changes are contained within the frontend directory and its associated test/configuration files.

#### Scenario: Backend directory unchanged

- GIVEN the initial state of the `backend/` directory
- WHEN the frontend UI change is implemented
- THEN no files in `backend/` are added, modified, or deleted

#### Scenario: No backend configuration references

- GIVEN the frontend application configuration
- WHEN inspected for backend URLs, service discovery, or environment variables pointing to backend services
- THEN none exist

### Requirement: No Persistence

The application MUST NOT use localStorage, sessionStorage, IndexedDB, cookies, or any other browser persistence mechanism to store application data, form submissions, or interaction state. All state is component-local and lost on page reload.

#### Scenario: No persisted state across reloads

- GIVEN a user has filled forms, navigated screens, and changed filter state
- WHEN the page is reloaded
- THEN all state returns to its initial default; no data persists

#### Scenario: No localStorage usage

- GIVEN the frontend source code
- WHEN searched for localStorage, sessionStorage, or IndexedDB usage
- THEN no such usage exists in application code

### Requirement: No Invented Product Behavior

The application MUST NOT implement screens, user flows, business rules, copy, or visual treatments that are not represented in the canonical `.op` document. When the design does not depict a destination or post-submit state, local actions SHALL remain visual-only on the same screen.

#### Scenario: No invented screens

- GIVEN the complete set of 45 canonical artboards
- WHEN the application's route map is reviewed
- THEN every route maps to a canonical artboard; no additional product screens exist

#### Scenario: No invented confirmation flows

- GIVEN a form where the canonical design shows only the form itself without a confirmation screen
- WHEN the user submits the form
- THEN no invented confirmation page or success route is displayed; at most, a local inline visual state is shown

### Requirement: No Mobile or Tablet Redesign

The application MUST NOT create new mobile or tablet layouts where the canonical document provides desktop artboards only. Desktop fidelity at the represented canvas dimensions is required. Smaller viewports MAY show overflow/scroll behavior but MUST NOT justify redesigning the desktop UI.

#### Scenario: Desktop-only fidelity

- GIVEN the canonical artboards are desktop designs (1440px width)
- WHEN the application is viewed at that width
- THEN the layout matches the canonical design

#### Scenario: Narrow viewport does not redesign

- GIVEN the application is viewed at a viewport narrower than 1440px
- WHEN the layout is observed
- THEN the desktop composition is preserved with horizontal overflow or scaling, not a new responsive redesign

### Requirement: No Domain-Rule Enforcement

The application MUST NOT enforce business rules, domain validations, or data constraints beyond what is visually implied by the canonical design. Form fields do not validate against domain rules. Scoring actions do not enforce match rules. Tournament standings are not computed.

#### Scenario: No computed standings

- GIVEN the tournament standings screen
- WHEN displayed
- THEN the standings data is static fixture data, not computed from match results

#### Scenario: No scoring rule enforcement

- GIVEN the scoring console
- WHEN a scorer records points
- THEN no match rules (set completion, rotation, substitution limits) are enforced

### Requirement: Boundary Enforcement in Tests

The application's test suite MUST include at least one test that verifies the integration boundary is maintained. This test SHALL confirm that no API client, WebSocket, authentication guard, or persistence mechanism is present in the application bundle.

#### Scenario: Boundary test passes

- GIVEN the integration boundary test
- WHEN executed
- THEN it confirms no HTTP client, auth guard, WebSocket, or persistence API is imported in the application source

#### Scenario: Boundary violation fails the test

- GIVEN the integration boundary test exists
- WHEN a developer accidentally introduces an API call or auth guard
- THEN the boundary test fails, alerting the team to the scope violation
