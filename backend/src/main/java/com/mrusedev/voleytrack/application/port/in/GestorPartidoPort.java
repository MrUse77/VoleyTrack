package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.out.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.out.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.out.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.out.EquiposDTO;
import com.mrusedev.voleytrack.application.dto.out.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.out.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.in.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.dto.out.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import java.util.List;
import java.util.UUID;

public interface GestorPartidoPort {

  DatosInicioPartidoDTO cargarDatosInicio(UUID partidoId);


  InicioSetDTO crearSet(UUID partidoId);

  AlineacionPreviewDTO crearAlineacion(UUID setId, UUID equipoId);

  List<JugadorDTO> cargarJugadoresDisponibles(UUID equipoId);

  AlineacionPreviewDTO agregarJugadorAAlineacion(
      UUID setId, UUID equipoId, UUID jugadorId, int posicion);

  void seleccionarEquipoSaqueInicial(UUID partidoId, UUID setId, UUID equipoId);

  AlineacionPreviewDTO guardarAlineacion(
      UUID partidoId, UUID setId, UUID equipoId, List<JugadorEnPosicion> titulares);

  ConfirmacionDTO confirmarInicioPartido(UUID partidoId, UUID setId);

  EquiposDTO iniciarAnotacion(UUID partidoId);

  OpcionesPuntoDTO cargarOpcionesPunto(UUID setId, UUID equipoId);

  ConfirmacionDTO confirmarPunto(
      UUID partidoId, UUID equipoId, UUID jugadorId, String tipoFundamento);
}
