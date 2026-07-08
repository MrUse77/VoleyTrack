package com.mrusedev.voleytrack.adapter.out.persistence.repository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.JugadorEntity;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.UUID;

public interface JugadorSpringDataRepository extends CrudRepository<JugadorEntity, UUID> {

    @Query("SELECT j.* FROM jugadores j JOIN plantel p ON j.id = p.jugador_id WHERE p.equipo_id = :equipoId AND p.activo = true")
    List<JugadorEntity> findByEquipoId(UUID equipoId);
}
