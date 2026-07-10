package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Partido;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PartidoRepositoryPort {

    Partido guardar(Partido partido);

    Optional<Partido> buscarPorId(UUID id);

    List<Partido> buscarTodos();
}
