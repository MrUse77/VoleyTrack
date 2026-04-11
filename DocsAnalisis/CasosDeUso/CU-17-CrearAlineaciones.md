# Tipo CU: Base

# Descripción:

El usuario planillero selecciona 6 jugadores titulares y 1 líbero opcional del equipo para conformar la alineación inicial del set.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Sesión](https://www.notion.so/Iniciar-Sesi-n-32196131003a803cbab1e0dc5c788ac7?pvs=21)

[Iniciar Partido](https://www.notion.so/Iniciar-Partido-31e96131003a80e0bf9fe07380055c4a?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El planillero oprime en: “CrearAlineacion”.
2. El sistema muestra la interfaz y carga los jugadores del equipo.
3. Por cada posicion:
    1. El planillero oprime en la casilla de la posicion.
    2. El sistema muestra la lista de jugadores
    3. El planillero selecciona el jugador
4. El sistema muestra un vista previa.
5. El planillero oprime en: “Confirmar”.
6. El sistema muestra un mensaje de confirmación y finaliza el CU.

# Flujo Alternativo:

**FA-03: Líbero seleccionado como titular**

- 4.1 El planillero selecciona la casilla de libero
- 4.2 El sistema muestra los jugadores que son liberos
- 4.3 El planillero selecciona al libero.
- 4.4 El caso de uso continua en el pas 4.

# Postcondiciones:

- La alineacion del equipo queda registrado en el sistema.
