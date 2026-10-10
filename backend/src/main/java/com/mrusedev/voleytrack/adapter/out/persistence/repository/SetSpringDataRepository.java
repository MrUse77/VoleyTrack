package com.mrusedev.voleytrack.adapter.out.persistence.repository;

import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface SetSpringDataRepository extends CrudRepository<SetEntity, UUID> {

  List<SetEntity> findByPartidoId(UUID partidoId);

  List<SetEntity> findByPartidoIdIn(Collection<UUID> partidoIds);
}
