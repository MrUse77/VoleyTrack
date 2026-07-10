package com.mrusedev.voleytrack.application.dto;

import java.util.List;
import java.util.UUID;

public record EquiposDTO(
        EquipoDTO local,
        EquipoDTO visitante,
        int setActual,
        int puntosLocal,
        int puntosVisitante
) {

    public record EquipoDTO(
            UUID id,
            String nombre
    ) {}
}
