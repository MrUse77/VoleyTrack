# Tipo CU: Base

# Descripción:

El usuario autenticado (Administrador o Planillero) modifica su contraseña actual por una nueva.

# Actor principal: Administrador, Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El usuario selecciona la opción "Cambiar contraseña".
2. El sistema muestra la interfaz.
3. El usuario ingresa: Contraseña vieja, nueva contraseña y confirmacion de la nueva contraseña, y oprime en: “Cambiar”
4. El sistema muestra un mensaje de confirmacion, envía un email automático al usuario notificando el cambio de contraseña y finaliza el CU.

# Flujo Alternativo:

El usuario autenticado puede finalizar el CU en cualquier momento antes del paso 4 oprimiendo: “Cancelar”.

**FA-01: Contraseña actual incorrecta**

- 4.1. El sistema muestra un mensaje de error: "La contraseña actual es incorrecta".
- 4.2 El flujo continua en el paso 3 del FN.

**FA-02: Nueva contraseña no cumple políticas de seguridad**

- 4.1. El sistema muestra un mensaje de error: "La contraseña nueva no cumple con los requisitos".
- 4.2 El flujo continua en el paso 3 del FN.

**FA-03: Contraseñas nuevas no coinciden**

- 4.1. El sistema muestra un mensaje de error: "La contraseña nueva no coincide con la confirmacion".
- 4.2 El flujo continua en el paso 3 del FN.

**FA-04: Error en envío de email**

- 4.1. El sistema muestra un mensaje de error: "El mail no pudo ser enviado" y finaliza el CU.

# Postcondiciones:

- La contraseña del usuario queda actualizada.
- Se envía un email de notificación al usuario informando el cambio de contraseña.
