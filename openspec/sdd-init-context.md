# SDD Init — VoleyTrack

> Persisted: 2026-07-08
> Branch: sdd/backend-structure
> Artifact store: openspec (engram unavailable)

## Stack Detection

| Attribute | Value |
|-----------|-------|
| Language | Java 21 (toolchain) |
| Framework | Spring Boot 4.1.0 (WebMVC, Data JDBC, Validation, Flyway) |
| Build | Gradle 9.5.1 (wrapper at backend/gradlew) |
| Database | PostgreSQL 16 via Docker Compose (prod) / H2 (test) |
| Migrations | Flyway (disabled in test profile) |
| Application class | com.mrusedev.voleytrack.VoleytrackApplication |
| Root package | com.mrusedev.voleytrack |
| Frontend | Angular (separate frontend/, not yet wired) |

## Testing Capabilities

| Attribute | Value |
|-----------|-------|
| Test framework | JUnit 5 + AssertJ |
| Spring Boot test starters | data-jdbc-test, flyway-test, validation-test, webmvc-test |
| Test DB | H2 in PostgreSQL compatibility mode |
| Flyway in tests | Disabled |
| Test command | `cd backend && ./gradlew test` (also `make test`) |
| Test profile | `test` (ActiveProfiles) |
| Test status | ✅ PASS (verified) |
| Strict TDD | ✅ ENABLED — tests exist and pass |

## Architecture

- **Pattern**: Hexagonal Architecture (Ports & Adapters) + DDD
- **Bounded Contexts**: usuarios, plantel, partidos, live-stats
- **Reference docs**: `Arquitectura/MapaBoundedContexts-OpcionB.md` and `ContratosEntreModulos-OpcionB.md`
- **Note**: These docs were written for a previous NestJS iteration but the domain model is valid for the Java/Spring version.

## OpenSpec State

- `openspec/config.yaml` — ✅ Created
- `openspec/specs/` — 3 existing specs (iam-auth, plantel-commands, plantel-queries)
- `openspec/changes/archive/` — 1 archived change from NestJS era
- Skill registry at `.atl/skill-registry.md` — loaded, 10 user skills available

## Conventions

- Package: `com.mrusedev.voleytrack`
- Commits: conventional-commits
- Review budget: 400 lines
- Delivery strategy: ask-on-risk
