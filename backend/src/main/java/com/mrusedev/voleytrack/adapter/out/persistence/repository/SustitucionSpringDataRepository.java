package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SustitucionEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface SustitucionSpringDataRepository extends CrudRepository<SustitucionEntity, UUID> {

    List<SustitucionEntity> findBySetId(UUID setId);
}
