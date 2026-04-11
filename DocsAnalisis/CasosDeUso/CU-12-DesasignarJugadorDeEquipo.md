# Tipo CU: Base

# Descripción:

El usuario administrador desvincula un jugador de su equipo actual, dejándolo sin equipo asignado.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Asignar Jugador a Equipo

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona un jugador del plantel e inicia el caso de uso.
2. El sistema muestra la interfaz de opciones.
3. El administrador selecciona la opción "Desasignar Jugador".
4. El sistema muestra un mensaje de confirmación y finaliza el CU.

# Flujo Alternativo:

El administrador puede cancelar el caso de uso antes del paso 3

# Postcondiciones:

- El jugador queda desvinculado del equipo.
- El jugador deja de aparecer en el plantel del equipo.
- El jugador queda disponible para ser asignado a otro equipo.
