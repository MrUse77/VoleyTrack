package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import com.mrusedev.voleytrack.application.port.in.PrepararPartidoPort;
import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.Alineacion;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PrepararPartidoImpl implements PrepararPartidoPort {

  private final PartidoRepositoryPort partidoRepo;
  private final SetRepositoryPort setRepo;
  private final EquipoRepositoryPort equipoRepo;
  private final JugadorRepositoryPort jugadorRepo;
  private final GestorPartidoPort gestorPartidoPort;

  public PrepararPartidoImpl(
      PartidoRepositoryPort partidoRepo,
      SetRepositoryPort setRepo,
      EquipoRepositoryPort equipoRepo,
      JugadorRepositoryPort jugadorRepo,
      GestorPartidoPort gestorPartidoPort) {
    this.partidoRepo = partidoRepo;
    this.setRepo = setRepo;
    this.equipoRepo = equipoRepo;
    this.jugadorRepo = jugadorRepo;
    this.gestorPartidoPort = gestorPartidoPort;
  }

  @Override
  public InicioSetDTO crearSet(UUID partidoId) {
    Partido partido = requirePartido(partidoId);
    InicioSetDTO dto = gestorPartidoPort.crearSet(partido);
    setRepo.guardar(partido.getSetActual(), partidoId);
    return dto;
  }

  @Override
  public List<JugadorDTO> cargarJugadoresDisponibles(UUID equipoId) {
    Equipo equipo = requireEquipo(equipoId);
    return gestorPartidoPort.cargarJugadoresDisponibles(equipo).stream()
        .map(
            jugador ->
                new JugadorDTO(
                    jugador.getId(),
                    jugador.getNombre(),
                    jugador.getApellido(),
                    jugador.getDorsal(),
                    jugador.getPosicion(),
                    jugador.isActivo()))
        .toList();
  }

  @Override
  public AlineacionPreviewDTO guardarAlineacion(
      UUID partidoId, UUID setId, UUID equipoId, List<JugadorEnPosicion> titulares) {
    requirePartido(partidoId);
    SetPartido set = requireSet(partidoId, setId);
    Equipo equipo = requireEquipo(equipoId);

    Alineacion alineacion = set.crearAlineacion(equipo);
    AlineacionPreviewDTO preview =
        new AlineacionPreviewDTO(equipo.getId(), equipo.getNombreClub(), List.of());
    for (JugadorEnPosicion titular : titulares) {
      Jugador jugador =
          jugadorRepo
              .buscarPorId(titular.jugadorId())
              .orElseThrow(
                  () ->
                      new RecursoNoEncontradoException(
                          "Jugador no encontrado: " + titular.jugadorId()));
      preview =
          gestorPartidoPort.agregarJugadorAAlineacion(jugador, titular.posicion(), alineacion);
    }

    setRepo.guardar(set, partidoId);
    return preview;
  }

  @Override
  public void seleccionarSaqueInicial(UUID partidoId, UUID setId, UUID equipoId) {
    requirePartido(partidoId);
    SetPartido set = requireSet(partidoId, setId);
    Equipo equipo = requireEquipo(equipoId);

    gestorPartidoPort.seleccionarEquipoSaqueInicial(equipo, set);
    setRepo.guardar(set, partidoId);
  }

  @Override
  public void confirmarInicio(UUID partidoId, UUID setId) {
    Partido partido = requirePartido(partidoId);
    SetPartido set = requireSet(partidoId, setId);

    ConfirmacionDTO confirmacion = gestorPartidoPort.confirmarInicioPartido(partido, set);
    if (!confirmacion.exitoso()) {
      throw new ReglaDeNegocioException(confirmacion.mensaje());
    }
  }

  private Partido requirePartido(UUID partidoId) {
    return partidoRepo
        .buscarPorId(partidoId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));
  }

  private Equipo requireEquipo(UUID equipoId) {
    return equipoRepo
        .buscarPorId(equipoId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado: " + equipoId));
  }

  /**
   * Resolves the set through the partido's own set list. This deliberately checks both that the set
   * exists and that it belongs to the requested partido: a set id from another partido is reported
   * as not found (404) instead of being silently operated on.
   */
  private SetPartido requireSet(UUID partidoId, UUID setId) {
    return setRepo.buscarPorPartido(partidoId).stream()
        .filter(s -> s.getId().equals(setId))
        .findFirst()
        .orElseThrow(() -> new RecursoNoEncontradoException("Set no encontrado: " + setId));
  }
}
