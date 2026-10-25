package com.mrusedev.voleytrack.application.dto.out;

import java.util.List;
import java.util.UUID;

public record OpcionesPuntoDTO(
    UUID equipoId,
    String equipoNombre,
    List<JugadorOpcionDTO> jugadores,
    List<String> Fundamentos) {

  public record JugadorOpcionDTO(
      UUID id, String nombre, String apellido, int dorsal, boolean enCancha) {}
}
