# Tipo CU: Base

# Descripción:

El usuario planillero selecciona al jugador que realizará el primer saque del set (al inicio del partido o de cada set, o en el tiebreak).

# Actor principal: Planillero

# Actor secundario: -

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Set](https://www.notion.so/Iniciar-Set-31e96131003a808394c7cddf38c87e83?pvs=21)

[Iniciar Sesión](https://www.notion.so/Iniciar-Sesi-n-32196131003a803cbab1e0dc5c788ac7?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El planillero oprime en asignar saque e inicia el CU
2. El sistema carga los equipos.
3. El planillero selecciona el equipo que sacará primero y oprime en: “Confirmar”
4. El sistema registra el equipo como sacador inicial y finaliza el caso de uso.
5. El sistema muestra un mensaje de confirmación.

# Flujo Alternativo:

**FA-02: Asignación automática en sets intermedios**

- 1.1. El sistema asigna como sacador al equipo que no saco el set anterior y finaliza el CU,.

# Postcondiciones:

- El jugador queda asignado como sacador inicial del set.
- El sistema puede validar quién debe sacar en cada rotación.
