# Tipo CU: Base

# Descripción:

El usuario administrador ingresa los datos de un nuevo equipo (Nombre del club y Entrenador) para registrarlo en el sistema.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona la opción "Crear Equipo"y comienza el CU.
2. El sistema muestra la interfaz
3. El administrador ingresa: Nombre del club y Entrenador
4. Por cada jugador
    1. Se incluye el CU: “Crear jugador”
5. El administrador oprime: “Crear”.
6. El sistema registra al equipo con estado "Activo" y finaliza el CU.

# Flujo Alternativo:

El administrador puede cancelar el caso de uso oprimiendo: “Cancelar” antes del paso 5

**FA-01: Datos inválidos o incompletos**

- 6.1. El sistema muestra un mensaje de error descriptivo.
- 6.2. Continua el caso de uso en el paso 3 del flujo normal

**FA-02: Nombre de club duplicado**

- 6.1. El sistema muestra un mensaje: "Ya existe un equipo con ese nombre".
- 6.2. Continua el caso de uso en el paso 3 del flujo normal

# Postcondiciones:

- El equipo queda registrado en el sistema con estado "Activo" y con sus jugadores agregados
