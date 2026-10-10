-- ============================================================================
-- VoleyTrack — Schema V2 (español, esquema public)
-- Generado: 2026-10-09
-- Motor: PostgreSQL 16
-- ============================================================================

-- ═══ ALINEACIONES ═══

CREATE TABLE alineaciones (
    id         uuid PRIMARY KEY,
    set_id     uuid NOT NULL REFERENCES sets(id),
    equipo_id  uuid NOT NULL REFERENCES equipos(id),
    UNIQUE (set_id, equipo_id)
);

CREATE TABLE alineacion_jugadores (
    id                  uuid PRIMARY KEY,
    alineacion_id       uuid NOT NULL REFERENCES alineaciones(id),
    jugador_id          uuid NOT NULL REFERENCES jugadores(id),
    posicion            integer NOT NULL,
    es_titular          boolean NOT NULL DEFAULT true,
    es_sacador_inicial  boolean NOT NULL DEFAULT false,
    UNIQUE (alineacion_id, jugador_id)
);

-- ═══ ÍNDICES ═══

CREATE INDEX idx_alineaciones_set ON alineaciones(set_id);
CREATE INDEX idx_alineacion_jugadores_alineacion ON alineacion_jugadores(alineacion_id);
CREATE INDEX idx_alineacion_jugadores_jugador ON alineacion_jugadores(jugador_id);
