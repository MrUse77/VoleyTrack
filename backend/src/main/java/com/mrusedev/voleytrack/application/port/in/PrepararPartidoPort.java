package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;

import java.util.List;
import java.util.UUID;

public interface PrepararPartidoPort {

    InicioSetDTO crearSet(UUID partidoId);

    List<JugadorDTO> cargarJugadoresDisponibles(UUID equipoId);

    AlineacionPreviewDTO guardarAlineacion(UUID partidoId, UUID setId, UUID equipoId, List<JugadorEnPosicion> titulares);

    void seleccionarSaqueInicial(UUID partidoId, UUID setId, UUID equipoId);

    void confirmarInicio(UUID partidoId, UUID setId);
}
