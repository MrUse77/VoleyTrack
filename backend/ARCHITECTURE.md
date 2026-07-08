# Backend Architecture: Business-First Bounded Contexts

The VoleyTrack backend is organised by volleyball business domains first, not by Spring layers. This keeps match orchestration, roster management, identity, and live statistics independent as the product grows.

## Quick path

1. Open the bounded context that matches the feature you are changing.
2. Place domain code in `domain/`, use cases in `application/`, and framework integration in `adapter/`.
3. Cross-context integration goes through application ports, never direct table access.

## Bounded contexts

| Context | Status in this slice | Responsibility |
|---------|----------------------|----------------|
| `partidos` | Implemented (package contracts) | Match orchestration, sets, scoring, substitutions, and lifecycle. |
| `usuarios` | Documented only | Identity, access, roles, and permissions. |
| `plantel` | Documented only | Teams, players, rosters, and eligibility data. |
| `live-stats` | Documented only | Live scoreboard and read models fed by future match events. |

Only `partidos` has Java package contracts in this slice. The other contexts are named here so future work can follow the same pattern without creating empty placeholder code.

## Package rules

| Rule | Rationale |
|------|-----------|
| Organise by bounded context first | `partidos/` is a sibling of the root application class, not nested under `services/` or `controllers/`. |
| No root-level framework packages | Do not create `controllers/`, `services/`, or `repositories/` directly under `com.mrusedev.voleytrack`. |
| Hexagonal layers per context | Each context uses `domain/`, `application/`, `application/port/in/`, `application/port/out/`, `adapter/in/`, and `adapter/out/`. |
| No implementation packages for future contexts | `usuarios`, `plantel`, and `live-stats` appear only in this document until a spec selects them. |
| Cross-context through ports | A context depends on another through an application port interface, not by reading another context's tables. |
| Root application class stays put | `com.mrusedev.voleytrack.VoleytrackApplication` remains at the root package. |

## Future data flow

```text
adapter.in -> application.port.in -> application use case -> domain
                                             |
                                             v
                                      application.port.out -> adapter.out
```

Future cross-context relationships remain documentation-only for now:

```text
usuarios  -> authorization context for protected actions
plantel   -> roster/eligibility data consumed by partidos through a port
partidos  -> future match events consumed by live-stats projections
```

## Checklist

- [ ] New code lives inside a bounded context package, not in a generic layer package.
- [ ] Business rules stay in `domain/`; orchestration stays in `application/`; framework code stays in `adapter/`.
- [ ] A context that depends on another declares a port in `application/port/out/`.
- [ ] No `usuarios/`, `plantel/`, or `live-stats/` Java packages are created before a spec requires them.

## Next step

See the `partidos` package contracts under `backend/src/main/java/com/mrusedev/voleytrack/partidos/` for the first concrete bounded context.
