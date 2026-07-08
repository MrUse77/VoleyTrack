package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Jugador;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface JugadorRepositoryPort {

    Jugador guardar(Jugador jugador);

    Optional<Jugador> buscarPorId(UUID id);

    List<Jugador> buscarTodos();

    List<Jugador> buscarPorEquipo(UUID equipoId);
}
