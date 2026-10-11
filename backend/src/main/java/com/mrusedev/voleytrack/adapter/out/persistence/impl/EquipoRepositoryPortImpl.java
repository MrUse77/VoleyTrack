package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.EquipoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.JugadorSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EquipoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.JugadorEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.EquipoMapper;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.JugadorMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Repository
public class EquipoRepositoryPortImpl implements EquipoRepositoryPort {

    private final EquipoSpringDataRepository repo;
    private final JugadorSpringDataRepository jugadorRepo;

    public EquipoRepositoryPortImpl(EquipoSpringDataRepository repo,
                                    JugadorSpringDataRepository jugadorRepo) {
        this.repo = repo;
        this.jugadorRepo = jugadorRepo;
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
        return repo.findById(id).map(this::toDomain);
    }

    /** Carga en bloque: una sola consulta en vez de una por equipo (evita el N+1). */
    @Override
    public List<Equipo> buscarPorIds(Set<UUID> ids) {
        return StreamSupport.stream(repo.findAllById(ids).spliterator(), false)
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<Equipo> buscarTodos() {
        return StreamSupport.stream(repo.findAll().spliterator(), false)
                .map(this::toDomain)
                .toList();
    }

    private Equipo toDomain(EquipoEntity entity) {
        Equipo equipo = EquipoMapper.toDomain(entity);
        restaurarPlantel(equipo);
        return equipo;
    }

    /** Rehydrates the persisted roster — sin plantel el equipo vuelve sin jugadores. */
    private void restaurarPlantel(Equipo equipo) {
        List<JugadorEntity> filas = jugadorRepo.findByEquipoId(equipo.getId());
        for (JugadorEntity fila : filas) {
            Jugador jugador = JugadorMapper.toDomain(fila);
            if (jugador.isActivo()) {
                equipo.agregarJugador(jugador);
            }
        }
    }
}
