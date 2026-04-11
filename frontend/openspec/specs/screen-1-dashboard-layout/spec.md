# screen-1-dashboard-layout Specification

## Purpose

Screen 1 MUST render an HLTV-inspired dark dashboard as a routed Angular page, using local app-owned structure, tokens, and assets only.

## Requirements

### Requirement: Page shell and top strips

The page MUST present a full-width shell with a compact utility strip above a primary header strip. The header MUST expose brand, primary navigation, and right-aligned actions.

#### Scenario: Shell renders on load

- GIVEN the app opens on screen 1
- WHEN the route is activated
- THEN the utility strip and header strip are visible
- AND the layout spans the viewport width

#### Scenario: Small viewport keeps the shell usable

- GIVEN a narrow viewport
- WHEN the page renders
- THEN the top strips remain readable without overlap

### Requirement: Main content composition

The main content MUST include a hero/highlight area, a live match card, upcoming/results lists, and supporting content blocks. The visual hierarchy SHOULD keep the primary match content dominant.

#### Scenario: Core sections are present

- GIVEN the screen loads with mock data
- WHEN the main area is rendered
- THEN the hero, live match, and lists are visible
- AND the primary section is visually emphasized

### Requirement: Right rail behavior

The right rail MUST be a distinct secondary column on desktop and MUST stack below the main column on tablet and mobile. It SHOULD preserve readable spacing and card density in all sizes.

#### Scenario: Desktop shows two columns

- GIVEN a wide viewport
- WHEN the page renders
- THEN the right rail appears alongside the main content

#### Scenario: Mobile stacks the rail

- GIVEN a compact viewport
- WHEN the page renders
- THEN the right rail moves below the main content
- AND no content is clipped

### Requirement: Visual tokens and styling

The screen MUST use local dark-theme tokens for background, surface, border, text, and accent colors. Cards, chips, and separators SHOULD use a consistent spacing and radius scale, and the page MUST NOT depend on CDN-only fonts or images for core layout.

#### Scenario: Styling is token-driven

- GIVEN the screen renders
- WHEN styles are applied
- THEN surfaces and text follow the dark token set
- AND the layout remains stable without remote assets

### Requirement: Accessibility and fallback

The page MUST provide semantic landmarks, logical heading order, visible keyboard focus, and sufficient contrast for key text. If media or data is unavailable, the page MUST render stable fallback content instead of breaking layout.

#### Scenario: Keyboard navigation is usable

- GIVEN a user navigates with keyboard only
- WHEN focus moves through interactive elements
- THEN focus is visible and order is logical

#### Scenario: Missing content degrades gracefully

- GIVEN mock data or images are unavailable
- WHEN the page renders
- THEN placeholders or empty states appear
- AND the layout structure remains intact
