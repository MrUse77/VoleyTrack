package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.JugadorEntity;

import com.mrusedev.voleytrack.domain.Jugador;

public class JugadorMapper {

    public static JugadorEntity toEntity(Jugador jugador) {
        return new JugadorEntity(
                jugador.getId(),
                jugador.getNombre(),
                jugador.getApellido(),
                jugador.getFechaNacimiento(),
                jugador.getDorsal(),
                jugador.isActivo(),
                jugador.getPosicion()
        );
    }

    public static Jugador toDomain(JugadorEntity entity) {
        Jugador jugador = new Jugador(
                entity.getId(),
                entity.getNombre(),
                entity.getApellido(),
                entity.getFechaNacimiento(),
                entity.getDorsal(),
                entity.getPosicion()
        );
        if (!entity.isActivo()) {
            jugador.desactivar();
        }
        return jugador;
    }
}
