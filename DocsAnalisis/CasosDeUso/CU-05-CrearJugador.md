# Tipo CU: Base

# Descripción:

El usuario administrador ingresa los datos de un nuevo jugador (Nombre, Apellido, Fecha de nacimiento, Posición y Dorsal) para registrarlo en el sistema.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona la opción "Crear Jugador".
2. El sistema muestra una interfaz y carga las posiciones. 
3. El administrador ingresa: Nombre, Apellido, Fecha de nacimiento, Dorsal y selecciona la posición.
4. El sistema registra al jugador y finaliza el CU.

# Flujo Alternativo:

El usuario administrado puede cancelar el CU antes del paso 4.

**FA-01: Dorsal duplicado en el equipo**

- 4.1 El sistema muestra un mensaje: “Dorsal duplicado, ingresar otro valor”
- El caso de uso continúa con el paso 3 del flujo normal

# Postcondiciones:

- El jugador queda registrado en el sistema con estado "Activo".
