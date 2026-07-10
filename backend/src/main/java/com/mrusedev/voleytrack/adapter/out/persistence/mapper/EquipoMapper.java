package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EquipoEntity;

import com.mrusedev.voleytrack.domain.Equipo;

public class EquipoMapper {

    public static EquipoEntity toEntity(Equipo equipo) {
        return new EquipoEntity(
                equipo.getId(),
                equipo.getNombreClub(),
                equipo.getEntrenador(),
                equipo.isActivo()
        );
    }

    public static Equipo toDomain(EquipoEntity entity) {
        Equipo equipo = new Equipo(
                entity.getId(),
                entity.getNombreClub(),
                entity.getEntrenador()
        );
        if (!entity.isActivo()) {
            equipo.desactivar();
        }
        return equipo;
    }
}
