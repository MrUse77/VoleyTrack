# Tipo CU: Base

# Descripción:

El sistema finaliza el partido cuando un equipo alcanza la cantidad de sets necesarios para ganar, cambia el estado del partido a "Finalizado", bloquea la carga de nuevas acciones, cierra la transmisión en vivo y genera el reporte final de métricas y eficacias consolidadas de ambos equipos.

# Actor principal: Sistema (automático)

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Anotar Punto](https://www.notion.so/Anotar-Punto-31e96131003a801d881ce99bd2e4a24f?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El sistema cambia el estado del partido a "Finalizado", registra el resultado final, metricas y finaliza el CU.

# Flujo Alternativo:

No aplica (el flujo es automático al cumplirse la condición).

# Postcondiciones:

- El partido queda con estado "Finalizado".
- El resultado final queda registrado (sets ganados, marcadores de cada set).
- La carga de nuevas acciones queda bloqueada permanentemente.
- La transmisión en vivo queda cerrada (los espectadores ven el resultado final).
- El reporte final de estadísticas queda generado y disponible.
