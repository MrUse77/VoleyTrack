# Design: Plantel Queries & Module Wiring

## Technical Approach

Add 5 read-only query gestores following the IAM gestor pattern (`@Injectable()` class → abstract input port → repository port). Wire the empty `PlantelModule` as a proper NestJS module mirroring `IamModule`'s `{ provide: Token, useClass: Impl }` style. Fix missing `@Injectable()` on two repository adapters. Add `birthday` and `number` fields to the Prisma `Player` model with a migration.

## Architecture Decisions

### Decision: Input Port Pattern

**Choice**: Abstract classes in `ports/in/plantel.port.ts` (e.g., `IListarJugadores`)
**Alternatives**: Separate `plantel-queries.port.ts` file
**Rationale**: Matches existing command ports (`ICrearJugador`, `IEliminarJugador`) and IAM ports (`IRegistrarAdmin`). Single file per bounded context is simpler.

### Decision: Response DTOs vs Domain Entities

**Choice**: Return plain DTOs (`PlayerResponse`, `TeamResponse`) from query gestores
**Alternatives**: Return domain entities, or raw Prisma output
**Rationale**: Queries are projections. Domain entities add ceremony with no value for reads. New `dtos/response/` subdirectory separates concerns from command request DTOs.

### Decision: Team-based Player Filtering

**Choice**: `ListarJugadores` calls `findAll()` and filters in-memory when `teamId` is provided; `ListarJugadoresPorEquipo` uses `getTeamDetails(id)` which already includes players via Prisma relation
**Alternatives**: Add `findByTeamId` to `IPlayerRepository`
**Rationale**: Avoids changing existing port contracts. Volumes are small enough for in-memory filtering.

## Component Design

### Input Ports (append to `plantel.port.ts`)

```typescript
export abstract class IListarJugadores {
  abstract execute(teamId?: string): Promise<PlayerResponse[]>;
}
export abstract class IObtenerJugador {
  abstract execute(id: string): Promise<PlayerResponse | null>;
}
export abstract class IListarEquipos {
  abstract execute(): Promise<TeamResponse[]>;
}
export abstract class IObtenerEquipo {
  abstract execute(id: string): Promise<TeamResponse | null>;
}
export abstract class IListarJugadoresPorEquipo {
  abstract execute(id: string): Promise<PlayerResponse[]>;
}
```

### Query Gestores

New files in `app/`, camelCase convention matching existing `crearJugador.ts`:

| Gestor (File) | Port Token | Injects | Key Logic |
|---|---|---|---|
| `listarJugadores.ts` | `IListarJugadores` | `IPlayerRepository` | `findAll()` → DTO map; filter by teamId in-memory |
| `obtenerJugador.ts` | `IObtenerJugador` | `IPlayerRepository` | `findById(id)` → DTO or null |
| `listarEquipos.ts` | `IListarEquipos` | `ITeamRepository` | `findAll()` → DTO map |
| `obtenerEquipo.ts` | `IObtenerEquipo` | `ITeamRepository` | `findById(id)` → DTO or null |
| `listarJugadoresPorEquipo.ts` | `IListarJugadoresPorEquipo` | `ITeamQueryRepository` | `getTeamDetails(id)` → extract players → DTO |

Each gestor is `@Injectable()`, has a single `execute()` method, and returns DTOs — never domain entities.

### Response DTOs

New dir `adapters/http/dtos/response/`:

```typescript
// PlayerResponse.dto.ts
export class PlayerResponse {
  id: string; name: string; lastname: string;
  height: number; birthday?: Date; number?: number;
}
// TeamResponse.dto.ts
export class TeamResponse {
  id: string; name: string; nameTrainer?: string;
}
```

### Controller Endpoints

**PlayerController**: inject `IListarJugadores` + `IObtenerJugador`; add `@Get()` (list, optional `teamId` query) and `@Get(':id')` (detail, 404 on null).

**TeamController**: inject `IListarEquipos` + `IObtenerEquipo` + `IListarJugadoresPorEquipo`; add `@Get()`, `@Get(':id')`, `@Get(':id/players')`. Controllers throw `HttpException(404)` when gestor returns null.

