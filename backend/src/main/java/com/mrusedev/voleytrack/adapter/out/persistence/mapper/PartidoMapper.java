package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;

import com.mrusedev.voleytrack.domain.*;

import java.util.stream.Collectors;

public class PartidoMapper {

    public static PartidoEntity toEntity(Partido partido) {
        PartidoEntity entity = new PartidoEntity();
        entity.setId(partido.getId());
        entity.setFechaHora(partido.getFechaHora());
        entity.setEstado(partido.getEstado());
        entity.setCantSets(partido.getCantSets().getCantidad());

        // Extraer IDs de los Lados
        for (Lado lado : partido.getLados()) {
            if (lado.getTipo() == TipoLado.LOCAL) {
                entity.setEquipoLocalId(lado.getEquipo().getId());
            } else {
                entity.setEquipoVisitanteId(lado.getEquipo().getId());
            }
        }
        return entity;
    }

    public static Partido toDomain(PartidoEntity entity, Equipo equipoLocal, Equipo equipoVisitante) {
        Partido partido = new Partido(entity.getId(), entity.getFechaHora(),
                equipoLocal, equipoVisitante,
                new CantSets(entity.getCantSets()));
        partido.cambiarEstado(entity.getEstado());
        return partido;
    }
}
