package com.mrusedev.voleytrack.application.dto.in;

import java.util.UUID;

public record ConfirmacionPuntoDTO(UUID equipoId, UUID jugadorId, String fundamento) {}
