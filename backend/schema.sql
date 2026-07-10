-- ============================================================================
-- VoleyTrack — Schema V1 (español, esquema public)
-- Generado: 2026-07-08
-- Motor: PostgreSQL 16
-- ============================================================================

-- ═══ ENUMS ═══

CREATE TYPE tipo_fundamento_enum AS ENUM (
    'SAQUE', 'ATAQUE', 'BLOQUEO', 'DEFENSA', 'RECEPCION',
    'ERROR_NO_FORZADO', 'ERROR_SAQUE'
);

CREATE TYPE posicion_enum AS ENUM (
    'ARMADOR', 'PUNTA_RECEPTOR', 'OPUESTO', 'CENTRAL', 'LIBERO'
);

CREATE TYPE rol_usuario_enum AS ENUM (
    'ADMIN', 'PLANILLERO'
);

CREATE TYPE estado_partido_enum AS ENUM (
    'PROGRAMADO', 'EN_CURSO', 'FINALIZADO'
);

CREATE TYPE estado_set_enum AS ENUM (
    'PENDIENTE', 'EN_CURSO', 'FINALIZADO'
);

CREATE TYPE tipo_sustitucion_enum AS ENUM (
    'REGULAR', 'LIBERO'
);

-- ═══ JUGADORES ═══

CREATE TABLE jugadores (
    id               uuid PRIMARY KEY,
    nombre           varchar NOT NULL,
    apellido         varchar NOT NULL,
    fecha_nacimiento date NOT NULL,
    dorsal           integer NOT NULL,
    activo           boolean NOT NULL DEFAULT true,
    posicion         posicion_enum NOT NULL
);

-- ═══ EQUIPOS ═══

CREATE TABLE equipos (
    id           uuid PRIMARY KEY,
    nombre_club  varchar NOT NULL,
    entrenador   varchar,
    activo       boolean NOT NULL DEFAULT true
);

-- ═══ PLANTEL (equipo ←→ jugador) ═══

CREATE TABLE plantel (
    equipo_id        uuid NOT NULL REFERENCES equipos(id),
    jugador_id       uuid NOT NULL REFERENCES jugadores(id),
    fecha_asignacion timestamp NOT NULL DEFAULT now(),
    activo           boolean NOT NULL DEFAULT true,
    PRIMARY KEY (equipo_id, jugador_id)
);

-- ═══ USUARIOS ═══

CREATE TABLE usuarios (
    id        bigserial PRIMARY KEY,
    nombre    varchar NOT NULL,
    apellido  varchar NOT NULL,
    email     varchar NOT NULL UNIQUE,
    password  varchar NOT NULL,
    dni       varchar,
    rol       rol_usuario_enum NOT NULL,
    telefono  varchar          -- solo PLANILLERO
);

-- ═══ PARTIDOS ═══

CREATE TABLE partidos (
    id                uuid PRIMARY KEY,
    fecha_hora        timestamp NOT NULL DEFAULT now(),
    estado            estado_partido_enum NOT NULL DEFAULT 'PROGRAMADO',
    cant_sets         integer NOT NULL CHECK (cant_sets IN (3, 5)),
    equipo_local_id   uuid NOT NULL REFERENCES equipos(id),
    equipo_visitante_id uuid NOT NULL REFERENCES equipos(id)
);

-- ═══ SETS ═══

CREATE TABLE sets (
    id                  uuid PRIMARY KEY,
    partido_id          uuid NOT NULL REFERENCES partidos(id),
    num_set             integer NOT NULL,
    es_tie_break        boolean NOT NULL DEFAULT false,
    estado              estado_set_enum NOT NULL DEFAULT 'PENDIENTE',
    puntos_local        integer NOT NULL DEFAULT 0,
    puntos_visitante    integer NOT NULL DEFAULT 0,
    cambios_local       integer NOT NULL DEFAULT 6,
    cambios_visitante   integer NOT NULL DEFAULT 6,
    saque_inicial_id    uuid REFERENCES equipos(id),
    UNIQUE (partido_id, num_set)
);

-- ═══ EVENTOS (play-by-play) ═══

CREATE TABLE eventos (
    id              uuid PRIMARY KEY,
    set_id          uuid NOT NULL REFERENCES sets(id),
    jugador_id      uuid NOT NULL REFERENCES jugadores(id),
    tipo_fundamento tipo_fundamento_enum NOT NULL,
    creado_en       timestamp NOT NULL DEFAULT now()
);

-- ═══ SUSTITUCIONES ═══

CREATE TABLE sustituciones (
    id                uuid PRIMARY KEY,
    set_id            uuid NOT NULL REFERENCES sets(id),
    equipo_id         uuid NOT NULL REFERENCES equipos(id),
    jugador_sale_id   uuid NOT NULL REFERENCES jugadores(id),
    jugador_entra_id  uuid NOT NULL REFERENCES jugadores(id),
    tipo              tipo_sustitucion_enum NOT NULL,
    creado_en         timestamp NOT NULL DEFAULT now()
);

-- ═══ PROYECCIONES ═══

CREATE TABLE pizarra_en_vivo (
    partido_id           uuid PRIMARY KEY REFERENCES partidos(id),
    equipo_local_nombre  varchar,
    equipo_visitante_nombre varchar,
    sets_local           integer NOT NULL DEFAULT 0,
    sets_visitante       integer NOT NULL DEFAULT 0,
    puntos_local         integer NOT NULL DEFAULT 0,
    puntos_visitante     integer NOT NULL DEFAULT 0,
    set_actual           integer NOT NULL DEFAULT 1,
    estado               estado_partido_enum NOT NULL DEFAULT 'PROGRAMADO'
);

CREATE TABLE timeline (
    evento_id      uuid PRIMARY KEY REFERENCES eventos(id),
    partido_id     uuid NOT NULL REFERENCES partidos(id),
    descripcion    text,
    marcador_json  jsonb,
    creado_en      timestamp NOT NULL DEFAULT now()
);

-- ═══ ÍNDICES ═══

CREATE INDEX idx_jugadores_activo ON jugadores(activo);
CREATE INDEX idx_equipos_activo ON equipos(activo);
CREATE INDEX idx_plantel_equipo ON plantel(equipo_id);
CREATE INDEX idx_plantel_jugador ON plantel(jugador_id);
CREATE INDEX idx_partidos_estado ON partidos(estado);
CREATE INDEX idx_sets_partido ON sets(partido_id);
CREATE INDEX idx_eventos_set ON eventos(set_id);
CREATE INDEX idx_eventos_jugador ON eventos(jugador_id);
CREATE INDEX idx_sustituciones_set ON sustituciones(set_id);
CREATE INDEX idx_sustituciones_equipo ON sustituciones(equipo_id);
CREATE INDEX idx_timeline_partido ON timeline(partido_id);
