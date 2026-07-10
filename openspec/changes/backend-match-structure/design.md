# Design: Minimal Backend Match Structure

This change establishes the first Java backend package boundary for `partidos` using hexagonal architecture, without adding match behavior, persistence, REST endpoints, migrations, or placeholder implementations for future contexts.

## Quick path

1. Add documented Java packages only for the real first context: `partidos`.
2. Document future contexts in backend architecture documentation, not Java packages.
3. Prove the structure with strict TDD structural tests and `cd backend && ./gradlew test`.

## Decisions

| Topic | Decision |
|-------|----------|
| First implemented bounded context | `partidos` only. |
| Future contexts | `usuarios`, `plantel`, and `live-stats` are documentation-only in this slice. |
| Java package materialization | Use `package-info.java` files for `partidos` package contracts instead of empty directories or marker classes. |
| Create Match skeleton | Do not add `CreateMatchUseCase`, `CreateMatchCommand`, handlers, entities, adapters, repositories, or controllers yet. Document the future placement only. |
| Architecture documentation | Add backend-level architecture documentation that names bounded contexts and package rules. |
| Verification | Add structural JUnit tests first, then production package docs/docs to satisfy them. |

## Minimal file structure

The implementation should add exactly the following production Java package-contract files under the existing root package `com.mrusedev.voleytrack`:

```text
backend/src/main/java/com/mrusedev/voleytrack/
  VoleytrackApplication.java                    # existing, unchanged
  partidos/
    package-info.java                           # bounded context contract
    domain/
      package-info.java                         # match domain concepts and invariants
    application/
      package-info.java                         # use case orchestration contract
      port/
        package-info.java                       # application port grouping contract
        in/
          package-info.java                     # future inbound use case ports, e.g. CreateMatchUseCase
        out/
          package-info.java                     # future outbound ports
    adapter/
      package-info.java                         # framework/infrastructure adapter contract
      in/
        package-info.java                       # future inbound adapters, e.g. REST later if selected
      out/
        package-info.java                       # future outbound adapters, e.g. persistence later if selected
```

Documentation and tests:

```text
backend/ARCHITECTURE.md
backend/src/test/java/com/mrusedev/voleytrack/architecture/BackendPackageArchitectureTest.java
```

No Java source directory or package should be created for:

```text
usuarios/
plantel/
live-stats/
livestats/
```

`live-stats` remains a product/context name in documentation only. A Java package spelling can be decided when that context becomes real.

## Package contracts

Each `package-info.java` must contain a real package-level contract, not an empty placeholder. Keep comments short and reviewable.

| Package | Contract |
|---------|----------|
| `com.mrusedev.voleytrack.partidos` | Owns match orchestration and all match-related code. |
| `partidos.domain` | Future match domain model and invariants; no Spring, web, JDBC, JPA, or Flyway dependencies. |
| `partidos.application` | Future use case orchestration; coordinates domain behavior and ports. |
| `partidos.application.port` | Groups application ports without exposing framework concerns. |
| `partidos.application.port.in` | Future inbound use case interfaces such as `CreateMatchUseCase`; command shape deferred. |
| `partidos.application.port.out` | Future outbound dependencies such as persistence, roster lookup, or event publication ports. |
| `partidos.adapter` | Future framework/infrastructure integration boundary. |
| `partidos.adapter.in` | Future inbound adapters only when selected by later specs, such as REST controllers. |
| `partidos.adapter.out` | Future outbound adapters only when selected by later specs, such as JDBC repositories or event publishers. |

## Create Match placement decision

The first structural slice should include package contract documentation only, not Java port/command names as source files.

Reasoning:

- The specs require a coherent location for Create Match, not a public API yet.
- A `CreateMatchCommand` would prematurely decide required fields before product rules are specified.
- A `CreateMatchUseCase` interface would be behavior-adjacent and could invite implementation before acceptance criteria exist.
- Package contracts still make the future placement explicit:
  - command/input model: `partidos.application.port.in`
  - use case port: `partidos.application.port.in`
  - orchestration implementation: `partidos.application`
  - domain model/invariants: `partidos.domain`
  - REST or messaging inbound adapter: `partidos.adapter.in`
  - persistence/event/roster outbound adapter: `partidos.adapter.out`

