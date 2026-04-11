# Tipo CU: Base

# Descripción:

El sistema cierra el set actual cuando un equipo alcanza la cantidad de puntos reglamentarios con la diferencia mínima de 2 puntos, suma un set ganado a ese equipo y habilita el inicio del siguiente set (o finaliza el partido si se cumple la condición de victoria).

# Actor principal: Sistema (automático)

# Actor secundario: Planillero

# Autor: Agustín Doricich

# Fecha de creación: 05/04/2026

# Precondiciones:

[Iniciar Partido](https://www.notion.so/Iniciar-Partido-31e96131003a80e0bf9fe07380055c4a?pvs=21)

# Puntos de extensión: -

# Flujo Normal:

1. El sistema muestra la interfaz de quien gano el set
2. El planillero oprime en “Confirmar”.
3. El sistema actualiza el contador de sets y finaliza el CU

# Flujo Alternativo: -

# Postcondiciones:

- El set actual queda marcado como "Finalizado".
- El equipo ganador tiene un set adicional sumado.
- El resultado final del set queda registrado.
- Se habilita el inicio del siguiente set.
- La pizarra en vivo se actualiza mostrando el resultado del set.
