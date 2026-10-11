package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/partidos")
public class PreparacionPartidoController {

  private final GestorPartidoPort gestorPartidoPort;

  public PreparacionPartidoController(GestorPartidoPort gestorPartidoPort) {
    this.gestorPartidoPort = gestorPartidoPort;
  }

  public record SaqueInicialRequest(UUID equipoId) {}

  public record InicioPartidoRequest(UUID setId) {}

  @PostMapping("/{partidoId}/sets")
  public ResponseEntity<InicioSetDTO> crearSet(@PathVariable UUID partidoId) {
    InicioSetDTO inicioSet = gestorPartidoPort.crearSet(partidoId);
    return ResponseEntity.status(HttpStatus.CREATED).body(inicioSet);
  }

  @PutMapping("/{partidoId}/sets/{setId}/alineacion")
  public ResponseEntity<AlineacionPreviewDTO> guardarAlineacion(
      @PathVariable UUID partidoId,
      @PathVariable UUID setId,
      @RequestParam UUID equipoId,
      @RequestBody List<JugadorEnPosicion> titulares) {
    AlineacionPreviewDTO preview =
        gestorPartidoPort.guardarAlineacion(partidoId, setId, equipoId, titulares);
    return ResponseEntity.ok(preview);
  }

  @PostMapping("/{partidoId}/sets/{setId}/saque-inicial")
  public ResponseEntity<Void> seleccionarSaqueInicial(
      @PathVariable UUID partidoId,
      @PathVariable UUID setId,
      @RequestBody SaqueInicialRequest request) {
    gestorPartidoPort.seleccionarEquipoSaqueInicial(partidoId, setId, request.equipoId());
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{partidoId}/inicio")
  public ResponseEntity<ConfirmacionDTO> confirmarInicio(
      @PathVariable UUID partidoId, @RequestBody InicioPartidoRequest request) {
    ConfirmacionDTO confirmacion =
        gestorPartidoPort.confirmarInicioPartido(partidoId, request.setId());
    return ResponseEntity.ok(confirmacion);
  }
}
