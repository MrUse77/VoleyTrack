# Tipo CU: Base

# Descripción:

El usuario administrador vincula un jugador existente a un equipo específico para conformar su plantel.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Crear Jugador

- Crear Equipo

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona la opción "Asignar Jugador" y comienza el caso de uso
2. El sistema muestra la interaz y carga los jugadores disponibles (sin equipo y activos).
3. El administrador selecciona al jugador a asignar.
4. El sistema muestra los datos del jugador
5. El administrador oprime en: “Agregar”
6. El sistema vincula al jugador con el equipo seleccionado y finaliza el caso de uso.

# Flujo Alternativo:

El administrador puede cancelar el CU antes del paso 5

**FA-02: Dorsal duplicado en el equipo**

- 6.1. El sistema muestra un mensaje: "El dorsal ya está asignado a otro jugador en este equipo. Modificá el dorsal antes de asignar".
- 6.2. El caso de uso continua en el paso 3 del FN

# Postcondiciones:

- El jugador queda vinculado al equipo seleccionado.
- El jugador aparece en el plantel del equipo.
- El jugador está disponible para ser seleccionado en las alineaciones de partidos de ese equipo.
