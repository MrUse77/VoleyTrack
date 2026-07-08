# Proposal: Backend Query Endpoints, Module Wiring & SDD Documentation

## Intent

The Plantel module has command endpoints (POST/PUT/DELETE) but no query endpoints (GET). The frontend cannot list teams, players, or roster data. Additionally, NestJS DI is broken: `PlantelModule` is empty, repositories lack `@Injectable()`, and the Prisma `Player` model is missing `birthday` and `number` fields that the domain entity expects. This change closes those gaps and documents the existing backend in SDD artifacts.

## Scope

### In Scope
- Add GET endpoints to `PlayerController` and `TeamController`
- Create query gestores: `ListarJugadores`, `ObtenerJugador`, `ListarEquipos`, `ObtenerEquipo`, `ListarJugadoresPorEquipo`
- Wire `PlantelModule` with providers and controllers
- Add missing `@Injectable()` decorators to `PlayerRepository` and `TeamQueryRepository`
- Align Prisma `Player` model with domain (`birthday`, `number`)
- Create SDD specs and design artifacts for the backend

### Out of Scope
- New command use cases or auth changes
- Frontend implementation
- Proyecciones / Encuentros modules

## Capabilities

### New Capabilities
- `plantel-queries`: Query gestores and GET endpoints for players, teams, and roster listing

### Modified Capabilities
- None (existing commands remain unchanged)

## Approach

Follow the established command pattern: thin controllers delegate to GRASP query gestores, which call repository ports. Add `@Injectable()` to repository adapters, register all providers in `PlantelModule`, and update the Prisma schema with a migration. Generate SDD specs from the existing CU documentation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/plantel/controllers/player.controller.ts` | Modified | Add GET `/players`, GET `/players/:id` |
| `src/plantel/controllers/team.controller.ts` | Modified | Add GET `/teams`, GET `/teams/:id`, GET `/teams/:id/players` |
| `src/plantel/application/queries/` | New | Query gestores (Listar*, Obtener*) |
| `src/plantel/plantel.module.ts` | Modified | Register controllers, gestores, repositories |
| `src/plantel/infrastructure/repositories/` | Modified | Add `@Injectable()` decorators |
| `prisma/schema.prisma` | Modified | Add `birthday` and `number` to `Player` |
| `openspec/specs/` | New | SDD specs for Plantel queries |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Module wiring breaks existing commands | Low | Wire incrementally; verify existing e2e tests still pass |
| Prisma migration conflict | Low | Run `prisma migrate dev` in isolated branch; review diff before merge |

## Rollback Plan

1. Revert the commit(s) adding queries and module wiring.
2. If Prisma migration was applied, create a down-migration to remove `birthday`/`number`.
3. Restart the backend container; existing commands continue working because they were untouched.

## Dependencies

- Existing Prisma schema and PostgreSQL instance

## Success Criteria

- [ ] `GET /players` returns a list; `GET /players/:id` returns a single player
- [ ] `GET /teams` and `GET /teams/:id` work; `GET /teams/:id/players` returns roster
- [ ] `PlantelModule` compiles and all endpoints are reachable via `curl`
- [ ] `PlayerRepository` and `TeamQueryRepository` are injectable without runtime errors
- [ ] Prisma schema matches domain `Player` entity; migration succeeds
- [ ] SDD spec files exist under `openspec/specs/plantel-queries/`
