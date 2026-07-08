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

## Frontend

| Decisión | Stack | Estado |
|----------|-------|--------|
| **Framework** | React (según RNF-07) | 🔲 Pendiente |

## Dominio

23 clases de dominio implementadas con TDD. Cubre:

- **Enums**: Posicion, EstadoPartido, EstadoSet, TipoFundamento, TipoSustitucion, TipoLado, RolUsuario
- **Partido**: Partido, SetPartido, Marcador, Cambios, CantSets, Lado
- **Equipo**: Equipo, Jugador, Plantel, Alineacion, AlineacionJugador
- **Eventos**: Evento, Sustitucion
- **Usuarios**: Usuario, Admin, Planillero
- **Proyección**: Estadistica

## Reglas de negocio verificadas

RN-01 a RN-06 implementadas y testeadas (70 tests totales).

## Próximos pasos

1. Implementar controladores REST (`adapter/in/web/`)
2. Conectar frontend React con la API
3. Autenticación JWT con Spring Security
4. WebSockets para pizarra en vivo
