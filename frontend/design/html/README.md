# VoleyTrack — OpenDesign

**Orígenes:** este proyecto traduce el diseño canónico OpenPencil `voleytrack-webapp-design.op` (23 páginas, 3.0 MB, \~3.6k nodos) a formato nativo OpenDesign.

## Archivos en este proyecto

| Archivo | Rol | Estado |
|---|---|---|
| `voleytrack-webapp-design.op` | Canónico original OpenPencil — **no editar**, fuente de verdad | ✅ canónico |
| `voleytrack-webapp-design.pen` | Copia nativa OpenDesign (.pen = mismo schema JSON, extensión .pen) — editable en canvas | ✅ generado |
| `voleytrack-prototype.html` | Prototipo combinado histórico — toda la app en un solo archivo (navegación switchView) | ✅ histórico |
| `voleytrack-invitado.html` | Prototipo rol Invitado/Público — todas las vistas en un solo archivo (histórico) | ✅ histórico |
| `voleytrack-dashboard.html` | Sección Dashboard — Invitado | ✅ separado |
| `voleytrack-partidos.html` | Sección Partidos — Invitado | ✅ separado |
| `voleytrack-torneos.html` | Sección Torneos — Invitado | ✅ separado |
| `voleytrack-equipos.html` | Sección Equipos (listado + detalle de equipo) — Invitado | ✅ separado |
| `voleytrack-jugadores.html` | Sección Jugadores (listado + ficha) — Invitado | ✅ separado |
| `voleytrack-live.html` | Sección En vivo (detalle del partido) — Invitado | ✅ separado |
| `voleytrack-ui-states.html` | Sección UI States (Z.20) — Invitado | ✅ separado |
| `voleytrack-planillero.html` | Prototipo rol Planillero — con login, solo Operación | ✅ por rol |
| `voleytrack-admin.html` | Prototipo rol Admin — con login, solo Administración | ✅ por rol |
| `brand-spec.md` | Tokens y reglas visuales extraídos del .op (hex, tipografía, spacing) | ✅ generado |
| `voleytrack-webapp-uiux-audit.md` | Auditoría V1 P0/P1 (source-level, pre-remediación + estado remediado) | 📄 referencia |

## Traducción realizada

- **.op → .pen:** copia byte-identical validada como JSON (23 pages, version 1). OpenPencil y OpenDesign comparten schema PenNode; la extensión .pen habilita el canvas de OpenDesign sin conversión destructiva.
- **Tokens extraídos:** `#0b1220` bg · `#111a2b` surface · `#f8fafc` fg · `#94a3b8` muted · `#1e293b`/`#243249` border · `#ff8c42` accent · Inter 400/700/900. Ver `brand-spec.md`.
- **Prototipo HTML:** shell con sidebar 248px + header 72px + contenido 1192px (1440 total), grid 8px, radius 16. Todas las vistas V1 navegables: Login, Dashboard, Partidos (filtros + 6 cards), Live Detail (scoreboard + cancha 6 posiciones + timeline), Setup 2.01, Consola 2.02 (scoring interactivo +1/−1, undo, sustitución), Post-partido 2.04, Admin 3.01–3.03 (tabs Torneos/Partidos/Equipos/Jugadores/Staff + row actions + modales distintos), UI States Z.20. Torneos/Tabs/Bracket futuros marcados como exploratory.
- **Interacciones:** login con validación, búsqueda, filtros, navegación entre 12 vistas, scoring +1/−1 con historial y undo real, cambio admin tabs, toast, responsive (920px collapse). Audit P1 breakpoint 1428 fix aplicado (grid fluido en PlayerDetail).

## Cómo usar

- **Abrir diseño nativo:** `op open voleytrack-webapp-design.pen` (o .op) — 23 páginas listadas en preámbulo.
- **Prototipo por sección (rol Invitado):** abrir `voleytrack-dashboard.html` en el visor de OpenDesign o navegador. Cada sección es un archivo autocontenido (`voleytrack-partidos.html`, `voleytrack-torneos.html`, `voleytrack-equipos.html`, `voleytrack-jugadores.html`, `voleytrack-live.html`, `voleytrack-ui-states.html`), con navegación entre ellos por links. Los roles Planillero y Admin tienen su propio archivo con login.
- **Design scope V1:** ver sección “V1 Implementation Boundary” abajo — Z.20 incluido, resto Z.* y 1.03/1.04 exploratory excluidos de V1.

## V1 Implementation Boundary

Tournament views (páginas 1.03, 1.04, y todo `Z.*` excepto `Z.20 UI States`) son **exploratory future-scope**, no parte de V1. `Z.20 UI States` es referencia genérica V1.

## Review boundary

El boundary de review es el documento OpenPencil completo (.op/.pen). El prototipo HTML es derivación navegable para validación interactiva, no reemplaza el canvas vectorial.

## Auditoría

Ver [voleytrack-webapp-uiux-audit.md](voleytrack-webapp-uiux-audit.md) — P0 estructural resuelto, P1 visual/journey remediado (47 archivos / 258 tests), P1 responsive overflow documentado, falta audit renderizado a 1416/1428/1440 + a11y.
