# Tipo CU: Base

# Descripción:

El usuario planillero modifica la alineación de uno o ambos equipos antes de iniciar un set, cambiando los jugadores titulares o el líbero.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Crear Alineacion](https://www.notion.so/Crear-Alineacion-31e96131003a80bb8c7cf64c95d0cd2e?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El planillero selecciona la opción "Modificar Alineaciones" e inicia el caso de uso.
2. El sistema muestra la interfaz y carga las alineaciones de ambos equipos
3. El planillero selecciona la casilla del jugador a modificar.
4. El sistema muestra los jugadores suplentes del equipo.
5. El planillero selecciona al nuevo jugado.
6. El sistema muestra un vista previa.
7. El planillero oprime “Guardar:
8. El sistema actualiza la alineación del equipo y finaliza el CU.

# Flujo Alternativo:

El planillero puede cancelar el caso de uso antes del paso 7

**FA-01: Modificacion de jugador por libero**

- 5.1. El sistema muestra un mensaje de error
- 5.2. Continua el caso de uso en el paso 5 del flujo normal.

# Postcondiciones:

- La alineación del equipo seleccionado queda actualizada.
- Los jugadores removidos quedan marcados como "En banca".
- Los nuevos jugadores quedan marcados como "En cancha".
