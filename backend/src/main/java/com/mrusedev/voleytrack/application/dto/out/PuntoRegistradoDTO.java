package com.mrusedev.voleytrack.application.dto.out;

import java.util.UUID;

public record PuntoRegistradoDTO(
    UUID equipoId,
    UUID jugadorId,
    String jugadorNombre,
    String jugadorApellido,
    String fundamento,
    int numeroSet) {}
