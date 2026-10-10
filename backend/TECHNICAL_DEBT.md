# Backend — Deuda Técnica Verificada

> Relevado en julio de 2026 a partir del estado del worktree.
> Lista **sólo** limitaciones vigentes, verificadas contra el código fuente. Los defectos ya corregidos (reconstrucción de persistencia, cableado de `@Transactional`) se omiten.
> Los ítems marcados **Diferido** son hallazgos de revisión sin resolver: el autor eligió explícitamente documentarlos en lugar de arreglarlos por ahora.
>
> **Actualizado el 2026-10-10**: se revisó el estado de cada ítem contra la rama `feat/api` y se agregaron los hallazgos 11 y 12.

## Camino rápido

1. Mirá la columna **Categoría** para saber qué te importa según la tarea.
2. Leé el **Impacto** para medir la gravedad.
3. Usá la **Recomendación** como punto de partida del arreglo.

## Limitaciones

| # | Categoría | Qué | Impacto | Recomendación |
|---|-----------|-----|---------|----------------|
| 1 | Capa web | **Resuelto.** No había controladores REST — `adapter/in/web/` sólo tenía `package-info.java`. Hoy hay 4 controladores y 8 endpoints en `feat/api`. | Ya no aplica. | — |
| 2 | Identidad de dominio | **Parcial.** `Equipo` ya tiene `equals`/`hashCode` por `UUID id` (commit `6f5560f`). **`Jugador` sigue sin tenerlos**, y hay 2 llamadas que dependen de `Jugador.equals` vía `List.contains/remove`. | Las entidades reconstituidas (misma UUID, otra instancia) fallan la comparación. Sin el `equals` en `Jugador` queda el mismo agujero que tenía `Equipo`, en silencio. | Replicar en `Jugador` lo que se hizo en `Equipo`: `equals`/`hashCode` sobre el `UUID id`, con un test que cree dos instancias con el mismo ID y afirme igualdad. |
| 3 | Reconstrucción | `PartidoRepositoryPortImpl.buscarPorId` pasa `null` como Equipo al `PartidoMapper.toDomain` cuando `equipoRepo.buscarPorId()` viene vacío. | Una fila corrupta o incompleta produce un `Partido` con Equipos nulos dentro de `Lado`, y revienta con NPE **en el momento de anotar**, no al cargar. | Agregar guardas de nulo en `PartidoMapper.toDomain` (lanzar `IllegalStateException` con los IDs), o hacer que `buscarPorId` devuelva `Optional.empty()` si falta alguno de los dos equipos. |
| 4 | Observabilidad | No hay dependencia de Spring Boot Actuator — falta `spring-boot-starter-actuator` en `build.gradle`. | Sin endpoint de salud, sin probes de readiness/liveness, sin métricas. Un orquestador no puede saber si la app está viva. | Agregar `spring-boot-starter-actuator` y exponer `/actuator/health`. El `docker-compose` ya hace healthcheck de PostgreSQL: la app debería tener el suyo. |
| 5 | Fidelidad de la base de test | Los tests usan H2 con `MODE=PostgreSQL`, `spring.flyway.enabled=false` y el DDL de un `schema.sql` mantenido a mano — **no** de la migración `V1__esquema_inicial.sql`. Los ENUM de PostgreSQL se reemplazan por `varchar` sin `CHECK`; no hay `jsonb` ni `BIGSERIAL`; las tablas que todavía no ejercitan tests (`plantel`, `pizarra_en_vivo`, `timeline`, `usuarios`) ni figuran. | **Confirmado en la práctica el 2026-10-10**: este desvío escondió que **todas las escrituras con columnas enum fallaban** contra PostgreSQL real (`column "estado" is of type estado_set_enum but expression is of type character varying`). Los 125 tests estaban verdes y la app no podía escribir una fila. Se resolvió agregando `?stringtype=unspecified` a la URL del datasource, pero la causa de fondo sigue. | Habilitar Flyway en el perfil de test (`spring.flyway.enabled=true`) apuntando a la misma ruta de migraciones. Considerar un perfil de tests de integración con **Testcontainers** sobre PostgreSQL real. Como mínimo, un smoke test que corra `flyway migrate` y valide el esquema. |
| 6 | CI/CD | No hay pipeline — no hay `.github/workflows` ni `Dockerfile` de la app. | Cada cambio se compila y testea a mano. Sin barrera automática en los PRs. El `docker-compose.yml` sólo levanta PostgreSQL. | Agregar un workflow de GitHub Actions que corra `./gradlew test` en push/PR. Agregar un `Dockerfile` multi-stage para la app y sumarla al `docker-compose`. |
| 7 | Documentación desactualizada | `ENVIRONMENT.md` línea 39 dice "Flyway está deshabilitado en el perfil de test hasta que exista la primera migración real" — pero `V1__esquema_inicial.sql` ya existe. | Quien retome el proyecto puede creer que Flyway está deshabilitado a propósito y no darse cuenta de que hay que reactivarlo. | Actualizar `ENVIRONMENT.md` al estado real: la migración V1 existe; documentar el hueco de H2. |
| 8 | Recarga de persistencia | **Diferido.** `SetSpringDataRepository.findByPartidoId()` devuelve los sets **sin `ORDER BY`**. `Partido.getSetActual()` usa `sets.getLast()`, confiando en el orden de inserción. `reconstruirSets()` hace `addAll()` preservando el orden que devuelva la base. | Si la base devuelve los sets en orden arbitrario (ej. [3, 1, 2]), `getSetActual()` elige el set equivocado. Todo el anotado posterior — `anotarPunto()`, `confirmarPunto()` — opera sobre contexto viejo. **Impacto realista: tras un segundo `buscarPorId` en medio de un partido, la app puede seguir anotando en un set ya terminado.** | Agregar `ORDER BY num_set ASC` a `findByPartidoId` (preferido: el orden se resuelve en la capa de datos) o ordenar explícitamente en `buscarPorPartido()`. Verificar con un test que cargue un partido con 3 sets persistidos y afirme que `getSetActual().getNumeroSet()` es el más alto. |
| 9 | Recarga de persistencia | **Diferido.** `SetRepositoryPortImpl.toDomain()` rehidrata `sustituciones` vía `sustitucionRepo.buscarPorSet()` y `set.restaurarSustituciones()`. El camino existe y es invocable, pero no tiene aserción de ida y vuelta. | No hay prueba automática de que `guardar()` → `buscarPorId()` restaure fielmente una `Sustitucion`. Una regresión (campo faltante en el mapper, FK mal) borra el historial de cambios en silencio. **Como las sustituciones llevan el límite de 6 cambios, perderlas al recargar permite que un equipo se pase del tope.** | Test de integración: crear una `Sustitucion` en un set, guardar set y sustitución, recargar por `setRepo.buscarPorId()` y afirmar que `getSustituciones()` contiene una entrada equivalente. |
| 10 | Fronteras transaccionales | **Diferido.** `confirmarInicioPartido` es `@Transactional` con la persistencia fuera del try-catch (mismo patrón que `confirmarPunto`), pero `GestorPartidoTransactionalIntegrationTest` cubre el rollback **sólo** de `confirmarPunto`. | El proxy de Spring está probado para un solo método. Si la frontera transaccional de `confirmarInicioPartido` se rompe, los `guardar()` no revierten y queda un partido a medio iniciar en la base. El test unitario de Mockito no ejercita el proxy: sólo verifica que la excepción se propaga, no que la transacción vuelva atrás. | Replicar el test existente `confirmarPuntoRollsBackAllStateWhenEventoPersistenceFails`: iniciar un partido, hacer que un puerto lance, llamar a `gestor.confirmarInicioPartido()`, recargar de la base real y afirmar que no quedó estado parcial. |
| 11 | Reglas de negocio | **Hallazgo 2026-10-10.** `Partido.iniciarSet()` valida **cuántos** sets hay (`sets.size() >= cantSets.getCantidad()`) pero **no mira el estado del partido**. | Con un partido al mejor de 3 puesto 2-0, `verificarFinPartido()` lo deja en `FINALIZADO`; sin embargo `sets.size()` es 2 contra un máximo de 3, así que `iniciarSet()` **crea el tercer set sin chistar**: queda un partido terminado con un set nuevo en curso. Y si se pide un cuarto set, ahí sí lanza `IllegalStateException`, que hoy no está mapeada y saldría como **500** en lugar de error de negocio. | Hacer que `iniciarSet()` rechace si el partido ya está `FINALIZADO` (o, más al hueso, si algún lado ya alcanzó `setsParaGanar()`). Mapear la excepción a un error de negocio (409). Agregar el test que documenta la regla. **Dejado anotado por decisión del autor.** |
| 12 | Persistencia | **Hallazgo 2026-10-10.** `EquipoRepositoryPort.guardar` no persiste el plantel del equipo, y **hoy no hay ningún camino real que lo llame** con un equipo que tenga jugadores cargados (verificado: `grep -rn "equipoRepo.guardar"` sobre `src/main/java` da 0 llamadas). | Asimetría conocida: la **lectura** rehidrata el plantel (tramo 2.75), pero la **escritura** lo ignora. El día que exista un caso de uso que guarde un equipo con jugadores, esos jugadores se pierden en silencio. | Cuando aparezca el primer caso de uso que guarde equipos (probablemente con el CRUD de equipo/jugador), hacer que `guardar` persista el plantel también — o documentar explícitamente por qué no. No construir código especulativo antes de que exista el llamador. |

