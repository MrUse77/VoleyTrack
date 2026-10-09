package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;

import java.util.UUID;

public interface ConsultarPartidoPort {

    DatosInicioPartidoDTO cargarDatosInicio(UUID partidoId);

    PizarraEnVivoDTO obtenerPizarra(UUID partidoId);

    OpcionesPuntoDTO cargarOpcionesPunto(UUID setId, UUID equipoId);
}
