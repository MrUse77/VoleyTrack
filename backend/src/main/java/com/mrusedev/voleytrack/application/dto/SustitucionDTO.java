package com.mrusedev.voleytrack.application.dto;

import java.util.UUID;

public record SustitucionDTO(
    UUID equipoId, UUID idPartido, JugadorEnPosicionDTO jSale, JugadorEnPosicionDTO jEntra) {

  public record JugadorEnPosicionDTO(
      UUID jugadorId,
      String nombre,
      String apellido,
      int dorsal,
      int posicion,
      boolean esTitular) {}
}
