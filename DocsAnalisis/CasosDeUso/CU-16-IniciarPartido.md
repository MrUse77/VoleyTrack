# Tipo CU: Base

# Descripción:

El usuario planillero selecciona un partido programado, define las alineaciones de ambos equipos, asigna el saque inicial y cambia el estado del partido a "En curso", habilitando la carga de puntos y la visualización en vivo para espectadores.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

- Crear partido

# Puntos de extensión:

- <<include>> CU-17: Crear Alineaciones
- <<include>> CU-19: Asignar saque inicial

# Flujo Normal:

1. El planillero selecciona el partido, oprime “Iniciar Partido” e inicia el caso de uso.
2. Por cada equipo:
    1. Se incluye el caso de uso: Crear Alineaciones.
3. El sistema muestra una vista previa de las alineaciones en la cancha
4. Se incluye el caso de uso: Asignar saque inicial
5. El planillero oprime en: “confirmar inicio del partido”.
6. El sistema cambia el estado del partido a "En curso", inicializa el marcador en 0-0, habilita la interfaz de carga de puntos y la transmision en vivo de la pizarra, finaliza el CU.

# Flujo Alternativo:

El planillero puede cancelar el caso de uso antes del paso 5.

# Postcondiciones:

- El partido cambia de estado "Programado" a "En curso".
- La interfaz de carga de puntos queda habilitada para el planillero.
- La pizarra en vivo queda disponible para los espectadores.
- El marcador inicia en 0-0, Set 1.
