package com.mrusedev.voleytrack.application.dto.out;

import java.util.List;
import java.util.UUID;

public record AlineacionPreviewDTO(
        UUID equipoId,
        String equipoNombre,
        List<JugadorEnPosicionDTO> jugadores
) {

    public record JugadorEnPosicionDTO(
            UUID jugadorId,
            String nombre,
            String apellido,
            int dorsal,
            int posicionEnCancha,
            boolean esTitular
    ) {}
}
