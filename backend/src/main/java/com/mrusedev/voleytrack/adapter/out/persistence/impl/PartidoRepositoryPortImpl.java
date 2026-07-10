package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.PartidoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.PartidoMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Repository
public class PartidoRepositoryPortImpl implements PartidoRepositoryPort {

    private final PartidoSpringDataRepository repo;
    private final EquipoRepositoryPort equipoRepo;
    private final SetRepositoryPort setRepo;

    public PartidoRepositoryPortImpl(PartidoSpringDataRepository repo,
                                     EquipoRepositoryPort equipoRepo,
                                     SetRepositoryPort setRepo) {
        this.repo = repo;
        this.equipoRepo = equipoRepo;
        this.setRepo = setRepo;
    }

    @Override
    public Partido guardar(Partido partido) {
        PartidoEntity entity = PartidoMapper.toEntity(partido);
        if (repo.existsById(partido.getId())) {
            entity.markPersisted();
        }
        repo.save(entity);
        return partido;
    }

    @Override
    public Optional<Partido> buscarPorId(UUID id) {
        return repo.findById(id).map(entity -> {
            Equipo local = equipoRepo.buscarPorId(entity.getEquipoLocalId()).orElse(null);
            Equipo visitante = equipoRepo.buscarPorId(entity.getEquipoVisitanteId()).orElse(null);
            Partido partido = PartidoMapper.toDomain(entity, local, visitante);
            // Restore persisted sets so the loaded match can continue scoring
            List<SetPartido> sets = setRepo.buscarPorPartido(id);
            partido.reconstruirSets(sets);
            return partido;
        });
    }

    @Override
    public List<Partido> buscarTodos() {
        return StreamSupport.stream(repo.findAll().spliterator(), false)
                .map(entity -> {
                    Equipo local = equipoRepo.buscarPorId(entity.getEquipoLocalId()).orElse(null);
                    Equipo visitante = equipoRepo.buscarPorId(entity.getEquipoVisitanteId()).orElse(null);
                    Partido partido = PartidoMapper.toDomain(entity, local, visitante);
                    List<SetPartido> sets = setRepo.buscarPorPartido(entity.getId());
                    partido.reconstruirSets(sets);
                    return partido;
                })
                .toList();
    }
}
