# Backend Technical Debt — Verified Limitations

> Snapshotted July 2026 from worktree state (not a known commit).
> Lists only **current** limitations verified against source. Defects already fixed (persistence reconstruction, `@Transactional` wiring) are omitted.
> Items marked **Deferred** are unresolved review findings — the author explicitly chose to document rather than fix them now.

## Quick path

1. Scan the **Category** column to find what matters to your task.
2. Read the **Impact** to assess severity.
3. Use the **Recommendation** as a starting point for the fix.

## Limitations

| # | Category | What | Impact | Recommendation |
|---|----------|------|--------|----------------|
| 1 | Web layer | No REST controllers — `adapter/in/web/` contains only `package-info.java` | Hexagonal architecture has no HTTP entry point. The app compiles but exposes zero endpoints. | Implement `PartidoController` exposing `GestorPartidoPort` use cases as REST endpoints. Add `@RestControllerAdvice` for error handling. |
| 2 | Domain identity | `Equipo` and `Jugador` lack `equals`/`hashCode` overrides — 7 call sites rely on `Equipo.equals` and 2 rely on `Jugador.equals` via `List.contains/remove`, all defaulting to reference identity | Reconstituted entities (different object, same UUID) fail comparison. `Partido.resolverLado()`, `SetPartido.getAlineacion()`, `SetPartido.crearAlineacion()`, and `SetPartido.getCambios()` silently break when called with a deserialized instance. | Override `equals`/`hashCode` on `Equipo` and `Jugador` using their `UUID id`. Validate with a test that creates two instances with the same ID and asserts equality. |
| 3 | Reconstruction | `PartidoRepositoryPortImpl.buscarPorId` passes `null` Equipo to `PartidoMapper.toDomain` when `equipoRepo.buscarPorId()` returns empty | A corrupt or incomplete DB row produces a `Partido` with null Equipo references inside `Lado`, causing NPEs at scoring time. No error is surfaced at load time. | Add null-guards in `PartidoMapper.toDomain` (throw `IllegalStateException` with entity IDs), or make `buscarPorId` return `Optional.empty()` when either equipo is missing. |
| 4 | Observability | No Spring Boot Actuator dependency — `build.gradle` lacks `spring-boot-starter-actuator` | No health endpoint, no readiness/liveness probes, no metrics. An orchestrator (Kubernetes, Docker Compose `depends_on` with healthcheck) cannot tell if the app is running. | Add `spring-boot-starter-actuator` and expose `/actuator/health` and `/actuator/health/readiness`. The docker-compose already healthchecks PostgreSQL — the app should be healthchecked too. |
| 5 | Test DB fidelity | Tests use H2 with `MODE=PostgreSQL`, `spring.flyway.enabled=false`, and DDL from a hand-maintained `schema.sql` copy — not from the Flyway migration `V1__esquema_inicial.sql` | The test schema is manually kept in sync. PostgreSQL ENUM types are replaced with plain `varchar` columns — **no CHECK constraints enforce the domain values at the DB level** in H2. `jsonb` columns and `BIGSERIAL` are absent. Tables (`plantel`, `pizarra_en_vivo`, `timeline`, `usuarios`) not yet exercised by tests are omitted from the H2 schema entirely. | Enable Flyway in the test profile (`spring.flyway.enabled=true`) and point it at the same migration path. Consider a `testcontainers`-based PostgreSQL integration test profile for high-fidelity coverage. At minimum, add a smoke test that runs Flyway migrate + validates schema. |
| 6 | CI/CD | No CI pipeline — no `.github/workflows`, no `Dockerfile` for the app image | Every change must be built and tested manually. No automated gate for PRs. The `docker-compose.yml` only runs PostgreSQL; there is no container definition for the app itself. | Add a GitHub Actions workflow that runs `./gradlew test` on push/PR. Add a multi-stage `Dockerfile` for the Spring Boot app. Wire `docker-compose` to include the app service. |
| 7 | Doc staleness | `ENVIRONMENT.md` line 39 says "Flyway is disabled in the test profile until the first real migration exists" — but `V1__esquema_inicial.sql` already exists | Future contributors may assume Flyway is intentionally disabled and not realize it should be re-enabled. | Update `ENVIRONMENT.md` to reflect current state: Flyway migration V1 exists; note the H2 test gap. |
| 8 | Persistence reload | **Deferred.** `SetSpringDataRepository.findByPartidoId()` returns sets without `ORDER BY`. `Partido.getSetActual()` uses `sets.getLast()`, trusting insertion order. `reconstruirSets()` calls `addAll()` preserving whatever order the DB returns. | If the DB returns sets in arbitrary order (e.g. [3, 1, 2]), `getSetActual()` picks the wrong set. All subsequent scoring — `anotarPunto()`, `confirmarPunto()` — operates on stale/incorrect context. Realistic impact: after a second `buscarPorId` during a match, the app may silently resume scoring on a finished set while the real current set is ignored. | Add `ORDER BY num_set ASC` to `findByPartidoId` (preferred — keeps ordering at the data layer) or sort explicitly in `buscarPorPartido()`. Verify with a test that loads a partido with 3 persisted sets and asserts `getSetActual().getNumeroSet()` matches the highest-numbered set. |
| 9 | Persistence reload | **Deferred.** `SetRepositoryPortImpl.toDomain()` rehydrates `sustituciones` (line 91) via `sustitucionRepo.buscarPorSet()` and `set.restaurarSustituciones()`. The code path exists and is callable but lacks a round-trip integration assertion. | No automated proof that `guardar()` → `buscarPorId()` faithfully restores a `Sustitucion`. A regression (e.g. missing field in `SustitucionMapper`, wrong FK in the entity) silently drops substitution history from reloaded state. Substitutions carry the 6-change limit — losing them would let teams exceed the cap on reload. | Add an integration test: create a `Sustitucion` on a set, save both via `setRepo.guardar()` and `sustitucionRepo.guardar()`, reload via `setRepo.buscarPorId()`, assert the reloaded `SetPartido.getSustituciones()` contains a matching entry. |
| 10 | Transaction boundaries | **Deferred.** `confirmarInicioPartido` is `@Transactional` with persistence outside try-catch (same pattern as `confirmarPunto`). `GestorPartidoTransactionalIntegrationTest` tests `confirmarPunto` rollback but has zero coverage for `confirmarInicioPartido`'s transactional boundary. | The Spring proxy is only tested for `confirmarPunto`. If the `@Transactional` boundary on `confirmarInicioPartido` breaks (e.g. someone wraps persistence in a try-catch), the guardar() calls won't roll back on failure, leaving a half-started match in the DB. Impact is moderate: the code path mirroring is obvious, but the lack of a Spring-container test means future refactors can break atomicy silently. The Mockito unit test (`confirmarInicioPartidoPropagaFalloDePersistencia`) does NOT exercise the Spring proxy — it only verifies the exception propagates, not that the transaction rolls back. | Mirror the existing `confirmarPuntoRollsBackAllStateWhenEventoPersistenceFails` test: start a match, mock a port to throw, call `gestor.confirmarInicioPartido()`, reload from the real DB, and assert state was not partially persisted. |

