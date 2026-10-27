package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.out.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.out.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.out.EquiposDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.dto.in.ConfirmacionPuntoDTO;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @GetMapping("/{partidoId}/equipos")
  public EquiposDTO iniciarAnotacion(@PathVariable UUID partidoId) {
    return gestorPartidoPort.iniciarAnotacion(partidoId);
  }

  @PostMapping("/{partidoId}/confirmar-punto")
  public ConfirmacionDTO confirmarPunto(
      @PathVariable UUID partidoId, @RequestBody ConfirmacionPuntoDTO confirmacion) {
    return gestorPartidoPort.confirmarPunto(
        partidoId, confirmacion.equipoId(), confirmacion.jugadorId(), confirmacion.fundamento());
  }

  @GetMapping("/{partidoId}/pizarra")
  public PizarraEnVivoDTO obtenerPizarra(@PathVariable UUID partidoId) {
    return gestorPartidoPort.obtenerPizarra(partidoId);
  }
}
