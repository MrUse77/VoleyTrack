package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Sustitucion;

import java.util.List;
import java.util.UUID;

public interface SustitucionRepositoryPort {

    Sustitucion guardar(Sustitucion sustitucion, UUID setId);

    List<Sustitucion> buscarPorSet(UUID setId);
}
