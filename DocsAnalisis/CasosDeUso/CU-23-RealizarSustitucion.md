# Tipo CU: Base

# Descripción:

El usuario planillero registra un cambio de jugador (sustitución regular o reemplazo de líbero), actualizando el estado de los jugadores (en cancha / en banca) y descontando del contador de cambios si corresponde.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Partido](https://www.notion.so/Iniciar-Partido-31e96131003a80e0bf9fe07380055c4a?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El planillero selecciona la opción "Realizar sustitución" del equipo a realizar dicha sustitucion e inicia el CU.
2. El sistema muestra la interfaz y carga los jugadores suplentes del equipo.
3. El planillero selecciona el jugador que sale y el jugador que entra.
4. El sistema muestra una vista previa
5. El planillero oprimer en: “Confirmar”.
6. El sistema muestra un mensaje de confirmación, actualiza la alineacion y finaliza el CU.

# Flujo Alternativo:

El planillero puede cancelar el caso de uso antes del paso 5

**FA-01: Límite de cambios alcanzado en jugadores que no impliquen al libero**

- 6.1. El sistema muestra un mensaje: “No mas cambios disponibles” y finaliza el CU.

# Postcondiciones:

- El jugador que sale queda marcado como "En banca".
- El jugador que entra queda marcado como "En cancha".
- El contador de cambios del equipo se reduce en 1 (si NO involucra líbero).
- El cambio queda registrado en el historial del partido.
- La pizarra en vivo se actualiza mostrando el cambio.
