package com.mrusedev.voleytrack.application.dto;

import com.mrusedev.voleytrack.domain.Posicion;

import java.util.UUID;

public record JugadorDTO(
        UUID id,
        String nombre,
        String apellido,
        int dorsal,
        Posicion posicion,
        boolean activo
) {}
