package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.UsuarioEntity;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UsuarioSpringDataRepository extends CrudRepository<UsuarioEntity, Long> {

    Optional<UsuarioEntity> findByEmail(String email);
}
