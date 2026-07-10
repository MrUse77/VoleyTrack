# VoleyTrack

# Descripción

VoleyTrack es un sistema  de seguimiento de partidos, torneos y estadísticas de cada equipo y jugador en tiempo real.

## Función Principal

- Registro y análisis estadístico de partidos
- Seguimiento de partidos en tiempo real

## Limite

### Seguimiento de partidos en tiempo real

El Sistema inicia el seguimiento del partido cuando el planillero carga los datos de los equipos, sus jugadores en cancha, libero (opcional) y oprime en “iniciar partido”,  habilitando la visualización en vivo de la pizarra para los espectadores. El sistema da por finalizado el proceso, cuando un equipo cumple la cantidad de sets necesarios (2 o 3) marcando el fin del partido cerrando la transmisión en vivo del encuentro.

### Registro y análisis estadístico de partidos

El sistema inicia el registro de un punto cuando el planillero selecciona al jugador que ha hecho el punto (o contrariamente haya cometido un error no forzado) y selecciona que tipo de punto fue (saque, bloqueo o cualquier otra accion). El sistema da por finalizado el proceso estadístico cuando finaliza el partido y se genera el reporte de métricas y eficacias consolidadas de ambos equipos

## Alcance

### Funcionalidades incluidas

- **Gestión de equipos y jugadores:** Alta, edición y visualización (CRUD) de perfiles de jugadores y conformación de planteles, como paso previo indispensable para la habilitación de un encuentro.
- **Configuración del encuentro:** Carga previa de la planilla del partido, especificando los equipos, jugadores convocados, titulares y líberos.
- **Captura de eventos (Play-by-play):** Registro detallado de cada acción del juego en la cancha (saques, ataques, bloqueos, defensas, errores no forzados) asociadas a un jugador específico.
- **Cálculo de métricas:** Procesamiento de los datos ingresados para generar estadísticas de rendimiento, tanto individuales (ej. eficacia de ataque) como colectivas, al finalizar el encuentro.
- **Transmisión de pizarra en vivo:** Actualización y visualización del marcador, sets ganados y rotación actual en tiempo real para los usuarios que siguen el partido en modalidad espectador.
- **Historial de acciones:** Visualización de una línea de tiempo en vivo con los últimos eventos registrados por el planillero.

### Comunicación con Sistemas Externos

No aplica

### Funcionalidades no incluidas

- **Gestión administrativa de torneos:** El sistema no armará llaves de campeonatos, tablas de posiciones generales ni programará calendarios. Solo se enfoca en el partido individual.
- **Gestión financiera del club:** No se administrarán pagos de cuotas sociales, sueldos de entrenadores ni venta de entradas.
- **Análisis del Challenge:** El sistema será puramente de registro de datos tabulares; no admitirá la carga de vídeos del partido para análisis de jugadas ni repeticiones.
- **Interacción social:** No se incluirán foros, chats en vivo entre espectadores ni integración directa para compartir automáticamente en redes sociales.

## Actores

- Usuario invitado
- Planillero
- Admin

## Requisitos Funcionales

### RF-1: Alta de Jugador

El sistema voleyTrack debe permitir al usuario administrador registrar un nuevo jugador ingresando: Nombre, Apellido, Fecha de nacimiento, Posición y Dorsal. Ademas de poder vincularlo a un equipo. 

### RF-2: Gestión de Jugador

El sistema voleyTrack debe permitir al usuario administrador modificar los datos de un jugador existente, realizar una “baja lógica” y poder vincularlo a un equipo.

### RF-3: Alta de Equipo

El sistema voleyTrack debe permitir al usuario administrador registrar un nuevo equipo ingresando: Nombre del club y Entrenador.

### RF-4: Gestión de Equipo

El sistema voleyTrack debe permitir al usuario administrador modificar los datos de un equipo existente y realizar una “baja lógica”. 

### RF-5: Conformación de plantel

El sistema voleyTrack debe permitir al usuario administrador asignar y desasignar jugadores existentes a un equipo especifico para conformar su lista de buena fe.

### RF-6: Creación del encuentro

