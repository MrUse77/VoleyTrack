package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface SetSpringDataRepository extends CrudRepository<SetEntity, UUID> {

    List<SetEntity> findByPartidoId(UUID partidoId);
}
