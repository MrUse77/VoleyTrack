package com.mrusedev.voleytrack.adapter.out.persistence.repository;

import com.mrusedev.voleytrack.adapter.out.persistence.entity.EquipoEntity;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;

public interface EquipoSpringDataRepository extends CrudRepository<EquipoEntity, UUID> {}
