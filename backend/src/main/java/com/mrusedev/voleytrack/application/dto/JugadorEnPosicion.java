package com.mrusedev.voleytrack.application.dto;

import java.util.UUID;

public record JugadorEnPosicion(
        UUID jugadorId,
        int posicion
) {}
