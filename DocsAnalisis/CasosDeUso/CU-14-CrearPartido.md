# Tipo CU: Base

# Descripción:

El usuario administrador crea un nuevo partido seleccionando el equipo local, el equipo visitante, y estableciendo la fecha y hora del encuentro.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Crear Equpo

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona la opción "Crear Partido" e inicia el caso de uso.
2. El sistema muestra la interfaz, y carga los equipos.
3. El administrador selecciona los equipos del listado de equipos activos.
4. El sistema muestra los datos de ambos equipos y carga la fecha y los horarios disponibles.
5. El administrador selecciona la fecha y hora del partido y oprime: “Crear”.
6. El sistema crea el partido con estado "Programado" y finaliza el CU.

# Flujo Alternativo:

**FA-01: Mismo equipo seleccionado**

- 4.1 El sistema muestra un mensaje de error: "Un equipo no puede jugar contra sí mismo".
- 4.2 Continua el caso de uso en el paso 3 del FN

# Postcondiciones:

- El partido queda registrado en el sistema con estado "Programado".
- El partido está disponible para que el planillero lo seleccione e inicie.
- El administrador puede visualizar el partido en el listado de partidos.
