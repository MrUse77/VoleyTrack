package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Evento;

import java.util.List;
import java.util.UUID;

public interface EventoRepositoryPort {

    Evento guardar(Evento evento, UUID setId);

    List<Evento> buscarPorSet(UUID setId);
}
