# Tipo CU: Base

# Descripción:

El usuario administrador ingresa los datos del planillero (DNI, Nombre, Apellido, Teléfono y Email) para registrarlo en el sistema y habilitarlo para gestionar partidos.

# Actor principal: Administrador

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

- Iniciar Sesion

# Puntos de extensión: -

# Flujo Normal:

1. El administrador selecciona la opción "Registrar Planillero".
2. El sistema muestra el formulario
3. El administrador ingresa Nombre, Apellido, DNI, Teléfono y Email, y pulsa en “Registrar”.
4. El sistema registra al planillero, le envia un mail notificando la creacion de la cuenta, muestra un mensaje de confirmacion y finaliza el CU

# Flujo Alternativo:

En cualquier momento del FN el usuario administrador puede cancelar el registro oprimiendo en: “Cancelar”

**FA-01: Datos inválidos o incompletos**

- 4.1. El sistema muestra un mensaje de error descriptivo.
- 4.2. El flujo continua en el paso 3.

**FA-02: Error en envío de email**

- 4.1. El sistema muestra un mensaje de error: “No se pudo enviar el mail, por favor intente de vuelta” y finaliza el CU

# Postcondiciones:

- El planillero queda registrado en el sistema.
- Se envía un email de notificación al planillero informando la creación de su cuenta.
