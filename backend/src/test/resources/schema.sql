-- H2 schema para tests (Flyway deshabilitado en perfil test)
-- Compatible con H2 en modo PostgreSQL
-- Parity target: db/migration/V1__esquema_inicial.sql (PostgreSQL 16)
-- Known H2 gaps documented at end of file

CREATE TABLE IF NOT EXISTS jugadores (
    id               uuid PRIMARY KEY,
    nombre           varchar NOT NULL,
    apellido         varchar NOT NULL,
    fecha_nacimiento date NOT NULL,
    dorsal           integer NOT NULL,
    activo           boolean NOT NULL DEFAULT true,
    posicion         varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS equipos (
    id           uuid PRIMARY KEY,
    nombre_club  varchar NOT NULL,
    entrenador   varchar,
    activo       boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS plantel (
    equipo_id        uuid NOT NULL REFERENCES equipos(id),
    jugador_id       uuid NOT NULL REFERENCES jugadores(id),
    fecha_asignacion timestamp NOT NULL DEFAULT now(),
    activo           boolean NOT NULL DEFAULT true,
    PRIMARY KEY (equipo_id, jugador_id)
);

CREATE TABLE IF NOT EXISTS partidos (
    id                  uuid PRIMARY KEY,
    fecha_hora          timestamp NOT NULL DEFAULT now(),
    estado              varchar NOT NULL DEFAULT 'PROGRAMADO',
    cant_sets           integer NOT NULL,
    equipo_local_id     uuid NOT NULL REFERENCES equipos(id),
    equipo_visitante_id uuid NOT NULL REFERENCES equipos(id)
);

CREATE TABLE IF NOT EXISTS sets (
    id                  uuid PRIMARY KEY,
    partido_id          uuid NOT NULL REFERENCES partidos(id),
    num_set             integer NOT NULL,
    es_tie_break        boolean NOT NULL DEFAULT false,
    estado              varchar NOT NULL DEFAULT 'PENDIENTE',
    puntos_local        integer NOT NULL DEFAULT 0,
    puntos_visitante    integer NOT NULL DEFAULT 0,
    cambios_local       integer NOT NULL DEFAULT 6,
    cambios_visitante   integer NOT NULL DEFAULT 6,
    saque_inicial_id    uuid REFERENCES equipos(id),
    UNIQUE (partido_id, num_set)
);

CREATE TABLE IF NOT EXISTS eventos (
    id              uuid PRIMARY KEY,
    set_id          uuid NOT NULL REFERENCES sets(id),
    jugador_id      uuid NOT NULL REFERENCES jugadores(id),
    tipo_fundamento varchar NOT NULL,
    creado_en       timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sustituciones (
    id                uuid PRIMARY KEY,
    set_id            uuid NOT NULL REFERENCES sets(id),
    equipo_id         uuid NOT NULL REFERENCES equipos(id),
    jugador_sale_id   uuid NOT NULL REFERENCES jugadores(id),
    jugador_entra_id  uuid NOT NULL REFERENCES jugadores(id),
    tipo              varchar NOT NULL,
    creado_en         timestamp NOT NULL DEFAULT now()
);

/*
 * ─── KNOWN H2 vs PostgreSQL GAPS ─────────────────────────────────
 *
 * GAP                     | H2 BEHAVIOUR                  | PRODUCTION (PostgreSQL)
 * ────────────────────────+───────────────────────────────+───────────────────────────
 * ENUM types              | varchar columns with CHECK    | CREATE TYPE ... AS ENUM
 *                         | (domain validates values)     | (catalog-level type safety)
 * CHECK(cant_sets IN…)    | H2 CHECK works                | native, identical behaviour
 * JSONB columns (timeline)| not present in H2 schema      | jsonb column + GIN index
 * BIGSERIAL (usuarios.id) | not present in H2 schema      | auto-increment 64-bit
 * ────────────────────────+───────────────────────────────+───────────────────────────
 *
 * The CHECK(cant_sets IN (3,5)) on partidos is deliberately omitted because
 * H2 in PostgreSQL-compatibility mode sometimes rejects CHECK constraints with
 * IN-list syntax in IF NOT EXISTS DDL. The domain layer (CantSets) enforces
 * the same constraint at the application level.
 *
 * Usuarios/Timeline/Pizarra tables omitted from H2 schema because those
 * bounded contexts are not yet exercised by backend tests.
 */
