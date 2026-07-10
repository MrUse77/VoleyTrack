package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EventoEntity;

import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.Jugador;

import java.util.UUID;

public class EventoMapper {

    public static EventoEntity toEntity(Evento evento, UUID setId) {
        EventoEntity entity = new EventoEntity();
        entity.setId(evento.getId());
        entity.setSetId(setId);
        entity.setJugadorId(evento.getJugador().getId());
        entity.setTipoFundamento(evento.getTipoFundamento());
        entity.setCreadoEn(evento.getTimestamp());
        return entity;
    }

    public static Evento toDomain(EventoEntity entity, Jugador jugador) {
        return new Evento(entity.getId(), entity.getCreadoEn(), jugador, entity.getTipoFundamento());
    }
}