## Resumen por severidad

| Severidad | Ítems |
|-----------|-------|
| **Alta** (bloquea el uso en runtime) | #3 (NPE por equipo nulo), #8 (recarga de sets sin orden) |
| **Media** (bugs silenciosos / corrupción de datos) | #2 (`Jugador` sin identidad), #5 (fidelidad del schema de test), #11 (set creado en partido terminado) |
| **Baja** (operacional / documentación) | #4 (observabilidad), #6 (CI/CD), #7 (docs desactualizadas), #12 (asimetría del plantel) |
| **Diferido** (hallazgos de revisión, sin arreglar) | #8, #9, #10 |

## Checklist de verificación

- [x] Los controllers REST existen y responden (ítem #1)
- [x] `Equipo a = new Equipo(id, "A", null); Equipo b = new Equipo(id, "A", null); assert a.equals(b);` pasa (ítem #2, sólo `Equipo`)
- [ ] `Jugador` con el mismo ID compara por igualdad (ítem #2, `Jugador`)
- [ ] Cargar un `Partido` cuya FK de equipo apunta a una fila inexistente lanza un error claro, no NPE al anotar (ítem #3)
- [ ] `curl localhost:8080/actuator/health` devuelve `{"status":"UP"}` (ítem #4)
- [ ] Los tests de integración corren contra PostgreSQL real (Flyway o Testcontainers) (ítem #5)
- [ ] GitHub muestra un check verde en el PR (ítem #6)
- [ ] `ENVIRONMENT.md` ya no afirma que Flyway está deshabilitado (ítem #7)
- [ ] `findByPartidoId` devuelve los sets ordenados por `num_set ASC` (ítem #8)
- [ ] Un test de integración prueba que una `Sustitucion` sobrevive el ida y vuelta guardar → cargar (ítem #9)
- [ ] Un test de integración prueba que `confirmarInicioPartido` revierte ante fallo de persistencia (ítem #10)
- [ ] `iniciarSet()` rechaza crear un set en un partido `FINALIZADO` (ítem #11)
