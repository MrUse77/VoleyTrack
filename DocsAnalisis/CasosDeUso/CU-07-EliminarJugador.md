# Tipo CU: Base

# Descripción:

El usuario administrador realiza una baja lógica de un jugador, desactivándolo en el sistema sin eliminar su historial.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

- Crear Jugador

# Puntos de extensión: -

# Flujo Normal:

1. El administrador oprime en la opcion: “Eliminar Jugador”.
2. El sistema muestra la interfaz de confirmacion.
3. El administrador oprime en: “Eliminar”
4. El sistema muestra un mensaje: “Jugador eliminado correctamente” y finaliza el CU.

# Flujo Alternativo:

El usuario puede cancelar el caso de uso antes del paso 3 oprimiendo: “Cancelar”

**FA-01: Jugador en partido activo**

- 4.1. El sistema muestra un mensaje de error: “Jugador en partido” y finaliza el CU.

# Postcondiciones:

- El jugador es eliminado correctamente.
