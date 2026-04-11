# Tipo CU: Base

# Descripción:

El usuario invitado (espectador) visualiza en tiempo real la pizarra del partido, mostrando el marcador actual, sets ganados, equipos y el historial punto a punto.

# Actor principal: Usuario Invitado

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Partido](https://www.notion.so/Iniciar-Partido-31e96131003a80e0bf9fe07380055c4a?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El usuario invitado accede a la sección "Partidos en Vivo" e inicia el caso de uso.
2. El sistema carga los partidos con estado "En curso".
3. El usuario invitado selecciona un partido para visualizar.
4. El sistema muestra la pizarra en tiempo real con:
    - Nombres de los equipos (Local vs Visitante)
    - Marcador actual del set en curso
    - Sets ganados por cada equipo
    - Historial de acciones recientes (punto a punto)
    - Sacador actual
5. El sistema actualiza la pizarra automáticamente tras cada evento y finaliza el caso de uso

# Flujo Alternativo:

**FA-01: No hay partidos en vivo**

- 2.1 El sistema muestra un mensaje: "No hay partidos en vivo en este momento" y finaliza el CU.

**FA-02: Partido finalizado mientras se visualiza**

- 5.1. El sistema muestra el resultado final y un mensaje: "Partido finalizado. [Equipo] ganó [Resultado]" y finaliza el CU.

# Postcondiciones:

- El usuario invitado visualiza la pizarra en tiempo real.
- La pizarra se actualiza automáticamente con cada evento del partido.
