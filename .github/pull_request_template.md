## Qué cambia

Breve descripción de qué se modificó y por qué.

## Issue

- Closes #

## Archivos afectados

- `backend/src/main/java/...` — descripción del cambio

## Testing

- [ ] `cd backend && ./gradlew clean test` pasa (si hay cambios en `backend/`)
- [ ] `cd frontend && bun run test` pasa (si hay cambios en `frontend/`)
- [ ] El caso de uso afectado fue verificado a mano (si aplica)

## Checklist

- [ ] La branch sigue la convención de nombres (`<tipo>/<descripcion-kebab-case>`)
- [ ] Los commits siguen Conventional Commits (`tipo(scope): descripción`)
- [ ] No se mezclan cambios de backend con frontend sin justificación
- [ ] Si cambia el contrato de la API (status HTTP, claves JSON, firma de un puerto), queda anotado arriba
- [ ] Se respetan las reglas de la arquitectura hexagonal: `domain` no depende de frameworks ni de `application`, y la taxonomía de errores vive en `application/exception`
