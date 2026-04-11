# Tipo CU: Base

# Descripción:

El sistema inicia un nuevo set, reiniciando el marcador a 0-0, solicitando al planillero que asigne el saque inicial y habilitando la carga de puntos.

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Partido](https://www.notion.so/Iniciar-Partido-31e96131003a80e0bf9fe07380055c4a?pvs=21)

[Terminar Set](https://www.notion.so/Terminar-Set-31e96131003a80928f80fb4b14c3711b?pvs=21)

# Puntos de extensión:

- <<include>> Crear Alineacion
- <<extend>> Asignar saque inicial

# Flujo Normal:

1. El planillero oprimer en: “Proximo Set”.
2. El sistema muestra la interfaz de la cancha
3. Por cada equipo:
    1. Se incluye el caso de uso: Crear Alineaciones.
4. El sistema muestra una vista previa de las alineaciones en la cancha y asigna el saque al equipo que no inicio con el saque el anterior set.
5. El planillero oprime en: “confirmar inicio del partido”.
6. El sistema inicializa el marcador en 0-0, habilita la interfaz de carga de puntos y actualiza la transmision en vivo de la pizarra, y finaliza el CU.

# Flujo Alternativo:

**FA-01: Tiebreak (Set Definitivo)**

- 4.1. Se extiende el caso de uso: Asignar saque incial.
- 4.2. El sistema muestra una vista previa y marca el set actual como "Tiebreak".
- 4.3. Continua el caso de uso en el paso 5.

# Postcondiciones:

- El nuevo set queda iniciado con marcador 0-0.
- El contador de cambios de ambos equipos se reinicia a 6.
- El saque inicial queda asignado.
- La carga de puntos queda habilitada.
- La pizarra en vivo se actualiza mostrando el nuevo set.
