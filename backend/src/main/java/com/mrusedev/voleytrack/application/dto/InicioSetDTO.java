package com.mrusedev.voleytrack.application.dto;

import java.util.UUID;

public record InicioSetDTO(
        UUID setId,
        int numeroSet,
        boolean esTieBreak,
        int limitePuntos
) {}
