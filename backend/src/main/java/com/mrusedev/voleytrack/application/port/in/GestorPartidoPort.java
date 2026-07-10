package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.*;
import com.mrusedev.voleytrack.domain.*;

import java.util.List;
import java.util.UUID;

public interface GestorPartidoPort {

    DatosInicioPartidoDTO cargarDatosInicio(UUID partidoId);

    InicioSetDTO crearSet(Partido partido);

    Alineacion crearAlineacion(Equipo equipo);

    List<Jugador> cargarJugadoresDisponibles(Equipo equipo);

    AlineacionPreviewDTO agregarJugadorAAlineacion(Jugador jugador, int posicion, Alineacion alineacion);

    void seleccionarEquipoSaqueInicial(Equipo equipo, SetPartido set);

    ConfirmacionDTO confirmarInicioPartido(Partido partido, SetPartido set);

    EquiposDTO iniciarAnotacion(Partido partido);

    OpcionesPuntoDTO cargarOpcionesPunto(SetPartido set, Equipo equipo);

    ConfirmacionDTO confirmarPunto(Partido partido, Equipo equipo, Jugador jugador, TipoFundamento tipoFundamento);
}
