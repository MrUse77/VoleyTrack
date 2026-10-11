package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

  private final GestorPartidoPort gestorPartidoPort;

  public EquipoController(GestorPartidoPort gestorPartidoPort) {
    this.gestorPartidoPort = gestorPartidoPort;
  }

  @GetMapping("/{equipoId}/jugadores")
  public List<JugadorDTO> cargarJugadoresDisponibles(@PathVariable UUID equipoId) {
    return gestorPartidoPort.cargarJugadoresDisponibles(equipoId);
  }
}
