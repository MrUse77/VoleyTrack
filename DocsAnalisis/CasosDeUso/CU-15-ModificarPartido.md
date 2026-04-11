# Tipo CU: Base

# Descripción:

El usuario administrador modifica los datos de un partido existente (equipos, fecha, hora) siempre que el partido no haya iniciado.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

- Crear partido

# Puntos de extensión: -

# Flujo Normal:

1. El administrador oprime en “Editar partido” e inicia el caso de uso.
2. El sistema muestra la interfaz y carga las fechas y horarios disponibles.
3. El administrador selecciona el nuevo horario y/o fecha y oprime en “Guardar”
4. El sistema muestra un mensaje de confirmación y finaliza el CU.

# Flujo Alternativo:

El administrador puede cancelar el caso de uso antes del paso 3

# Postcondiciones:

- Los datos del partido quedan actualizados en el sistema.
- El partido sigue en estado "Programado".
