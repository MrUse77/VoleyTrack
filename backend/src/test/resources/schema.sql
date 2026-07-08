-- H2 schema para tests (Flyway deshabilitado en perfil test)
-- Compatible con H2 en modo PostgreSQL

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
