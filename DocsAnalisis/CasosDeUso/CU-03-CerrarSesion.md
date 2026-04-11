# Tipo CU: Base

# Descripción:

El usuario autenticado (Administrador o Planillero) cierra su sesión activa, invalidando su token de acceso.

# Actor principal: Administrador, Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Inciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El usuario selecciona la opción "Cerrar Sesión".
2. El sistema cierra la sesion y finaliza el CU.

# Flujo Alternativo:

No aplica.

# Postcondiciones:

- El usuario ya no tiene una sesión activa.
