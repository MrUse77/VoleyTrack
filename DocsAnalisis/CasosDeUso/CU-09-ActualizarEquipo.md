# Tipo CU: Base

# Descripción:

El usuario administrador modifica los datos de un equipo existente (Nombre del club, Entrenador) y puede cambiar su estado.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

- Crear Equipo

# Puntos de extensión: -

# Flujo Normal:

1. El administrador oprime en: “Editar equipo” e inicia el caso de uso
2. El sistema muestra la interfaz y carga los datos actuales del equipo en un formulario editable.
3. El administrador modifica los datos que desea actualizar y oprime: “Confirmar  cambios”.
4. El sistema muestra un mensaje de confirmación y finaliza el CU.

# Flujo Alternativo:

El administrador podra oprimir el boton cancelar antes del paso 3 y finalizar el CU.

**FA-01: Datos inválidos**

- 4.1. El sistema muestra un mensaje de error descriptivo.
- 4.2. El CU continua en el paso 2 del FN

**FA-02: Equipo en partido activo**.

- 4.1. El sistema muestra un mensaje: "El equipo está en un partido activo” y finaliza el CU.

**FA-03: Asignar Jugador**

- 3.1 El administrador oprime en: Agregar Jugadores
- 3.2 Se extiende al caso de uso Asignar Jugador

**FA-04: Desasignar un Jugador**

- 3.1Se extiende al caso de uso Desasignar Jugador

# Postcondiciones:

- Los datos del equipo quedan actualizados en el sistema.
- Los cambios se reflejan en todos los partidos asociados.
