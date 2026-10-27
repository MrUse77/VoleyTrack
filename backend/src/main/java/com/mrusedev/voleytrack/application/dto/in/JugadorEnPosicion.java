package com.mrusedev.voleytrack.application.dto.in;

import java.util.UUID;

public record JugadorEnPosicion(
        UUID jugadorId,
        int posicionEnCancha
) {}
