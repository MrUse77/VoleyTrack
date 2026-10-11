package com.mrusedev.voleytrack.adapter.out.persistence.impl;

import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.PartidoMapper;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.PartidoSpringDataRepository;
import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;
import org.springframework.stereotype.Repository;

@Repository
public class PartidoRepositoryPortImpl implements PartidoRepositoryPort {

  private final PartidoSpringDataRepository repo;
  private final EquipoRepositoryPort equipoRepo;
  private final SetRepositoryPort setRepo;

  public PartidoRepositoryPortImpl(
      PartidoSpringDataRepository repo,
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
    return repo.findById(id)
        .map(
            entity -> {
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

    List<PartidoEntity> partidos =
        StreamSupport.stream(repo.findAll().spliterator(), false).toList();

    // IDs de todos los equipos necesarios
    Set<UUID> equipoIds =
        partidos.stream()
            .flatMap(p -> Stream.of(p.getEquipoLocalId(), p.getEquipoVisitanteId()))
            .collect(Collectors.toSet());

    // 1 sola query para todos los equipos
    Map<UUID, Equipo> equipos =
        equipoRepo.buscarPorIds(equipoIds).stream()
            .collect(Collectors.toMap(Equipo::getId, Function.identity()));

    Map<UUID, Partido> partidosMap =
        partidos.stream()
            .map(
                entity ->
                    PartidoMapper.toDomain(
                        entity,
                        equipos.get(entity.getEquipoLocalId()),
                        equipos.get(entity.getEquipoVisitanteId())))
            .collect(Collectors.toMap(Partido::getId, Function.identity()));

    Map<UUID, List<SetPartido>> setsPorPartido = setRepo.buscarPorPartidos(partidosMap);

    return partidosMap.values().stream()
        .map(
            partido -> {
              partido.reconstruirSets(setsPorPartido.getOrDefault(partido.getId(), List.of()));
              return partido;
            })
        .toList();
  }
}
