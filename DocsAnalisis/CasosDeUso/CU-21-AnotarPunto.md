# Tipo CU: Base

# Descripción:

El usuario planillero registra un punto anotado por un jugador, indicando el tipo de fundamento técnico (Saque, Ataque, Bloqueo, etc.) y el resultado de la acción (Punto a favor o Error rival). El sistema actualiza el marcador, la pizarra en vivo y verifica si se cumple alguna condición de fin de set o partido.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Partido

# Puntos de extensión:

- <<extend>> CU-24: Terminar Set (si se cumple la condición de victoria del set)
- <<extend>> CU-25: Terminar Partido (si se cumple la condición de victoria del partido)

# Flujo Normal:

1. El planillero selecciona la opción "Anotar Punto" e inicia el caso de uso.
2. El sistema muestra la interfaz y carga los nombres de los equipos.
3. El planillero selecciona el equipo que suma el punto.
4. El sistema carga a los jugadores titulares del equipo
5. El planillero selecciona el jugador que hizo el punto.
6. El sistema carga los tipos de puntos y los resultados.
7. El planillero selecciona el tipo de punto (Saque, Ataque, Bloqueo, Defensa, Otro)  y resultado (A favor, Error Rival).
8. El sistema muestra una vista previa del marcador.
9. El planillero oprime en: “Confirmar”.
10. El sistema actualiza la pizarra en vivo, las estadisticas, marcador, muestra mensaje de confirmacion y finaliza el CU.

# Flujo Alternativo:

El planillero puede cancelar el caso de uso en cualquier momento antes del paso 9

**FA-01: Fin de Set Normal (25 puntos con diferencia de 2)**

- 10.1. Se extiende el caso de uso Terminar Set.
- 10.2 El sistema actualiza la pizarra en vivo, las estadisticas, marcador, muestra mensaje de confirmacion y finaliza el CU

**FA-04: Fin del Partido**

- 10.1. Se extien el caso de uso Terminar Partido
- 10.2 El sistema actualiza la pizarra en vivo, las estadisticas, marcador, muestra mensaje de confirmacion y finaliza el CU

# Postcondiciones:

- El marcador del equipo se incrementa en 1 punto.
- La acción queda registrada en el historial del partido.
- Las estadísticas del jugador y del equipo se actualizan.
- La pizarra en vivo se actualiza para los espectadores.
- El sacador cambia si corresponde.
- Si se cumple la condición, el set o el partido finalizan.