## Backend architecture documentation

Add `backend/ARCHITECTURE.md` as the review-facing source for backend package rules.

It should include:

| Context | Status in this slice | Responsibility |
|---------|----------------------|----------------|
| `partidos` | Implemented as package contracts only | Match orchestration, future sets, scoring, substitutions, and match lifecycle. |
| `usuarios` | Documented only | Identity, access, roles, and permissions. |
| `plantel` | Documented only | Teams, players, rosters, and eligibility data. |
| `live-stats` | Documented only | Live scoreboard/read models fed by future match events. |

The document should also state these rules:

- Organize backend code by bounded context first, not by framework layers.
- Do not create root-level `controllers`, `services`, or `repositories` packages.
- Do not create implementation packages for future contexts until a spec selects them.
- Cross-context integration should happen through ports/contracts, not direct table access.
- Keep `com.mrusedev.voleytrack.VoleytrackApplication` at the root package.

## Runtime and data flow

This slice has no runtime data flow because it introduces no executable match behavior.

The intended future flow is documented only:

```text
adapter.in -> application.port.in -> application use case -> domain
                                         |
                                         v
                                  application.port.out -> adapter.out
```

Future cross-context flow remains documentation-only:

```text
usuarios -> authorization context for protected actions
plantel -> roster/eligibility data consumed by partidos through a port
partidos -> future match events consumed by live-stats projections
```

## Structural tests

Use strict TDD. Add failing tests before adding the package docs and architecture documentation.

`BackendPackageArchitectureTest` should verify:

1. `partidos` package contract files exist for the exact package paths listed above.
2. `usuarios`, `plantel`, and `livestats` source packages do not exist under `src/main/java/com/mrusedev/voleytrack`.
3. Root-level framework-first packages do not exist: `controllers`, `services`, `repositories`.
4. `backend/ARCHITECTURE.md` exists and names `partidos`, `usuarios`, `plantel`, and `live-stats`.
5. The existing root application class remains in `com.mrusedev.voleytrack`.

Do not add ArchUnit unless later tasks justify the dependency. Plain JUnit 5 plus `java.nio.file.Files` is enough for this slice.

## Verification strategy

Run:

```bash
cd backend && ./gradlew test
```

Expected result:

- Existing Spring context test still passes.
- New structural architecture test passes.
- No Docker/PostgreSQL is required because tests use the existing H2/test profile setup.

## Review workload forecast

| Area | Expected changed lines |
|------|------------------------|
| `package-info.java` files | ~60-100 |
| `backend/ARCHITECTURE.md` | ~70-120 |
| Structural JUnit test | ~80-130 |
| Total forecast | ~210-350 |

Chained PRs recommended: No.

400-line budget risk: Low.

Decision needed before apply: No.

## Rollout

1. Add the structural test first and confirm it fails for missing package contracts/documentation.
2. Add `partidos` package-info files and `backend/ARCHITECTURE.md`.
3. Re-run `cd backend && ./gradlew test`.
4. Review the diff for scope discipline: no controllers, services, repositories, migrations, REST endpoints, persistence, or future-context Java packages.

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Package docs become empty placeholders | Medium | Require each `package-info.java` to state a specific contract. |
| Create Match API gets designed too early | Medium | Defer `CreateMatchUseCase` and `CreateMatchCommand` source files to a later behavior spec. |
| Future contexts appear implemented | Medium | Document them only in `backend/ARCHITECTURE.md`; add structural tests preventing source packages. |
| Review budget overrun | Low | Keep docs concise and avoid new dependencies. |
| Test brittleness from exact paths | Low | Limit exact-path assertions to the intentionally stable package contract files. |
