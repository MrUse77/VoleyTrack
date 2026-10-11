# Backend Architecture: Hexagonal (Ports & Adapters)

The VoleyTrack backend follows a hexagonal architecture with a unified domain model. All business logic lives in `domain/`, orchestration in `application/`, and framework integration in `adapter/`.

## Quick path

1. Domain classes go in `domain/`. All entities, value objects, and enums share the same package — no bounded-context separation.
2. Use cases (gestores) go in `application/gestor/`, implementing ports from `application/port/in/`.
3. Repository interfaces go in `application/port/out/`, implementations in `adapter/out/persistence/`.
4. REST controllers go in `adapter/in/web/`.

## Package structure

```
com.mrusedev.voleytrack/
├── domain/                         ← 23 classes: entities, value objects, enums
├── application/
│   ├── port/
│   │   ├── in/                     ← use case interfaces
│   │   └── out/                    ← repository interfaces
│   └── gestor/                    ← use case implementations (GestorPartido, etc.)
├── adapter/
│   ├── in/
│   │   └── web/                    ← REST controllers (PartidoController, etc.)
│   └── out/
│       └── persistence/            ← JDBC repositories, Spring Data adapters
└── VoleytrackApplication.java
```

## Package rules

| Rule | Rationale |
|------|-----------|
| No root-level framework packages | Do not create `controllers/`, `services/`, or `repositories/` at root. |
| Hexagonal layers only | `domain/`, `application/`, and `adapter/` are the three top-level packages. |
| Domain classes share one package | All 23 entities, value objects, and enums live in `domain/` with zero cross-package imports. |
| Ports define contracts | `application/port/in/` for use cases, `application/port/out/` for infrastructure dependencies. |
| Adapters implement ports | `adapter/in/web/` exposes REST, `adapter/out/persistence/` talks to the database. |
| Root application class stays put | `com.mrusedev.voleytrack.VoleytrackApplication` remains at the root package. |

## Data flow

```text
adapter/in/web → application/port/in → application/gestor → domain
                                          │
                                          ▼
                                   application/port/out → adapter/out/persistence
```

## Domain model (23 classes)

| Category | Classes |
|----------|---------|
| Enums | `Posicion`, `EstadoPartido`, `EstadoSet`, `TipoFundamento`, `TipoSustitucion`, `TipoLado`, `RolUsuario` |
| Match | `Partido`, `SetPartido`, `Marcador`, `Cambios`, `CantSets`, `Lado` |
| Team | `Equipo`, `Jugador`, `Plantel`, `Alineacion`, `AlineacionJugador` |
| Events | `Evento`, `Sustitucion` |
| Identity | `Usuario`, `Admin`, `Planillero` |
| Projection | `Estadistica` |

## Error taxonomy

Error handling is split across layers on purpose:

| Layer | Declares | Examples |
|---|---|---|
| `domain/` | **No exception types of its own.** Uses JDK exceptions: `IllegalStateException` for state invariants, `IllegalArgumentException` for invalid input or identity mismatches | `Partido.iniciarSet()`, `Alineacion.agregarJugador()`, `CantSets` |
| `application/exception/` | The taxonomy the use cases speak | `RecursoNoEncontradoException` (missing resource), `ReglaDeNegocioException` (business rule violated) |
| `adapter/in/web/` | The HTTP translation, in one place: `ApiExceptionHandler` | `RecursoNoEncontradoException` → 404, `ReglaDeNegocioException` → 409, `IllegalArgumentException` → 400 |

Rules:

- The domain never declares its own exception types, and never imports
  `application` or a framework.
- Use cases translate at the boundary when the JDK type is too coarse: a state
  invariant violated by the request becomes `ReglaDeNegocioException` (409), an
  invalid input stays `IllegalArgumentException` (400).
- Catch narrowly — `catch (IllegalStateException e)`, never
  `catch (RuntimeException e)`: a broad catch turns a legitimate 404 into a 409.
- Ownership guards run **before** the `try` that translates domain exceptions,
  and persistence stays **outside** it.
- A message a use case returns is part of the HTTP contract: if it is built, it
  has to reach the client.

## Checklist

- [ ] New code lives inside `domain/`, `application/`, or `adapter/`.
- [ ] Business rules stay in `domain/`; orchestration stays in `application/gestor/`; framework code stays in `adapter/`.
- [ ] Use cases implement an interface from `application/port/in/`.
- [ ] Repository calls go through an interface from `application/port/out/`.
- [ ] No `controllers/`, `services/`, or `repositories/` packages exist at the root.
