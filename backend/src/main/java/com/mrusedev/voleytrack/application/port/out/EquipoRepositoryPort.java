package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Equipo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EquipoRepositoryPort {

    Equipo guardar(Equipo equipo);

    Optional<Equipo> buscarPorId(UUID id);

    List<Equipo> buscarTodos();
}
