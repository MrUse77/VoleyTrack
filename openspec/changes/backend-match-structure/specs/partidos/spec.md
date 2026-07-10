# Partidos (Matches) Specification

## Purpose

Define the package/folder organization and structural boundaries for the `partidos` bounded context under `com.mrusedev.voleytrack.partidos`, using hexagonal architecture layers. This spec covers the **Create match** slice preparation only — no persistence, endpoints, or full lifecycle behavior.

## Requirements

### Requirement: Bounded Context Package Boundary

The system MUST organize all match-related code under a single top-level package `com.mrusedev.voleytrack.partidos`, separate from framework-centric layer packages.

#### Scenario: Root package contains partidos as a single business-first module

- GIVEN the backend root package is `com.mrusedev.voleytrack`
- WHEN a developer navigates the source tree
- THEN a `partidos` package exists as a direct child of the root package
- AND no generic layer packages (`controllers`, `services`, `repositories`) exist as siblings or parents of `partidos`

#### Scenario: Partidos package is the single home for match code

- GIVEN a new class related to match creation, match domain, or match adapters
- WHEN the class is placed in the codebase
- THEN the class package path starts with `com.mrusedev.voleytrack.partidos`

### Requirement: Hexagonal Domain Layer

The system MUST provide a `partidos.domain` sub-package for match domain concepts and invariants.

#### Scenario: Domain package exists and is named for business concepts

- GIVEN the `partidos` package boundary
- WHEN a developer inspects the structure
- THEN a `domain` sub-package exists at `com.mrusedev.voleytrack.partidos.domain`

#### Scenario: Domain layer is free of framework dependencies

- GIVEN the `domain` sub-package
- WHEN the package is reviewed for Spring, persistence, or web annotations
- THEN no Spring Framework, JPA, JDBC, Flyway, or web annotations are required to be present in the domain package for this structural slice

### Requirement: Hexagonal Application Layer with Ports

The system MUST provide a `partidos.application` sub-package with `port.in` and `port.out` sub-packages for use cases and port interfaces.

#### Scenario: Application layer contains port sub-packages

- GIVEN the `partidos` package boundary
- WHEN a developer inspects the structure
- THEN an `application` sub-package exists at `com.mrusedev.voleytrack.partidos.application`
- AND `port.in` and `port.out` sub-packages exist under `application`

#### Scenario: Application layer is reserved for use case orchestration

- GIVEN the `application` sub-package
- WHEN future Create match use case code is added
- THEN the use case entry point class resides in the `application` layer, not in `domain` or `adapter`

### Requirement: Hexagonal Adapter Layer

The system MUST provide a `partidos.adapter` sub-package with `in` and `out` sub-packages for framework and infrastructure adapters.

#### Scenario: Adapter layer contains inbound and outbound sub-packages

- GIVEN the `partidos` package boundary
- WHEN a developer inspects the structure
- THEN an `adapter` sub-package exists at `com.mrusedev.voleytrack.partidos.adapter`
- AND `in` and `out` sub-packages exist under `adapter`

#### Scenario: Adapter layer isolates framework concerns

- GIVEN the `adapter` sub-package
- WHEN future adapter implementations are added (REST controllers, persistence repositories)
- THEN those implementations reside in `adapter.in` or `adapter.out`, not in `domain` or `application`

### Requirement: Skeleton Supports Create Match Slice

The `partidos` package structure MUST be sufficient to host a future Create match use case without requiring persistence or endpoint decisions.

#### Scenario: Create match has a coherent placement location

- GIVEN the `partidos` package structure with `domain`, `application.port.in`, `application.port.out`, `adapter.in`, and `adapter.out`
- WHEN a developer plans where a Create match use case command, port interface, and eventual adapters would live
- THEN each concern maps to exactly one package without ambiguity

### Requirement: No Premature Behavior

The `partidos` structure for this change MUST NOT introduce match business behavior, persistence configuration, REST endpoints, or database migrations.

#### Scenario: No match business logic exists

- GIVEN the initial `partidos` package structure
- WHEN the codebase is inspected for match behavior
- THEN no domain model methods, use case implementations, or business rules for matches are present

#### Scenario: No persistence or endpoint infrastructure exists

- GIVEN the initial `partidos` package structure
- WHEN the codebase is inspected for persistence or web configuration
- THEN no database migration files, JPA entities, JDBC templates, REST controllers, or endpoint mappings are present for matches
