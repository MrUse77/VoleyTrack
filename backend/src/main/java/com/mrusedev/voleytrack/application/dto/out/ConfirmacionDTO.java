package com.mrusedev.voleytrack.application.dto.out;

public record ConfirmacionDTO(String mensaje) {

  public static ConfirmacionDTO ok(String mensaje) {
    return new ConfirmacionDTO(mensaje);
  }
}