## Severity summary

| Severity | Items |
|----------|-------|
| **High** (blocks runtime use) | #1 (no REST), #3 (null equipo NPE) |
| **Medium** (silent bugs / data corruption) | #2 (identity semantics), #5 (test fidelity), #8 (unordered set reload) |
| **Low** (operational / doc gaps) | #4 (observability), #6 (CI/CD), #7 (stale docs) |
| **Deferred** (review findings, not yet fixed) | #8, #9, #10 |

## Verification checklist

- [ ] `curl localhost:8080/api/partidos` returns 200 (after #1)
- [ ] `Equipo a = new Equipo(id, "A", null); Equipo b = new Equipo(id, "A", null); assert a.equals(b);` passes (after #2)
- [ ] Loading a Partido whose equipo FK points to a missing row throws a clear error on load, not NPE at score time (after #3)
- [ ] `curl localhost:8080/actuator/health` returns `{"status":"UP"}` (after #4)
- [ ] `SPRING_PROFILES_ACTIVE=test ./gradlew test` runs Flyway V1 and tests pass (after #5)
- [ ] GitHub shows a green CI check on PR (after #6)
- [ ] `ENVIRONMENT.md` no longer claims Flyway is disabled pending first migration (after #7)
- [ ] `findByPartidoId` returns sets ordered by `num_set ASC` (after #8)
- [ ] Integration test proves Sustitucion survives save → load round-trip (after #9)
- [ ] Integration test proves `confirmarInicioPartido` rolls back on persistence failure (after #10)
