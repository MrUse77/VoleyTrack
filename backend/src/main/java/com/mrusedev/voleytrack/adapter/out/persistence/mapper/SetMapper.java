package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;

import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Lado;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.TipoLado;

import java.util.UUID;

public class SetMapper {

    public static SetEntity toEntity(SetPartido set, UUID partidoId) {
        SetEntity entity = new SetEntity();
        entity.setId(set.getId());
        entity.setPartidoId(partidoId);
        entity.setNumSet(set.getNumeroSet());
        entity.setEsTieBreak(set.isEsTieBreak());
        entity.setEstado(set.getEstado());
        entity.setPuntosLocal(set.getMarcador().getPuntos(set.getMarcador().getLadoLocal()));
        entity.setPuntosVisitante(set.getMarcador().getPuntos(set.getMarcador().getLadoVisitante()));
        entity.setCambiosLocal(set.getCambiosLocal().quedanDisponibles());
        entity.setCambiosVisitante(set.getCambiosVisitante().quedanDisponibles());
        if (set.getSaque() != null) {
            entity.setSaqueInicialId(set.getSaque().getId());
        }
        return entity;
    }

    public static SetPartido toDomain(SetEntity entity, Equipo equipoLocal, Equipo equipoVisitante) {
        Lado ladoLocal = new Lado(TipoLado.LOCAL, equipoLocal);
        Lado ladoVisitante = new Lado(TipoLado.VISITANTE, equipoVisitante);

        SetPartido set = new SetPartido(entity.getId(), entity.getNumSet(), entity.isEsTieBreak(), ladoLocal, ladoVisitante);
        // Restaurar marcador
        for (int i = 0; i < entity.getPuntosLocal(); i++) set.getMarcador().incrementar(ladoLocal);
        for (int i = 0; i < entity.getPuntosVisitante(); i++) set.getMarcador().incrementar(ladoVisitante);
        // Restaurar cambios
        int diffLocal = 6 - entity.getCambiosLocal();
        int diffVisit = 6 - entity.getCambiosVisitante();
        for (int i = 0; i < diffLocal; i++) set.getCambiosLocal().consumir();
        for (int i = 0; i < diffVisit; i++) set.getCambiosVisitante().consumir();
        // Restaurar estado
        if (entity.getEstado() == com.mrusedev.voleytrack.domain.EstadoSet.EN_CURSO
                || entity.getEstado() == com.mrusedev.voleytrack.domain.EstadoSet.FINALIZADO) {
            set.cambiarEstado(entity.getEstado());
        }
        return set;
    }
}
