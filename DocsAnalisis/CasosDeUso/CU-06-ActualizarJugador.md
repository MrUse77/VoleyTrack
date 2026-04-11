# Tipo CU: Base

# Descripción:

El usuario administrador modifica los datos de un jugador existente (Nombre, Apellido, Fecha de nacimiento, Posición, Dorsal) y puede cambiar su estado.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Crear Jugador

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El administrador oprime en: “Editar Jugador”
2. El sistema muestra la interfaz y carga los datos del jugador seleccionado.
3. El administrador modifica los datos que desea actualizar y oprime en guardar.
4. El sistema actualiza los datos del jugador y finaliza el CU.

# Flujo Alternativo:

El usuario puede cancelar el caso de uso antes del paso 4

**FA-01: Datos inválidos**

- 4.1. El sistema muestra un mensaje: “Datos invalidos”
- 4.2. El caso de uso continua en el paso 3 del flujo normal

# Postcondiciones:

- Los datos del jugador quedan actualizados en el sistema.
