package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EventoEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface EventoSpringDataRepository extends CrudRepository<EventoEntity, UUID> {

    List<EventoEntity> findBySetId(UUID setId);
}
