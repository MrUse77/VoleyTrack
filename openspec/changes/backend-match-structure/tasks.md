# Tasks: Backend Match Structure

> Change: `backend-match-structure`
> Branch: `sdd/backend-structure`
> Mode: Strict TDD (RED → GREEN → REFACTOR)

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~210–350 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Exact files

### Production files created
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/domain/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/application/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/application/port/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/application/port/in/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/application/port/out/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/adapter/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/adapter/in/package-info.java`
- `backend/src/main/java/com/mrusedev/voleytrack/partidos/adapter/out/package-info.java`
- `backend/ARCHITECTURE.md`

### Test files created
- `backend/src/test/java/com/mrusedev/voleytrack/architecture/BackendPackageArchitectureTest.java`

### Files NOT created (scope guard)
- No `usuarios/`, `plantel/`, `livestats/`, or `live-stats/` Java packages
- No controllers, services, repositories, migrations, endpoints, entities, or use-case source files

---

## Task 1 — RED: Write structural architecture test ✅

**Phase**: RED (strict TDD)
**Depends on**: —

Create `backend/src/test/java/com/mrusedev/voleytrack/architecture/BackendPackageArchitectureTest.java` with JUnit 5 + `java.nio.file.Files` assertions that verify:

1. **Partidos package contracts exist** — every `package-info.java` listed under "Production files created" is a regular file at the expected path relative to `src/main/java/`.
2. **No future-context source packages** — directories `usuarios/`, `plantel/`, `livestats/`, and `live-stats/` do NOT exist under `src/main/java/com/mrusedev/voleytrack/`.
3. **No framework-first root packages** — directories `controllers/`, `services/`, `repositories/` do NOT exist under `src/main/java/com/mrusedev/voleytrack/`.
4. **Architecture doc exists** — `backend/ARCHITECTURE.md` is a regular file.
5. **Architecture doc names bounded contexts** — `ARCHITECTURE.md` content contains `partidos`, `usuarios`, `plantel`, and `live-stats`.
6. **Root application class unchanged** — `VoleytrackApplication.java` remains at `src/main/java/com/mrusedev/voleytrack/VoleytrackApplication.java`.

Use `java.nio.file.Path` and `java.nio.file.Files` (same pattern as `ApplicationPropertiesTests`). Resolve paths relative to the test class or use a fixed project-relative path strategy. Use AssertJ assertions.

**Verify RED**:
```bash
cd backend && ./gradlew test
```
Expected: new test class **compiles** but **all 6 test methods FAIL** because no `partidos` packages or `ARCHITECTURE.md` exist yet.

---

## Task 2 — GREEN: Add partidos package-info contracts ✅

**Phase**: GREEN
**Depends on**: Task 1 (RED test exists and fails)

Create the 9 `package-info.java` files under `backend/src/main/java/com/mrusedev/voleytrack/partidos/`. Each file MUST contain a real package-level Javadoc contract, not an empty placeholder.

| File | Contract summary |
|------|-----------------|
| `partidos/package-info.java` | Bounded context: owns match orchestration and all match-related code. |
| `partidos/domain/package-info.java` | Future match domain model and invariants. No Spring, web, JDBC, JPA, or Flyway dependencies. |
| `partidos/application/package-info.java` | Future use case orchestration. Coordinates domain behavior through ports. |
| `partidos/application/port/package-info.java` | Groups application ports without exposing framework concerns. |
| `partidos/application/port/in/package-info.java` | Future inbound use case ports (e.g. CreateMatchUseCase). Command shape deferred. |
| `partidos/application/port/out/package-info.java` | Future outbound ports for persistence, roster lookup, or event publication. |
| `partidos/adapter/package-info.java` | Framework/infrastructure integration boundary. |
| `partidos/adapter/in/package-info.java` | Future inbound adapters (e.g. REST controllers) when selected by later specs. |
| `partidos/adapter/out/package-info.java` | Future outbound adapters (e.g. JDBC repositories, event publishers) when selected by later specs. |

**Verify GREEN**:
```bash
cd backend && ./gradlew test
```
Expected: tasks 1–3 and 6 pass. Tasks 4–5 still FAIL (ARCHITECTURE.md does not exist yet).

---

## Task 3 — GREEN: Add backend architecture documentation ✅

**Phase**: GREEN
**Depends on**: Task 2 (partidos packages exist)

Create `backend/ARCHITECTURE.md` following cognitive-doc-design patterns: lead with the decision, progressive disclosure, chunked sections.

Content must include:

1. **Outcome-oriented title** and one-paragraph summary.
2. **Bounded contexts table**:

   | Context | Status | Responsibility |
   |---------|--------|----------------|
   | `partidos` | Implemented (package contracts) | Match orchestration, sets, scoring, substitutions, lifecycle. |
   | `usuarios` | Documented only | Identity, access, roles, permissions. |
   | `plantel` | Documented only | Teams, players, rosters, eligibility. |
   | `live-stats` | Documented only | Live scoreboard and read models from future match events. |

3. **Package rules**: organized by bounded context first; no root `controllers`/`services`/`repositories`; no implementation packages for future contexts until a spec selects them; cross-context through ports; root app class stays at `com.mrusedev.voleytrack`.
4. **Future data flow diagram** (text-only, no runtime code).

**Verify GREEN**:
```bash
cd backend && ./gradlew test
```
Expected: **ALL tests pass**, including the structural architecture test.

---

## Task 4 — REFACTOR: Review and verify scope discipline ✅

**Phase**: REFACTOR
**Depends on**: Tasks 1–3 (all GREEN)

1. Run full test suite:
   ```bash
   cd backend && ./gradlew test
   ```
2. Verify no scope creep — confirm that no files were created outside the exact file list above. Check:
   ```bash
   git diff --name-only --cached
   git diff --name-only
   ```
3. Count changed lines:
   ```bash
   git diff --stat HEAD
   ```
   Confirm total ≤ 400 lines.
4. Verify each `package-info.java` contains a non-empty Javadoc contract (not a blank placeholder).
5. Verify `ARCHITECTURE.md` names all four bounded contexts: `partidos`, `usuarios`, `plantel`, `live-stats`.

**Acceptance checklist**:
- [x] `cd backend && ./gradlew test` → all tests pass
- [x] Total changed lines ≤ 400
- [x] No `usuarios/`, `plantel/`, `livestats/`, `live-stats/` Java directories
- [x] No `controllers/`, `services/`, `repositories/` Java directories
- [x] No controllers, use cases, entities, repositories, or migration files created
- [x] `VoleytrackApplication.java` unchanged
- [x] Each `package-info.java` has a real Javadoc contract
- [x] `ARCHITECTURE.md` names all four bounded contexts

---

## Commit plan

Follow work-unit-commits: one commit per reviewable work unit, tests with code.

| Commit | Message | Contents |
|--------|---------|----------|
| 1 | `test(backend): add structural package architecture test` | Task 1 — `BackendPackageArchitectureTest.java` only. Test fails. |
| 2 | `feat(backend): add partidos bounded context package contracts` | Task 2 — 9 `package-info.java` files. Tests for packages 1–3 and 6 pass. |
| 3 | `docs(backend): add architecture documentation for bounded contexts` | Task 3 — `ARCHITECTURE.md`. All tests pass. |

Alternatively, commits 2 and 3 can be squashed into a single commit if the reviewer prefers a smaller commit count. The key invariant is that commit 1 stands alone as the RED test.

---

## Rollback

```bash
git revert HEAD~3..HEAD  # if 3 commits
# or
git revert HEAD~2..HEAD  # if 2 commits
cd backend && ./gradlew test  # verify rollback
```
