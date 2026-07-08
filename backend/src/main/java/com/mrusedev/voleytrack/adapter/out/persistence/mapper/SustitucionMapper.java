package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SustitucionEntity;

import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Sustitucion;

import java.util.UUID;

public class SustitucionMapper {

    public static SustitucionEntity toEntity(Sustitucion sustitucion, UUID setId) {
        SustitucionEntity entity = new SustitucionEntity();
        entity.setId(sustitucion.getId());
        entity.setSetId(setId);
        entity.setEquipoId(sustitucion.getEquipo().getId());
        entity.setJugadorSaleId(sustitucion.getJugadorSale().getId());
        entity.setJugadorEntraId(sustitucion.getJugadorEntra().getId());
        entity.setTipo(sustitucion.getTipo());
        entity.setCreadoEn(sustitucion.getTimestamp());
        return entity;
    }

    public static Sustitucion toDomain(SustitucionEntity entity, Equipo equipo,
                                       Jugador jugadorSale, Jugador jugadorEntra) {
        return new Sustitucion(equipo, jugadorSale, jugadorEntra, entity.getTipo());
    }
}
