package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.JugadorSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.JugadorEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.JugadorMapper;

import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.domain.Jugador;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Repository
public class JugadorRepositoryPortImpl implements JugadorRepositoryPort {

    private final JugadorSpringDataRepository repo;

    public JugadorRepositoryPortImpl(JugadorSpringDataRepository repo) {
        this.repo = repo;
    }

    @Override
    public Jugador guardar(Jugador jugador) {
        JugadorEntity entity = JugadorMapper.toEntity(jugador);
        if (repo.existsById(jugador.getId())) {
            entity.markPersisted();
        }
        JugadorEntity saved = repo.save(entity);
        return JugadorMapper.toDomain(saved);
    }

    @Override
    public Optional<Jugador> buscarPorId(UUID id) {
        return repo.findById(id).map(JugadorMapper::toDomain);
    }

    @Override
    public List<Jugador> buscarTodos() {
        return StreamSupport.stream(repo.findAll().spliterator(), false)
                .map(JugadorMapper::toDomain)
                .toList();
    }

    @Override
    public List<Jugador> buscarPorEquipo(UUID equipoId) {
        return repo.findByEquipoId(equipoId).stream()
                .map(JugadorMapper::toDomain)
                .toList();
    }
}
