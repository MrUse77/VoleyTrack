package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.EquiposDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.EventoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SustitucionRepositoryPort;
import com.mrusedev.voleytrack.domain.Alineacion;
import com.mrusedev.voleytrack.domain.AlineacionJugador;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.EstadoPartido;
import com.mrusedev.voleytrack.domain.EstadoSet;
import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Lado;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.TipoFundamento;
import com.mrusedev.voleytrack.domain.TipoLado;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GestorPartidoImpl implements GestorPartidoPort {

  private final PartidoRepositoryPort partidoRepo;
  private final EquipoRepositoryPort equipoRepo;
  private final JugadorRepositoryPort jugadorRepo;
  private final SetRepositoryPort setRepo;
  private final EventoRepositoryPort eventoRepo;
  private final SustitucionRepositoryPort sustitucionRepo;

  public GestorPartidoImpl(
      PartidoRepositoryPort partidoRepo,
      EquipoRepositoryPort equipoRepo,
      JugadorRepositoryPort jugadorRepo,
      SetRepositoryPort setRepo,
      EventoRepositoryPort eventoRepo,
      SustitucionRepositoryPort sustitucionRepo) {
    this.partidoRepo = partidoRepo;
    this.equipoRepo = equipoRepo;
    this.jugadorRepo = jugadorRepo;
    this.setRepo = setRepo;
    this.eventoRepo = eventoRepo;
    this.sustitucionRepo = sustitucionRepo;
  }

  // ── RF-6/RF-7: Carga de datos de inicio ──

  @Override
  public DatosInicioPartidoDTO cargarDatosInicio(UUID partidoId) {
    Partido partido = buscarPartido(partidoId);

    Lado ladoLocal =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.LOCAL)
            .findFirst()
            .orElseThrow();
    Lado ladoVisitante =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.VISITANTE)
            .findFirst()
            .orElseThrow();

    return new DatosInicioPartidoDTO(
        partido.getId(),
        ladoLocal.getEquipo().getNombreClub(),
        ladoVisitante.getEquipo().getNombreClub(),
        partido.getCantSets().getCantidad(),
        partido.getCantSets().setsParaGanar(),
        partido.getEstado().name());
  }

  // ── RF-11: Pizarra en vivo ──

  @Override
  public PizarraEnVivoDTO obtenerPizarra(UUID partidoId) {
    Partido partido = buscarPartido(partidoId);

    Lado ladoLocal =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.LOCAL)
            .findFirst()
            .orElseThrow();
    Lado ladoVisitante =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.VISITANTE)
            .findFirst()
            .orElseThrow();

    SetPartido setActual = partido.getSetActual();
    PizarraEnVivoDTO.SetActualDTO setActualDTO =
        setActual == null
            ? null
            : new PizarraEnVivoDTO.SetActualDTO(
                setActual.getNumeroSet(),
                setActual.isEsTieBreak(),
                setActual.getMarcador().getLimitePuntos(),
                setActual.getMarcador().getPuntos(setActual.getMarcador().getLadoLocal()),
                setActual.getMarcador().getPuntos(setActual.getMarcador().getLadoVisitante()));

    UUID equipoSaqueId =
        setActual != null && setActual.getSaque() != null ? setActual.getSaque().getId() : null;

    String estadoSet = setActual == null ? null : setActual.getEstado().name();

    return new PizarraEnVivoDTO(
        new PizarraEnVivoDTO.EquipoPizarraDTO(
            ladoLocal.getEquipo().getId(), ladoLocal.getEquipo().getNombreClub()),
        new PizarraEnVivoDTO.EquipoPizarraDTO(
            ladoVisitante.getEquipo().getId(), ladoVisitante.getEquipo().getNombreClub()),
        contarSetsGanados(partido, TipoLado.LOCAL),
        contarSetsGanados(partido, TipoLado.VISITANTE),
        setActualDTO,
        equipoSaqueId,
        partido.getEstado().name(),
        estadoSet,
        ultimosEventos(partido));
  }

  private int contarSetsGanados(Partido partido, TipoLado tipo) {
    return (int)
        partido.getSets().stream()
            .filter(s -> s.getMarcador().getGanador() != null)
            .filter(s -> s.getMarcador().getGanador().getTipo() == tipo)
            .count();
  }

  private List<PizarraEnVivoDTO.EventoPizarraDTO> ultimosEventos(Partido partido) {
    List<PizarraEnVivoDTO.EventoPizarraDTO> eventos = new ArrayList<>();
    for (SetPartido set : partido.getSets()) {
      if (set.getEventos() == null) {
        continue;
      }
      for (Evento evento : set.getEventos()) {
        Jugador jugador = evento.getJugador();
        eventos.add(
            new PizarraEnVivoDTO.EventoPizarraDTO(
                jugador != null ? jugador.getId() : null,
                jugador != null ? jugador.getNombre() + " " + jugador.getApellido() : null,
                evento.getTipoFundamento().name()));
      }
    }
    int desde = Math.max(0, eventos.size() - 10);
    return List.copyOf(eventos.subList(desde, eventos.size()));
  }

  // ── RF-9: Crear set ──

  @Override
  @Transactional
  public InicioSetDTO crearSet(UUID partidoId) {
    Partido partido = buscarPartido(partidoId);
    SetPartido set;
    try {
      set = partido.iniciarSet();
    } catch (IllegalStateException e) {
      throw new ReglaDeNegocioException(e.getMessage());
    }
    setRepo.guardar(set, partidoId);
    return new InicioSetDTO(
        set.getId(), set.getNumeroSet(), set.isEsTieBreak(), set.getMarcador().getLimitePuntos());
  }

  // ── RF-8: Crear alineación ──

  @Override
  @Transactional
  public AlineacionPreviewDTO crearAlineacion(UUID setId, UUID equipoId) {
    SetPartido set = buscarSet(setId);

    Equipo equipo = buscarEquipoDelSet(set, equipoId);
    Alineacion alineacion = set.crearAlineacion(equipo);
    setRepo.guardar(set, buscarPartidoIdDeSet(setId));
    return toPreview(alineacion);
  }

  @Override
  public List<JugadorDTO> cargarJugadoresDisponibles(UUID equipoId) {
    buscarEquipo(equipoId);
    return jugadorRepo.buscarPorEquipo(equipoId).stream()
        .filter(Jugador::isActivo)
        .map(this::toJugadorDTO)
        .toList();
  }

  @Override
  @Transactional
  public AlineacionPreviewDTO agregarJugadorAAlineacion(
      UUID setId, UUID equipoId, UUID jugadorId, int posicion) {
    SetPartido set = buscarSet(setId);
    Equipo equipo = buscarEquipoDelSet(set, equipoId);
    Alineacion alineacion = set.getAlineacion(equipo);
    if (alineacion == null) {
      throw new RecursoNoEncontradoException(
          "Alineación no encontrada para el equipo: " + equipoId);
    }

    Jugador jugador = buscarJugador(jugadorId);
    alineacion.agregarJugador(jugador, posicion, true);
    setRepo.guardar(set, buscarPartidoIdDeSet(setId));
    return toPreview(alineacion);
  }

  // ── RF-12: Asignar saque inicial ──

  @Override
  @Transactional
  public void seleccionarEquipoSaqueInicial(UUID partidoId, UUID setId, UUID equipoId) {
    SetPartido set = buscarSet(setId);
    if (!partidoId.equals(buscarPartidoIdDeSet(setId))) {
      throw new RecursoNoEncontradoException("Set no encontrado: " + setId);
    }
    Equipo equipo = buscarEquipoDelSet(set, equipoId);
    set.asignarSaqueInicial(equipo);
    setRepo.guardar(set, buscarPartidoIdDeSet(setId));
  }

  // ── RF-8: Guardar alineación completa ──

  @Override
  @Transactional
  public AlineacionPreviewDTO guardarAlineacion(
      UUID partidoId, UUID setId, UUID equipoId, List<JugadorEnPosicion> titulares) {
    buscarPartido(partidoId);
    SetPartido set = buscarSet(setId);

    // El set tiene que pertenecer al partido indicado; si no, se reporta como no encontrado
    // para no operar silenciosamente sobre un set de otro partido.
    UUID setPartidoId = buscarPartidoIdDeSet(setId);
    if (!setPartidoId.equals(partidoId)) {
      throw new RecursoNoEncontradoException("Set no encontrado: " + setId);
    }

    Equipo equipo = buscarEquipoDelSet(set, equipoId);
    Alineacion alineacion;
    try {
      alineacion = set.crearAlineacion(equipo);
      for (JugadorEnPosicion titular : titulares) {
        Jugador jugador = buscarJugador(titular.jugadorId());
        alineacion.agregarJugador(jugador, titular.posicionEnCancha(), true);
      }

    } catch (IllegalStateException e) {
      throw new ReglaDeNegocioException(e.getMessage());
    }

    setRepo.guardar(set, partidoId);
    return toPreview(alineacion);
  }

  // ── RF-9: Confirmar inicio de partido ──

  @Override
  @Transactional
  public ConfirmacionDTO confirmarInicioPartido(UUID partidoId, UUID setId) {
    Partido partido = buscarPartido(partidoId);
    SetPartido set = buscarSet(setId);

    // El set tiene que pertenecer al partido indicado; si no, se reporta como no encontrado
    // para no mover silenciosamente un set de otro partido.
    UUID setPartidoId = buscarPartidoIdDeSet(setId);
    if (!setPartidoId.equals(partidoId)) {
      throw new RecursoNoEncontradoException("Set no encontrado: " + setId);
    }

    try {
      if (partido.getEstado() == EstadoPartido.PROGRAMADO) {
        partido.iniciar();
      }
      set.iniciar();
    } catch (RuntimeException e) {
      throw new ReglaDeNegocioException(e.getMessage());
    }
    // Persistence outside try-catch: any failure here rolls back the transaction
    partidoRepo.guardar(partido);
    setRepo.guardar(set, partido.getId());
    return ConfirmacionDTO.ok("Partido iniciado correctamente");
  }

  // ── RF-10: Iniciar anotación ──

  @Override
  public EquiposDTO iniciarAnotacion(UUID partidoId) {
    Partido partido = buscarPartido(partidoId);
    SetPartido set = partido.getSetActual();
    Lado local =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.LOCAL)
            .findFirst()
            .orElseThrow();
    Lado visitante =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.VISITANTE)
            .findFirst()
            .orElseThrow();

    return new EquiposDTO(
        new EquiposDTO.EquipoDTO(local.getEquipo().getId(), local.getEquipo().getNombreClub()),
        new EquiposDTO.EquipoDTO(
            visitante.getEquipo().getId(), visitante.getEquipo().getNombreClub()),
        set != null ? set.getNumeroSet() : 1,
        set != null ? set.getMarcador().getPuntos(local) : 0,
        set != null ? set.getMarcador().getPuntos(visitante) : 0);
  }

  // ── RF-10: Cargar opciones de punto ──

  @Override
  public OpcionesPuntoDTO cargarOpcionesPunto(UUID setId, UUID equipoId) {
    SetPartido set = buscarSet(setId);
    Equipo equipo = buscarEquipoDelSet(set, equipoId);
    Alineacion alineacion = set.getAlineacion(equipo);
    List<OpcionesPuntoDTO.JugadorOpcionDTO> jugadores = List.of();

    if (alineacion != null) {
      jugadores =
          alineacion.getJugadoresEnCancha().stream()
              .map(
                  aj ->
                      new OpcionesPuntoDTO.JugadorOpcionDTO(
                          aj.getJugador().getId(),
                          aj.getJugador().getNombre(),
                          aj.getJugador().getApellido(),
                          aj.getJugador().getDorsal(),
                          true))
              .toList();
    }

    return new OpcionesPuntoDTO(equipo.getId(), equipo.getNombreClub(), jugadores);
  }

  // ── RF-10: Confirmar punto ──

  @Override
  @Transactional
  public ConfirmacionDTO confirmarPunto(
      UUID partidoId, UUID equipoId, UUID jugadorId, String tipoFundamento) {
    Partido partido = buscarPartido(partidoId);
    Equipo equipo = buscarEquipoDelPartido(partido, equipoId);
    Jugador jugador = buscarJugador(jugadorId);

    TipoFundamento fundamento;
    try {
      fundamento = TipoFundamento.valueOf(tipoFundamento);
    } catch (RuntimeException e) {
      throw new IllegalArgumentException("Fundamento inválido: " + tipoFundamento);
    }

    Evento evento;
    try {
      evento = partido.anotarPunto(equipo, jugador, fundamento);
    } catch (RuntimeException e) {
      throw new ReglaDeNegocioException(e.getMessage());
    }

    SetPartido set = partido.getSetActual();
    // Persistence outside try-catch: any failure here rolls back the transaction
    partidoRepo.guardar(partido);
    if (set != null) {
      setRepo.guardar(set, partido.getId());
      eventoRepo.guardar(evento, set.getId());
    }

    String mensaje = "Punto registrado";
    if (set != null && set.getEstado() == EstadoSet.FINALIZADO) {
      mensaje = "¡Set finalizado!";
      if (partido.getEstado() == EstadoPartido.FINALIZADO) {
        mensaje =
            "¡Partido finalizado! Ganador: " + partido.getGanador().getEquipo().getNombreClub();
      }
    }

    return ConfirmacionDTO.ok(mensaje);
  }

  private Partido buscarPartido(UUID partidoId) {
    return partidoRepo
        .buscarPorId(partidoId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));
  }

  private SetPartido buscarSet(UUID setId) {
    return setRepo
        .buscarPorId(setId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Set no encontrado: " + setId));
  }

  private UUID buscarPartidoIdDeSet(UUID setId) {
    return setRepo
        .buscarPartidoId(setId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Set no encontrado: " + setId));
  }

  private Equipo buscarEquipo(UUID equipoId) {
    return equipoRepo
        .buscarPorId(equipoId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Equipo no encontrado: " + equipoId));
  }

  private Jugador buscarJugador(UUID jugadorId) {
    return jugadorRepo
        .buscarPorId(jugadorId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Jugador no encontrado: " + jugadorId));
  }

  private Equipo buscarEquipoDelSet(SetPartido set, UUID equipoId) {
    // Distingue "no existe" (404 del repositorio) de "existe pero no juega este set"
    buscarEquipo(equipoId);
    return Stream.of(set.getMarcador().getLadoLocal(), set.getMarcador().getLadoVisitante())
        .filter(lado -> lado.getEquipo().getId().equals(equipoId))
        .map(Lado::getEquipo)
        .findFirst()
        .orElseThrow(
            () -> new RecursoNoEncontradoException("Equipo no encontrado en el set: " + equipoId));
  }

  private Equipo buscarEquipoDelPartido(Partido partido, UUID equipoId) {
    Equipo equipo = buscarEquipo(equipoId);
    return partido.getLados().stream()
        .filter(lado -> lado.getEquipo().getId().equals(equipoId))
        .map(Lado::getEquipo)
        .findFirst()
        .orElse(equipo);
  }

  private JugadorDTO toJugadorDTO(Jugador jugador) {
    return new JugadorDTO(
        jugador.getId(),
        jugador.getNombre(),
        jugador.getApellido(),
        jugador.getFechaNacimiento() != null ? jugador.getFechaNacimiento().toString() : null,
        jugador.getDorsal(),
        jugador.getPosicion() != null ? jugador.getPosicion().name() : null,
        jugador.isActivo());
  }

  private AlineacionPreviewDTO toPreview(Alineacion alineacion) {
    List<AlineacionPreviewDTO.JugadorEnPosicionDTO> jugadores =
        alineacion.getJugadoresEnCancha().stream().map(this::toJugadorEnPosicionDTO).toList();

    return new AlineacionPreviewDTO(
        alineacion.getEquipo().getId(), alineacion.getEquipo().getNombreClub(), jugadores);
  }

  private AlineacionPreviewDTO.JugadorEnPosicionDTO toJugadorEnPosicionDTO(
      AlineacionJugador alineacionJugador) {
    Jugador jugador = alineacionJugador.getJugador();
    return new AlineacionPreviewDTO.JugadorEnPosicionDTO(
        jugador.getId(),
        jugador.getNombre(),
        jugador.getApellido(),
        jugador.getDorsal(),
        alineacionJugador.getPosicion(),
        alineacionJugador.isEsTitular());
  }
}
