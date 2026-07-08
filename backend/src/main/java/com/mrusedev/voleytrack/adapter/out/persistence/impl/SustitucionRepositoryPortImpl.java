package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.SustitucionSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SustitucionEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.SustitucionMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SustitucionRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Sustitucion;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class SustitucionRepositoryPortImpl implements SustitucionRepositoryPort {

    private final SustitucionSpringDataRepository repo;
    private final EquipoRepositoryPort equipoRepo;
    private final JugadorRepositoryPort jugadorRepo;

    public SustitucionRepositoryPortImpl(SustitucionSpringDataRepository repo,
                                         EquipoRepositoryPort equipoRepo,
                                         JugadorRepositoryPort jugadorRepo) {
        this.repo = repo;
        this.equipoRepo = equipoRepo;
        this.jugadorRepo = jugadorRepo;
    }

    @Override
    public Sustitucion guardar(Sustitucion sustitucion, UUID setId) {
        SustitucionEntity entity = SustitucionMapper.toEntity(sustitucion, setId);
        if (repo.existsById(sustitucion.getId())) entity.markPersisted();
        repo.save(entity);
        return sustitucion;
    }

    @Override
    public List<Sustitucion> buscarPorSet(UUID setId) {
        return repo.findBySetId(setId).stream()
                .map(e -> {
                    Equipo eq = equipoRepo.buscarPorId(e.getEquipoId()).orElse(null);
                    Jugador sale = jugadorRepo.buscarPorId(e.getJugadorSaleId()).orElse(null);
                    Jugador entra = jugadorRepo.buscarPorId(e.getJugadorEntraId()).orElse(null);
                    return SustitucionMapper.toDomain(e, eq, sale, entra);
                })
                .toList();
    }
}
