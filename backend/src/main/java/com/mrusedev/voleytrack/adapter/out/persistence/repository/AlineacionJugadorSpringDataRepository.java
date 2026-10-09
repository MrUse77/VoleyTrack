package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.AlineacionJugadorEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface AlineacionJugadorSpringDataRepository extends CrudRepository<AlineacionJugadorEntity, UUID> {

    List<AlineacionJugadorEntity> findByAlineacionId(UUID alineacionId);
}
