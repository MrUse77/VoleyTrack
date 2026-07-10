# Backend Architecture Specification

## Purpose

Define the overall backend package organization rules and the documentation requirement for future bounded contexts. This spec ensures the backend communicates the business domain through its structure and that future modules are visible without premature implementation.

## Requirements

### Requirement: Business-First Package Organization

The backend MUST organize source code by bounded context first, not by framework layer. Each bounded context owns its own domain, application, and adapter sub-packages.

#### Scenario: Root source tree reflects bounded contexts, not layers

- GIVEN the backend source root `com.mrusedev.voleytrack`
- WHEN a developer inspects the top-level packages
- THEN the visible packages are bounded contexts (e.g., `partidos`), not framework layers (`controllers`, `services`, `repositories`)
- AND the Spring Boot application class remains at the root package

#### Scenario: New bounded context follows the same structural pattern

- GIVEN the established package convention
- WHEN a future bounded context is added (e.g., `usuarios`)
- THEN it follows the same hexagonal sub-package pattern: `domain`, `application.port.in`, `application.port.out`, `adapter.in`, `adapter.out`

### Requirement: Future Bounded Contexts Are Documented

The backend MUST include documentation that names and describes future bounded contexts (`usuarios`, `plantel`, `live-stats`) as planned modules without creating implementation packages for them.

#### Scenario: Architecture documentation lists all bounded contexts

- GIVEN the backend project documentation
- WHEN a developer reads the architecture documentation
- THEN `partidos`, `usuarios`, `plantel`, and `live-stats` are each named with a brief description of their responsibility

#### Scenario: Future contexts have no implementation packages

- GIVEN the backend source tree
- WHEN a developer inspects the packages under `com.mrusedev.voleytrack`
- THEN no `usuarios`, `plantel`, or `live-stats` implementation packages exist in the source tree
- AND these contexts appear only in documentation, not in Java packages

### Requirement: No Broad Empty Module Trees

The backend MUST NOT create empty placeholder packages, marker classes, or `package-info.java` files for bounded contexts that are documented-only.

#### Scenario: No placeholder code for undocumented contexts

- GIVEN that `usuarios`, `plantel`, and `live-stats` are future modules
- WHEN the source tree is inspected
- THEN no empty directories, empty `package-info.java` files, or marker/placeholder classes exist for these contexts
- AND the only Java packages under `com.mrusedev.voleytrack` are the application root and `partidos` (plus its sub-packages)

### Requirement: Root Package Stability

The backend MUST keep all code under the existing root package `com.mrusedev.voleytrack` and MUST NOT rename or relocate the Spring Boot application entry point.

#### Scenario: Application class remains at root

- GIVEN the existing application entry point `com.mrusedev.voleytrack.VoleytrackApplication`
- WHEN the structural changes are applied
- THEN the application class remains at `com.mrusedev.voleytrack.VoleytrackApplication`
- AND the Spring Boot application starts without configuration changes

### Requirement: Review Scope Containment

The total set of new files and documentation changes for this structural slice MUST stay within the 400 changed-line review budget.

#### Scenario: Change fits within review budget

- GIVEN all files added or modified for this change
- WHEN the total changed line count is calculated
- THEN the count is at or under 400 lines
- AND changed lines include new package structures, documentation, and any skeleton files, but exclude unrelated modifications
