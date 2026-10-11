package com.mrusedev.voleytrack.application.dto;

import java.util.UUID;

public record JugadorDTO(
        UUID id,
        String nombre,
        String apellido,
        String fechaNac,
        int dorsal,
        String pos,
        boolean activo
) {}
