# Tipo CU: Base

# Descripción:

El usuario administrador realiza una baja lógica de un equipo, desactivándolo en el sistema sin eliminar su historial.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Crear Equipo

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona el equipo e inicia el CU.
2. El sistema muestra una interfaz con las opciones.
3. El administrador oprime en “Eliminar equipo”.
4. El sistema elimina el equipo y finaliza el CU.

# Flujo Alternativo:

El administrador puede cancelar el CU antes del paso 3

**FA-01: Equipo en partido activo**

- 2.1. El sistema muestra un mensaje de error: "No se puede eliminar un equipo que está en un partido activo" y finaliza el CU.

# Postcondiciones:

- El equipo fue eliminado correctamente
- Todos los jugadores quedan desvinculados del equipo.
