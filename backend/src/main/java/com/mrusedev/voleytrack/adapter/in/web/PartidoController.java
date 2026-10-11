package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

  private final GestorPartidoPort gestorPartidoPort;

  public PartidoController(GestorPartidoPort gestorPartidoPort) {
    this.gestorPartidoPort = gestorPartidoPort;
  }

  @GetMapping("/{partidoId}/inicio")
  public DatosInicioPartidoDTO cargarDatosInicio(@PathVariable UUID partidoId) {
    return gestorPartidoPort.cargarDatosInicio(partidoId);
  }

  @GetMapping("/{partidoId}/pizarra")
  public PizarraEnVivoDTO obtenerPizarra(@PathVariable UUID partidoId) {
    return gestorPartidoPort.obtenerPizarra(partidoId);
  }
}
