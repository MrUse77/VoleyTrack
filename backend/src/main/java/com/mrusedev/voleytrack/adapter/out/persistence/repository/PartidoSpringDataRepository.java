package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface PartidoSpringDataRepository extends CrudRepository<PartidoEntity, UUID> {
}
