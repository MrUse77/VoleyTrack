package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.EquipoEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface EquipoSpringDataRepository extends CrudRepository<EquipoEntity, UUID> {
}