El sistema voleyTrack debe permitir al usuario administrador crear un partido seleccionando un “Equipo Local” y un “Equipo Visitante” de la base de datos, ademas de establecer la fecha y hora

### RF-7: Selección de encuentro

El sistema voleyTrack debe permitir al planillero elegir el partido a disputarse en el momento

### RF-8: Selección Alineación

El sistema voleyTrack debe permitir al usuario planillero seleccionar 6 jugadores titulares y 1 libero (opcional) de cada equipo a partir de sus respectivos planteles, al inicio de cada set.

### RF-9: Inicio del partido

El sistema voleyTrack debe permitir al usuario planillero (luego de haber seleccionado la alineacion), comenzar el partido y cambiar su estado a “En curso”, habilitando la interfaz de carga de puntos

### RF-10: Registro de punto

- **Actor:** Planillero.
- **Datos de entrada:** Jugador involucrado, Tipo de fundamento técnico (Saque, Ataque, Bloqueo, etc.) y Resultado de la acción (Punto a favor, Error no forzado).
- **Escenario Normal:** El sistema *voleyTrack* permite al usuario planillero registrar una acción. El sistema suma automáticamente un (1) punto al marcador del equipo correspondiente, actualiza la pizarra y cambia el sacador. El set continúa habilitado.
- **Flujos Alternativos:**
    - **Alternativa A (Fin de Set Normal):** Si al sumar el punto un equipo llega a 25 puntos con una diferencia igual o mayor a 2 puntos sobre el rival, el sistema cierra el set actual, suma un set ganado a ese equipo y habilita el inicio del siguiente set.
    - **Alternativa B (Deuce / Alargue):** Si ambos equipos empatan en 24 puntos (o 14 puntos en un tie-break), el sistema desactiva el límite fijo y exige que el set continúe hasta que uno de los equipos logre una ventaja exacta de 2 puntos (ej. 26-24, 27-25).
    - **Alternativa C (Tie-break / Set Definitivo):** Si el partido llega empatado al último set (ej. 2 a 2 en un partido al mejor de 5), el sistema configura automáticamente el límite de ese set a 15 puntos en lugar de 25, manteniendo la regla de la diferencia de 2 puntos.
    - **Alternativa D (Fin del Partido):** Si al ganar un set, el equipo alcanza la cantidad de sets necesarios para ganar el encuentro (ej. 3 sets ganados), el sistema cambia el estado del partido a "Finalizado", bloquea la carga de nuevas acciones y genera el reporte final.

### RF-11: Registrar cambio de jugador

- **Actor:** Planillero.
- **Datos de entrada:** Jugador que sale (en cancha) y Jugador que entra (en banca).
- **Escenario Normal (Sustitución Regular):** El sistema *voleyTrack* permite registrar el cambio. El sistema actualiza el estado de los jugadores (quién está en cancha y quién en banca) y **descuenta uno (1) a la cantidad de cambios restantes del equipo en ese set**.
- **Flujos Alternativos:**
    - **Alternativa A (Reemplazo de Líbero):** Si el jugador que entra o sale tiene el rol de "Líbero", el sistema registra el movimiento en la cancha, pero **no descuenta** nada del contador de cambios regulares del equipo.
    - **Alternativa B (Límite Alcanzado):** Si el equipo ya agotó sus 6 cambios reglamentarios en el set actual y el cambio no involucra a un líbero, el sistema **bloquea la acción** y muestra un mensaje de error indicando que no hay cambios disponibles.

### RF-12: Asignar saque incial

El sistema voleyTrack debe permitir al usuario planillero seleccionar al sacador al inicio del partido. En cada set, el sistema ira alternando automáticamente al sacador. Si el partido llega al tiebrake, el sistema debe permitir al usuario planillero volver a seleccionar al sacador al principio de este.

### RF-13: Pizarra en vivo

El sistema voleyTrack debe permitir al usuario invitado visualizar los partidos, en tiempo real, mostrando el marcador actual, sets ganados, equipos y el punto a punto.

### RF-14: Estadísticas en vivo

