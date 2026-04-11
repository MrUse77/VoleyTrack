# Tipo CU: Base

# Descripción:

El usuario invitado (espectador) visualiza en tiempo real las estadísticas del partido, mostrando la cantidad de puntos por categorías (ataque, bloqueo, saque, errores) diferenciadas por sets, así como estadísticas individuales de cada jugador.

# Actor principal: Usuario Invitado

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

# Puntos de extensión: -

# Flujo Normal:

1. El usuario invitado oprimer en un partido finalizado e inicia el CU
2. El sistema muestra la interfaz y carga las estadísticas del partido:
    - Puntos por categoría de cada equipo (Ataque, Bloqueo, Saque/Ace, Error Rival)
    - Diferenciación por sets (ej: Set 1, Set 2, Total)
    - Estadísticas individuales de cada jugador:
        - ATK (Puntos de ataque)
        - BLOQ (Puntos de bloqueo)
        - SAQ (Puntos de saque/aces)
        - ENF (Errores no forzados)
3. Finaliza el CU

# Flujo Alternativo:

-

# Postcondiciones:

- El usuario invitado visualiza las estadísticas del partido finalizado.
