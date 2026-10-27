package com.mrusedev.voleytrack.application.dto.out;

import java.util.UUID;

public record JugadorDTO(
        UUID id,
        String nombre,
        String apellido,
        String fechaNacimiento,
        int dorsal,
        String posicion,
        boolean activo
) {}
