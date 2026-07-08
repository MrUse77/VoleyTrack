# Tasks: Backend Query Endpoints & Module Wiring

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~240 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Foundation — Prisma Schema

- [x] 1.1 Add `birthday DateTime? @db.Date` and `number Int?` to `Player` model in `prisma/schema.prisma`
- [x] 1.2 Run `bunx prisma migrate dev --name add_player_birthday_number`

## Phase 2: Query Ports & Gestores (App Layer)

- [x] 2.1 Add `IListarJugadores`, `IObtenerJugador`, `IListarEquipos`, `IObtenerEquipo`, `IListarJugadoresPorEquipo` to `ports/in/plantel.port.ts`
- [x] 2.2 Create `app/listarJugadores.ts` — `@Injectable()` gestor, `IPlayerRepository.findAll()` → `PlayerResponse[]`, optional `teamId` filter in-memory
- [x] 2.3 Create `app/obtenerJugador.ts` — `@Injectable()` gestor, `IPlayerRepository.findById(id)` → `PlayerResponse | null`
- [x] 2.4 Create `app/listarEquipos.ts` — `@Injectable()` gestor, `ITeamRepository.findAll()` → `TeamResponse[]`
- [x] 2.5 Create `app/obtenerEquipo.ts` — `@Injectable()` gestor, `ITeamRepository.findById(id)` → `TeamResponse | null`
- [x] 2.6 Create `app/listarJugadoresPorEquipo.ts` — `@Injectable()` gestor, `ITeamQueryRepository.getTeamDetails(id)` → extract players → `PlayerResponse[]`
- [x] 2.7 Export new gestores from `app/index.ts`

## Phase 3: Response DTOs

- [x] 3.1 Create `adapters/http/dtos/response/PlayerResponse.dto.ts` — `id`, `name`, `lastname`, `height`, `birthday?`, `number?`
- [x] 3.2 Create `adapters/http/dtos/response/TeamResponse.dto.ts` — `id`, `name`, `nameTrainer?`
- [x] 3.3 Create `adapters/http/dtos/response/index.ts` — barrel export both DTOs

## Phase 4: Repository Injectable & Controller Wiring

- [x] 4.1 Add `@Injectable()` decorator to `adapters/persistance/player.repository.ts`
- [x] 4.2 Add `@Injectable()` decorator to `adapters/persistance/teamQuery.repository.ts`
- [x] 4.3 Add `GET /` and `GET /:id` endpoints to `player.controller.ts` — inject `IListarJugadores` + `IObtenerJugador`; return 404 on null
- [x] 4.4 Add `GET /`, `GET /:id`, `GET /:id/players` to `team.controller.ts` — inject `IListarEquipos` + `IObtenerEquipo` + `IListarJugadoresPorEquipo`; return 404 on null
- [x] 4.5 Wire `PlantelModule`: add `PrismaModule` import, controllers, all providers (repos + 8 command + 5 query gestores) using `{ provide: Token, useClass: Impl }`

## Testing

- [x] 5.1 Unit-test query gestores: mock repository, verify DTO mapping per spec scenario
- [x] 5.2 Integration-test GET endpoints via `app.getHttpServer()` — verify 200 responses and 404 for missing/deleted entities
