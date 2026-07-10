package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.EquipoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EquipoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.EquipoMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Repository
public class EquipoRepositoryPortImpl implements EquipoRepositoryPort {

    private final EquipoSpringDataRepository repo;

    public EquipoRepositoryPortImpl(EquipoSpringDataRepository repo) {
        this.repo = repo;
    }

    @Override
    public Equipo guardar(Equipo equipo) {
        EquipoEntity entity = EquipoMapper.toEntity(equipo);
        if (repo.existsById(equipo.getId())) {
            entity.markPersisted();
        }
        EquipoEntity saved = repo.save(entity);
        return EquipoMapper.toDomain(saved);
    }

    @Override
    public Optional<Equipo> buscarPorId(UUID id) {
        return repo.findById(id).map(EquipoMapper::toDomain);
    }

    @Override
    public List<Equipo> buscarTodos() {
        return StreamSupport.stream(repo.findAll().spliterator(), false)
                .map(EquipoMapper::toDomain)
                .toList();
    }
}
