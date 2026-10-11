package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.EquiposDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;

import java.util.List;
import java.util.UUID;

public interface GestorPartidoPort {

    DatosInicioPartidoDTO cargarDatosInicio(UUID partidoId);

    PizarraEnVivoDTO obtenerPizarra(UUID partidoId);

    InicioSetDTO crearSet(UUID partidoId);

    AlineacionPreviewDTO crearAlineacion(UUID setId, UUID equipoId);

    List<JugadorDTO> cargarJugadoresDisponibles(UUID equipoId);

    AlineacionPreviewDTO agregarJugadorAAlineacion(UUID setId, UUID equipoId, UUID jugadorId, int posicion);

    void seleccionarEquipoSaqueInicial(UUID setId, UUID equipoId);

    AlineacionPreviewDTO guardarAlineacion(UUID partidoId, UUID setId, UUID equipoId, List<JugadorEnPosicion> titulares);

    ConfirmacionDTO confirmarInicioPartido(UUID partidoId, UUID setId);

    EquiposDTO iniciarAnotacion(UUID partidoId);

    OpcionesPuntoDTO cargarOpcionesPunto(UUID setId, UUID equipoId);

    ConfirmacionDTO confirmarPunto(UUID partidoId, UUID equipoId, UUID jugadorId, String tipoFundamento);
}
