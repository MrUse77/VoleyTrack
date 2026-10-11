# VoleyTrack — Brand Spec (extraído de voleytrack-webapp-design.op)

Derivado directamente del documento canónico OpenPencil de 23 páginas.

## Tokens (OKLch + hex)

- --bg: #0b1220 — fondo profundo navy, base de la app
- --surface: #111a2b — superficies elevadas / cards / inputs
- --surface-raised: #1e293b / #243249 — bordes y separadores sutiles
- --fg: #f8fafc — texto principal (blanco frío)
- --muted: #94a3b8 — texto secundario / captions
- --border: #1e293b — hairlines
- --accent: #ff8c42 — naranja VoleyTrack (CTAs, live, estados activos)
- --accent-2: #3b82f6 — azul secundario (info)
- --success: #4caf50 — verde victoria
- --danger: #ef4444 / #f44336 — errores / en vivo
- --radius: 12–16px — cards y inputs
- --shadow: 0 8px 24px rgba(0,0,0,0.35)

## Tipografía

- Familia única: Inter en todos los pesos (400, 700, 900)
- Display / títulos: 28–48px, 900, letter-spacing -0.02em
- Heading: 18–32px, 700
- Body: 13–14px, 400/700, line-height 1.5
- Mono/caption: 11–12px, 700, uppercase tracking 0.06em

## Reglas visuales observadas

1. Dark-first absoluto: nunca fondo claro; todo vive sobre #0b1220 con capas en #111a2b.
2. Sidebar fijo de 248px + header de 72px; contenido 1192px dentro de 1440px. Todo a 8px grid.
3. Acento único naranja usado solo para CTA primario, badges LIVE y active states — nunca más de 2 por viewport.
4. Cards con border #243249 1px + radius 16, sin sombras pesadas.
5. Métricas y scores en mono tabular; mayúsculas condensadas para etiquetas (11px, 700, tracking).
