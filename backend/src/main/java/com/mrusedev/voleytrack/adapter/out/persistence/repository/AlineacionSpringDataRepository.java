package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.AlineacionEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface AlineacionSpringDataRepository extends CrudRepository<AlineacionEntity, UUID> {

    List<AlineacionEntity> findBySetId(UUID setId);
}
