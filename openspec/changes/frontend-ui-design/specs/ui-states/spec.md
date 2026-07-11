# UI States Specification

## Purpose

Define the shared visual states (loading, empty, error, offline, synchronization) that MUST be explicitly reviewable in the application, as represented in the "VoleyTrack UI States Board" artboard (page 3.01, line 67279) of the canonical `.op` document.

## Requirements

### Requirement: Loading State

The application MUST provide a loading state visual that matches the canonical design. The loading state MUST be applicable to any screen or content area that would normally display data.

#### Scenario: Loading state is reviewable

- GIVEN a dev/review control or route parameter that forces the loading state
- WHEN activated on any data-displaying screen
- THEN the loading visual from the UI States Board is displayed in place of content

#### Scenario: Loading state uses canonical visual treatment

- GIVEN the loading state from the `.op` UI States Board
- WHEN rendered
- THEN its visual treatment (skeleton, spinner, or placeholder as designed) matches the canonical artboard exactly

### Requirement: Empty State

The application MUST provide an empty state visual that matches the canonical design. The empty state MUST be applicable when a list or data area has no items to display.

#### Scenario: Empty state is reviewable

- GIVEN a dev/review control or route parameter that forces the empty state
- WHEN activated on any list or data screen
- THEN the empty state visual from the UI States Board is displayed

#### Scenario: Empty state uses canonical visual treatment

- GIVEN the empty state from the `.op` UI States Board
- WHEN rendered
- THEN its illustration, text, and layout match the canonical artboard exactly

### Requirement: Error State

The application MUST provide an error state visual that matches the canonical design. The error state MUST be applicable when a data-fetching operation would normally fail.

#### Scenario: Error state is reviewable

- GIVEN a dev/review control or route parameter that forces the error state
- WHEN activated on any data-displaying screen
- THEN the error state visual from the UI States Board is displayed

#### Scenario: Error state uses canonical visual treatment

- GIVEN the error state from the `.op` UI States Board
- WHEN rendered
- THEN its visual treatment matches the canonical artboard exactly

### Requirement: Offline State

The application MUST provide an offline state visual that matches the canonical design. The offline state indicates the application has no connectivity.

#### Scenario: Offline state is reviewable

- GIVEN a dev/review control or route parameter that forces the offline state
- WHEN activated
- THEN the offline state visual from the UI States Board is displayed

#### Scenario: Offline state uses canonical visual treatment

- GIVEN the offline state from the `.op` UI States Board
- WHEN rendered
- THEN its visual treatment matches the canonical artboard exactly

### Requirement: Synchronization State

The application MUST provide a synchronization state visual that matches the canonical design. The synchronization state indicates data is being synced or updated.

#### Scenario: Sync state is reviewable

- GIVEN a dev/review control or route parameter that forces the sync state
- WHEN activated
- THEN the synchronization state visual from the UI States Board is displayed

#### Scenario: Sync state uses canonical visual treatment

- GIVEN the synchronization state from the `.op` UI States Board
- WHEN rendered
- THEN its visual treatment matches the canonical artboard exactly

### Requirement: UI States Board Route

The application MUST provide a dedicated route (e.g., `/admin/ui-states`) that displays all shared UI states together on a single page, matching the "VoleyTrack UI States Board" artboard. This serves as a review reference for design reviewers.

#### Scenario: All states visible on one page

- GIVEN the reviewer navigates to the UI States route
- WHEN the page loads
- THEN all five states (loading, empty, error, offline, synchronization) are visible and match the canonical UI States Board artboard

### Requirement: State Injection Mechanism

The application MUST provide a mechanism (dev-only route parameter, query string, context toggle, or equivalent) to force any screen into any of the five shared states without requiring actual backend failure or network conditions.

#### Scenario: State override on arbitrary screen

- GIVEN the state injection mechanism is active
- WHEN a reviewer forces the "error" state on the tournaments page
- THEN the tournaments page displays the error state visual in its content area

#### Scenario: States are mock-only

- GIVEN the state injection mechanism
- WHEN any state is forced
- THEN no actual network requests, backend calls, or persistence operations occur
