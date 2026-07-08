package com.mrusedev.voleytrack.application.dto;

import java.util.List;
import java.util.UUID;

public record OpcionesPuntoDTO(
        UUID equipoId,
        String equipoNombre,
        List<JugadorOpcionDTO> jugadores
) {

    public record JugadorOpcionDTO(
            UUID id,
            String nombre,
            String apellido,
            int dorsal,
            boolean enCancha
    ) {}
}
