package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.EventoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EventoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.EventoMapper;

import com.mrusedev.voleytrack.application.port.out.EventoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.Jugador;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class EventoRepositoryPortImpl implements EventoRepositoryPort {

    private final EventoSpringDataRepository repo;
    private final JugadorRepositoryPort jugadorRepo;

    public EventoRepositoryPortImpl(EventoSpringDataRepository repo, JugadorRepositoryPort jugadorRepo) {
        this.repo = repo;
        this.jugadorRepo = jugadorRepo;
    }

    @Override
    public Evento guardar(Evento evento, UUID setId) {
        EventoEntity entity = EventoMapper.toEntity(evento, setId);
        if (repo.existsById(evento.getId())) entity.markPersisted();
        repo.save(entity);
        return evento;
    }

    @Override
    public List<Evento> buscarPorSet(UUID setId) {
        return repo.findBySetId(setId).stream()
                .map(e -> {
                    Jugador j = jugadorRepo.buscarPorId(e.getJugadorId()).orElse(null);
                    return EventoMapper.toDomain(e, j);
                })
                .toList();
    }
}
