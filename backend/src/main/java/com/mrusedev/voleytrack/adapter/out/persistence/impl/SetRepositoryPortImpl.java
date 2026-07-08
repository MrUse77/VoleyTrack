package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.SetSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.SetMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.SetPartido;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class SetRepositoryPortImpl implements SetRepositoryPort {

    private final SetSpringDataRepository repo;
    private final EquipoRepositoryPort equipoRepo;

    public SetRepositoryPortImpl(SetSpringDataRepository repo, EquipoRepositoryPort equipoRepo) {
        this.repo = repo;
        this.equipoRepo = equipoRepo;
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
        // Equipos se necesitan para reconstruir Lado. Los obtenemos del partido asociado.
        // Por simplicidad, usamos stubs — la reconstrucción completa la hace el servicio de aplicación.
        return SetMapper.toDomain(entity,
                new Equipo(UUID.randomUUID(), "stub-local", "stub"),
                new Equipo(UUID.randomUUID(), "stub-visitante", "stub"));
    }
}