## Data Flow

```
GET /players/:id
 → PlayerController.obtener(id)
  → IObtenerJugador.execute(id)
   → IPlayerRepository.findById(id) → Prisma findUnique
    → raw row → PlayerResponse DTO
 → return DTO | throw 404
```

## Module Wiring

`PlantelModule` goes from `@Module({})` to full wiring:

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [PlayerController, TeamController],
  providers: [
    // Repositories
    { provide: IPlayerRepository, useClass: PlayerRepository },
    { provide: ITeamRepository, useClass: TeamRepository },
    { provide: ITeamQueryRepository, useClass: TeamQueryRepository },
    // Command gestores (8 existing)
    { provide: ICrearJugador, useClass: CrearJugador },
    { provide: IEditarJugador, useClass: EditarJugador },
    { provide: IEliminarJugador, useClass: EliminarJugador },
    { provide: ICrearEquipo, useClass: CrearEquipo },
    { provide: IEditarEquipo, useClass: EditarEquipo },
    { provide: IEliminarEquipo, useClass: EliminarEquipo },
    { provide: IAddToPlayerToTeam, useClass: AddPlayerToTeam },
    { provide: IRemovePlayerToTeam, useClass: RemoverJugadorDeEquipo },
    // Query gestores (5 new)
    { provide: IListarJugadores, useClass: ListarJugadores },
    { provide: IObtenerJugador, useClass: ObtenerJugador },
    { provide: IListarEquipos, useClass: ListarEquipos },
    { provide: IObtenerEquipo, useClass: ObtenerEquipo },
    { provide: IListarJugadoresPorEquipo, useClass: ListarJugadoresPorEquipo },
  ],
})
export class PlantelModule {}
```

Following `IamModule`'s pattern: abstract class as token, concrete class via `useClass`. NestJS resolves constructor dependencies through port tokens.

## Prisma Schema Sync

Add to `Player` model in `prisma/schema.prisma` (schema `plantel`):

```prisma
birthday DateTime? @db.Date
number   Int?
```

Generate migration: `bunx prisma migrate dev --name add_player_birthday_number`

Fields are nullable for backward compatibility with existing data. Domain `Player` entity already has `birthday: Date` and `number: number` — this syncs the persistence layer.

## File Manifest

| File | Action |
|---|---|
| `ports/in/plantel.port.ts` | Modify — add 5 query abstract classes |
| `app/listarJugadores.ts` | Create |
| `app/obtenerJugador.ts` | Create |
| `app/listarEquipos.ts` | Create |
| `app/obtenerEquipo.ts` | Create |
| `app/listarJugadoresPorEquipo.ts` | Create |
| `app/index.ts` | Modify — export new gestores |
| `adapters/http/dtos/response/PlayerResponse.dto.ts` | Create |
| `adapters/http/dtos/response/TeamResponse.dto.ts` | Create |
| `adapters/http/dtos/response/index.ts` | Create |
| `adapters/http/player.controller.ts` | Modify — add 2 GET endpoints |
| `adapters/http/team.controller.ts` | Modify — add 3 GET endpoints |
| `adapters/persistance/player.repository.ts` | Modify — add `@Injectable()` |
| `adapters/persistance/teamQuery.repository.ts` | Modify — add `@Injectable()` |
| `plantel.module.ts` | Modify — full wiring |
| `prisma/schema.prisma` | Modify — add birthday, number |

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | Gestor logic | Mock repository, verify DTO mapping |
| Integration | Controller endpoints | NestJS `Test` with `app.getHttpServer()`, verify 200/404 |
| Prisma | Migration | Run against test DB, verify column addition |

## Open Questions

- **Logical deletion**: Spec assumes soft-deletes; current code uses hard `delete()`. For now, deleted records simply aren't found (404). Adding `deletedAt` + global filter is a future concern.
- **Existing gestor import inconsistency**: Command gestores import `playerRepository` (lowercase) from `playerRespository.port.ts`, but the file exports `IPlayerRepository`. Module wiring uses the correct abstract tokens. Existing gestor imports should be fixed — tracked separately.
