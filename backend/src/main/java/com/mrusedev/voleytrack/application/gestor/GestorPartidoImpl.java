package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.*;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import com.mrusedev.voleytrack.application.port.out.*;
import com.mrusedev.voleytrack.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GestorPartidoImpl implements GestorPartidoPort {

    private final PartidoRepositoryPort partidoRepo;
    private final EquipoRepositoryPort equipoRepo;
    private final JugadorRepositoryPort jugadorRepo;
    private final SetRepositoryPort setRepo;
    private final EventoRepositoryPort eventoRepo;
    private final SustitucionRepositoryPort sustitucionRepo;

    public GestorPartidoImpl(PartidoRepositoryPort partidoRepo,
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
        Partido partido = partidoRepo.buscarPorId(partidoId)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado: " + partidoId));

        Lado ladoLocal = partido.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.LOCAL).findFirst().orElseThrow();
        Lado ladoVisitante = partido.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.VISITANTE).findFirst().orElseThrow();

        return new DatosInicioPartidoDTO(
                partido.getId(),
                ladoLocal.getEquipo().getNombreClub(),
                ladoVisitante.getEquipo().getNombreClub(),
                partido.getCantSets().getCantidad(),
                partido.getCantSets().setsParaGanar(),
                partido.getEstado().name()
        );
    }

    // ── RF-9: Crear set ──

    @Override
    public InicioSetDTO crearSet(Partido partido) {
        SetPartido set = partido.iniciarSet();
        return new InicioSetDTO(set.getId(), set.getNumeroSet(),
                set.isEsTieBreak(), set.getMarcador().getLimitePuntos());
    }

    // ── RF-8: Crear alineación ──

    @Override
    public Alineacion crearAlineacion(Equipo equipo) {
        return new Alineacion(equipo);
    }

    @Override
    public List<Jugador> cargarJugadoresDisponibles(Equipo equipo) {
        return equipo.getJugadoresActivos();
    }

    @Override
    public AlineacionPreviewDTO agregarJugadorAAlineacion(Jugador jugador, int posicion, Alineacion alineacion) {
        alineacion.agregarJugador(jugador, posicion, true);

        List<AlineacionPreviewDTO.JugadorEnPosicionDTO> jugadores = alineacion.getJugadoresEnCancha().stream()
                .map(aj -> new AlineacionPreviewDTO.JugadorEnPosicionDTO(
                        aj.getJugador().getId(),
                        aj.getJugador().getNombre(),
                        aj.getJugador().getApellido(),
                        aj.getJugador().getDorsal(),
                        aj.getPosicion(),
                        aj.isEsTitular()))
                .toList();

        return new AlineacionPreviewDTO(
                alineacion.getEquipo().getId(),
                alineacion.getEquipo().getNombreClub(),
                jugadores
        );
    }

    // ── RF-12: Asignar saque inicial ──

    @Override
    public void seleccionarEquipoSaqueInicial(Equipo equipo, SetPartido set) {
        set.asignarSaqueInicial(equipo);
    }

    // ── RF-9: Confirmar inicio de partido ──

    @Override
    public ConfirmacionDTO confirmarInicioPartido(Partido partido, SetPartido set) {
        try {
            if (partido.getEstado() == EstadoPartido.PROGRAMADO) {
                partido.iniciar();
            }
            set.iniciar();
            partidoRepo.guardar(partido);
            setRepo.guardar(set, partido.getId());
            return ConfirmacionDTO.ok("Partido iniciado correctamente");
        } catch (Exception e) {
            return ConfirmacionDTO.error("Error al iniciar el partido: " + e.getMessage());
        }
    }

    // ── RF-10: Iniciar anotación ──

    @Override
    public EquiposDTO iniciarAnotacion(Partido partido) {
        SetPartido set = partido.getSetActual();
        Lado local = partido.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.LOCAL).findFirst().orElseThrow();
        Lado visitante = partido.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.VISITANTE).findFirst().orElseThrow();

        return new EquiposDTO(
                new EquiposDTO.EquipoDTO(local.getEquipo().getId(), local.getEquipo().getNombreClub()),
                new EquiposDTO.EquipoDTO(visitante.getEquipo().getId(), visitante.getEquipo().getNombreClub()),
                set != null ? set.getNumeroSet() : 1,
                set != null ? set.getMarcador().getPuntos(local) : 0,
                set != null ? set.getMarcador().getPuntos(visitante) : 0
        );
    }

    // ── RF-10: Cargar opciones de punto ──

    @Override
    public OpcionesPuntoDTO cargarOpcionesPunto(SetPartido set, Equipo equipo) {
        Alineacion alineacion = set.getAlineacion(equipo);
        List<OpcionesPuntoDTO.JugadorOpcionDTO> jugadores = List.of();

        if (alineacion != null) {
            jugadores = alineacion.getJugadoresEnCancha().stream()
                    .map(aj -> new OpcionesPuntoDTO.JugadorOpcionDTO(
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
    public ConfirmacionDTO confirmarPunto(Partido partido, Equipo equipo, Jugador jugador, TipoFundamento tipoFundamento) {
        try {
            Evento evento = partido.anotarPunto(equipo, jugador, tipoFundamento);
            SetPartido set = partido.getSetActual();

            // Persistir
            partidoRepo.guardar(partido);
            if (set != null) {
                setRepo.guardar(set, partido.getId());
                eventoRepo.guardar(evento, set.getId());
            }

            String mensaje = "Punto registrado";
            if (set != null && set.getEstado() == EstadoSet.FINALIZADO) {
                mensaje = "¡Set finalizado!";
                if (partido.getEstado() == EstadoPartido.FINALIZADO) {
                    mensaje = "¡Partido finalizado! Ganador: " +
                            partido.getGanador().getEquipo().getNombreClub();
                }
            }

            return ConfirmacionDTO.ok(mensaje);
        } catch (Exception e) {
            return ConfirmacionDTO.error("Error al registrar punto: " + e.getMessage());
        }
    }
}
