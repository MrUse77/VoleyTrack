package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.SetSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.PartidoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.SetMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.EventoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SustitucionRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.Sustitucion;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SetRepositoryPortImpl implements SetRepositoryPort {

    private final SetSpringDataRepository repo;
    private final PartidoSpringDataRepository partidoRepo;
    private final EquipoRepositoryPort equipoRepo;
    private final EventoRepositoryPort eventoRepo;
    private final SustitucionRepositoryPort sustitucionRepo;

    public SetRepositoryPortImpl(SetSpringDataRepository repo,
                                 PartidoSpringDataRepository partidoRepo,
                                 EquipoRepositoryPort equipoRepo,
                                 EventoRepositoryPort eventoRepo,
                                 SustitucionRepositoryPort sustitucionRepo) {
        this.repo = repo;
        this.partidoRepo = partidoRepo;
        this.equipoRepo = equipoRepo;
        this.eventoRepo = eventoRepo;
        this.sustitucionRepo = sustitucionRepo;
    }

    @Override
    public SetPartido guardar(SetPartido set, UUID partidoId) {
        SetEntity entity = SetMapper.toEntity(set, partidoId);
        if (repo.existsById(set.getId())) {
            entity.markPersisted();
        }
        repo.save(entity);
        return set;
    }

    @Override
    public Optional<SetPartido> buscarPorId(UUID id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public List<SetPartido> buscarPorPartido(UUID partidoId) {
        return repo.findByPartidoId(partidoId).stream()
                .map(this::toDomain)
                .toList();
    }

    private SetPartido toDomain(SetEntity entity) {
        // Load real equipos from the associated partido — never use stubs.
        PartidoEntity partidoEntity = partidoRepo.findById(entity.getPartidoId())
                .orElse(null);
        Equipo equipoLocal;
        Equipo equipoVisitante;
        if (partidoEntity != null) {
            equipoLocal = equipoRepo.buscarPorId(partidoEntity.getEquipoLocalId()).orElse(null);
            equipoVisitante = equipoRepo.buscarPorId(partidoEntity.getEquipoVisitanteId()).orElse(null);
        } else {
            equipoLocal = null;
            equipoVisitante = null;
        }
        SetPartido set = SetMapper.toDomain(entity, equipoLocal, equipoVisitante);
        // Restore serve ownership
        if (entity.getSaqueInicialId() != null) {
            Equipo saque = equipoRepo.buscarPorId(entity.getSaqueInicialId()).orElse(null);
            if (saque != null) {
                set.asignarSaqueInicial(saque);
            }
        }
        // Restore persisted events — point-by-point history must survive reload
        List<Evento> eventos = eventoRepo.buscarPorSet(entity.getId());
        set.restaurarEventos(eventos);
        // Restore persisted sustituciones
        List<Sustitucion> sustituciones = sustitucionRepo.buscarPorSet(entity.getId());
        set.restaurarSustituciones(sustituciones);
        return set;
    }
}
