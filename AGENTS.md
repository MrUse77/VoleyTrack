# Stack y Arquitectura — VoleyTrack

## Backend

| Decisión | Stack | Estado |
|----------|-------|--------|
| **Lenguaje** | Java 21 | ✅ |
| **Framework** | Spring Boot 4.1.0 (WebMVC, Data JDBC, Validation, Flyway) | ✅ |
| **Build** | Gradle 9.5.1 | ✅ |
| **Persistencia** | Spring Data JDBC + Flyway | ✅ |
| **Base de datos** | PostgreSQL 16 (prod) / H2 (test) | ✅ |
| **Arquitectura** | Hexagonal (Ports & Adapters) + GRASP | ✅ |
| **Testing** | JUnit 5 + AssertJ + Mockito | ✅ |

Ver `backend/ARCHITECTURE.md` para el detalle de la estructura hexagonal.

Evidencia verificable en `origin/main` (2026-10-09):

- `backend/src` — 95 archivos `.java` (83 en `src/main`, 12 en `src/test`).
- `adapter/in/web/` — 0 controllers REST (solo `package-info.java`).
- Tests backend — 12 archivos, 80 tests, suite verde (`./gradlew test`).

## Frontend

| Decisión | Stack | Estado |
|----------|-------|--------|
| **Framework** | React 19 + Vite 8 + TypeScript (según RNF-07) | ✅ Implementado |
| **UI** | Tailwind CSS 4 + componentes propios (`frontend/src/components`) | ✅ |
| **Testing** | Vitest (`cd frontend && bun run test`) | ✅ Configurado |

Implementado en `frontend/` con features `public`, `scoring`, `auth`, `dashboard`, `matches` y `admin` (128 archivos `.ts`/`.tsx` en `frontend/src`, 47 de test).
Pendiente: conectarlo con la API REST del backend.

## Dominio

24 clases de dominio implementadas con TDD. Cubre:

- **Enums**: Posicion, EstadoPartido, EstadoSet, TipoFundamento, TipoSustitucion, TipoLado, RolUsuario
- **Partido**: Partido, SetPartido, Marcador, Cambios, CantSets, Lado
- **Equipo**: Equipo, Jugador, Plantel, Alineacion, AlineacionJugador
- **Eventos**: Evento, Sustitucion
- **Usuarios**: Usuario, Admin, Planillero
- **Proyección**: Estadistica

## Reglas de negocio verificadas

RN-01 a RN-06 implementadas y testeadas (80 tests totales, suite verde al 2026-10-09).

## Próximos pasos

1. Controladores REST en `adapter/in/web/` (hoy: 0 controllers, solo `package-info.java`)
2. CRUDs de equipo y jugador (`GestorEquipo`/`GestorJugador` + endpoints)
3. Autenticación JWT con Spring Security
4. WebSockets para la pizarra en vivo
5. `docker-compose` con PostgreSQL para desarrollo local
6. Conectar el frontend React (ya implementado) con la API REST
