package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.AlineacionEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.AlineacionJugadorEntity;

import com.mrusedev.voleytrack.domain.Alineacion;
import com.mrusedev.voleytrack.domain.AlineacionJugador;
import com.mrusedev.voleytrack.domain.Jugador;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;

public class AlineacionMapper {

    /** Deterministic header id so re-saves stay stable across sessions. */
    public static AlineacionEntity toEntity(Alineacion alineacion, UUID setId) {
        AlineacionEntity entity = new AlineacionEntity();
        UUID equipoId = alineacion.getEquipo().getId();
        entity.setId(UUID.nameUUIDFromBytes((setId + ":" + equipoId).getBytes(StandardCharsets.UTF_8)));
        entity.setSetId(setId);
        entity.setEquipoId(equipoId);
        return entity;
    }

    /** One row per player; ids are deterministic on (alineacionId, jugadorId). */
    public static List<AlineacionJugadorEntity> toJugadorEntities(Alineacion alineacion, UUID alineacionId) {
        List<AlineacionJugadorEntity> filas = new ArrayList<>();
        for (AlineacionJugador aj : alineacion.getJugadoresEnCancha()) {
            UUID jugadorId = aj.getJugador().getId();
            AlineacionJugadorEntity fila = new AlineacionJugadorEntity();
            fila.setId(UUID.nameUUIDFromBytes(
                    (alineacionId + ":" + jugadorId).getBytes(StandardCharsets.UTF_8)));
            fila.setAlineacionId(alineacionId);
            fila.setJugadorId(jugadorId);
            fila.setPosicion(aj.getPosicion());
            fila.setEsTitular(aj.isEsTitular());
            fila.setEsSacadorInicial(aj.isEsSacadorInicial());
            filas.add(fila);
        }
        return filas;
    }

    /**
     * Rehydrates an existing {@link Alineacion} (attachment is owned by
     * {@code SetPartido.crearAlineacion}). Unknown players are skipped.
     */
    public static void restaurar(Alineacion alineacion,
                                 List<AlineacionJugadorEntity> filas,
                                 Function<UUID, Jugador> cargarJugador) {
        for (AlineacionJugadorEntity fila : filas) {
            Jugador jugador = cargarJugador.apply(fila.getJugadorId());
            if (jugador == null) {
                continue;
            }
            alineacion.agregarJugador(jugador, fila.getPosicion(), fila.isEsTitular());
            if (fila.isEsSacadorInicial()) {
                AlineacionJugador agregado = alineacion.getJugadorEnPosicion(fila.getPosicion());
                if (agregado != null) {
                    agregado.marcarComoSacadorInicial();
                }
            }
        }
    }
}