El sistema voleyTrack debe permitir al usuario invitado visualizar las estadísticas del partido en tiempo real, mostrando la cantidad de puntos por categorías, diferenciadas por sets, así como también diferentes estadísticas de cada jugador (ATK, BLOQ, SAQ, ENF).

### RF-15: Registrar planillero

El sistema voleyTrack debe permitir al usuario administrador crear una cuenta con el rol de planillero, solicitando: Nombre, Apellido, DNI, Telefono y Email.

### RF-16: Envio de notificacion de creacion

El sistema voleyTrack debe enviar automáticamente un mail al usuario planillero notificando la creación de su usuario.

### RF-17: Iniciar Sesión

El sistema voleyTrack debe permitir iniciar sesión en la aplicación.

### RF-18: Cambio de contraseña

El sistema voleyTrack debe permitir a un usuario autenticado poder cambiar su contraseña.

### RF-19: Envío de notificación de cambio de contraseña

El sistema voleyTrack debe enviar automáticamente un mail al usuario autenticado notificando el cambio de contraseña.

## Requisitos No Funcionales

### RNF-UI-01

El sistema debe proveer retroalimentación visual inmediata al usuario en todas las transacciones, mostrando notificaciones (toasts/modales) de color verde para operaciones exitosas y de color rojo descriptivo cuando fallen las validaciones de negocio.

### RNF-01

El sistema debe actualizar la pizarra en vivo y las estadísticas (vía WebSockets) en un tiempo máximo de 1.5 segundos tras el registro de un evento, garantizando la experiencia en tiempo real

### RNF-02

El sistema debe garantizar la integridad transaccional (ACID) al registrar un punto; si la actualización del marcador o la estadística del jugador falla, se debe revertir toda la operación (Rollback) para evitar desfasajes.

### RNF-03

Las contraseñas de todos los usuarios (Admins y Planilleros) deben almacenarse en la base de datos de forma encriptada

### RNF-04

Las rutas de la API relacionadas con la creación de partidos y carga de puntos deben estar protegidas mediante tokens de autenticación, denegando el acceso a usuarios no autorizado.

### RNF-05

La interfaz del “Planillero” debe estar diseñada bajo un enfoque Mobile-First, optimizada para ser utilizada fluidamente en tablets o teléfonos móviles durante el desarrollo de un partido.

### RNF-06

El backend del sistema debe ser desarrollado utilizando el lenguaje Java y el framework  Spring Boot.

### RNF-07

El frontend del sistema debe ser desarrollado utilizando la bibilioteca React.

### RNF-08

La persistencia de datos relacionales debe gestionarse utilizando el motor de base de datos PostgreSQL.

### RNF-09

El sistema debe poder ser desplegado y ejecutado en cualquier navegador web moderno sin necesidad de instalar plugins adicionales

## Reglas de Negocio

### RN-01: Puntos de set regular

En un set regular (no tiebreak) es ganado por el equipo que primero anota 25 puntos, teniendo una diferencia minima de 2 puntos con el rival.

### RN-02: Deuce

En caso de empate 24-24 (o 14-14 en tiebreak), el set se va deuce, donde el juego continua hasta que un equipo llegue a lograr la diferencia mínima de 2 puntos con el rival.

### RN-03: Tiebrake

En caso de empate de sets (2-2 o 1-1 dependiendo de la cantidad de sets), el ultimo set sera mas corto, siendo que en vez de tener que anotar 25 puntos con una diferencia mínima de 2 puntos con el rival, se deben anotar 15 puntos con una diferencia mínima de 2 puntos con el rival, habiendo un cambio de lado cuando un equipo llega a 8 puntos.

### RN-04: Condicion de victoria

Un partido puede tener la cantidad de 5 o 3 sets para jugarse. Siendo que si la cantidad es 5, para ganar el partido se deben haber ganado 3 de los 5. Si el partido tiene una cantidad de 3 sets, el primero en ganar 2, ganara el partido.

### RN-05: Limite de sustituciones

Cada equipo tiene derecho a un máximo de seis (6) sustituciones regulares por set.

### RN-06: Excepcion del libero

Los reemplazos que involucran al jugador con el rol de "Líbero" son ilimitados y no se contabilizan dentro del límite establecido en la RN-04.

