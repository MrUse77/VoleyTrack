# Tipo CU: Base

# Descripción:

El usuario (Administrador o Planillero) ingresa sus credenciales (email y contraseña) para acceder al sistema y realizar las operaciones permitidas según su rol.

# Actor principal: Invitado

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:-

# Puntos de extensión: -

# Flujo Normal:

1. El usuario invitado selecciona la opción "Iniciar Sesión".
2. El sistema muestra la interfaz.
3. El usuario invitado ingresa sus credenciales: Email y contraseña y oprime en: “Iniciar Sesion”.
4. El sistema redirige al dashboard (de admin o planillero dependiendo el tipo de usuario) y finaliza el CU.

# Flujo Alternativo:

El usuario puede finalizar el CU en cualquier momento oprimiendo en: “Cancelar”

**FA-01: Credenciales incorrectas**

- 4.1. El sistema muestra una mensaje: “Credenciales incorrectas”
- 4.2. El fluo sigue en el paso 3 del FN

# Postcondiciones:

- El usuario tiene una sesión activa con un token válido.
- El usuario puede acceder a las funcionalidades permitidas según su rol.

# Requisitos Relacionados:

- RF-17: Iniciar Sesión
- RNF-03: Las contraseñas deben almacenarse encriptadas
- RNF-04: Rutas protegidas mediante tokens de autenticación
