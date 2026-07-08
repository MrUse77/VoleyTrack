package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.*;
import com.mrusedev.voleytrack.application.port.out.*;
import com.mrusedev.voleytrack.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GestorPartidoTest {

    @Mock private PartidoRepositoryPort partidoRepo;
    @Mock private EquipoRepositoryPort equipoRepo;
    @Mock private JugadorRepositoryPort jugadorRepo;
    @Mock private SetRepositoryPort setRepo;
    @Mock private EventoRepositoryPort eventoRepo;
    @Mock private SustitucionRepositoryPort sustitucionRepo;

    @InjectMocks
    private GestorPartidoImpl gestor;

    private Equipo equipoLocal;
    private Equipo equipoVisitante;
    private Jugador jugador;
    private Partido partido;

    @BeforeEach
    void setUp() {
        equipoLocal = new Equipo(UUID.randomUUID(), "Club Local", "Entrenador L");
        equipoVisitante = new Equipo(UUID.randomUUID(), "Club Visitante", "Entrenador V");
        jugador = new Jugador(UUID.randomUUID(), "Jugador", "Test",
                LocalDate.of(2000, 1, 1), 10, Posicion.PUNTA_RECEPTOR);
        equipoLocal.agregarJugador(jugador);

        partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
    }

    // ── cargarDatosInicio ──

    @Test
    void cargarDatosInicioDevuelveDatosCorrectos() {
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        DatosInicioPartidoDTO datos = gestor.cargarDatosInicio(partido.getId());

        assertThat(datos.partidoId()).isEqualTo(partido.getId());
        assertThat(datos.equipoLocalNombre()).isEqualTo("Club Local");
        assertThat(datos.equipoVisitanteNombre()).isEqualTo("Club Visitante");
        assertThat(datos.cantSets()).isEqualTo(5);
        assertThat(datos.setsParaGanar()).isEqualTo(3);
    }

    @Test
    void cargarDatosInicioLanzaExcepcionSiNoExiste() {
        UUID id = UUID.randomUUID();
        when(partidoRepo.buscarPorId(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.cargarDatosInicio(id))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ── crearSet ──

    @Test
    void crearSetDevuelveDatosDelSet() {
        partido.iniciar();

        InicioSetDTO dto = gestor.crearSet(partido);

        assertThat(dto.numeroSet()).isEqualTo(1);
        assertThat(dto.esTieBreak()).isFalse();
        assertThat(dto.limitePuntos()).isEqualTo(25);
    }

    // ── crearAlineacion ──

    @Test
    void crearAlineacionDevuelveAlineacionVacia() {
        Alineacion alineacion = gestor.crearAlineacion(equipoLocal);

        assertThat(alineacion.getEquipo()).isEqualTo(equipoLocal);
        assertThat(alineacion.getJugadoresEnCancha()).isEmpty();
    }

    // ── cargarJugadoresDisponibles ──

    @Test
    void cargarJugadoresDisponiblesDevuelveActivos() {
        var disponibles = gestor.cargarJugadoresDisponibles(equipoLocal);

        assertThat(disponibles).contains(jugador);
    }

    // ── agregarJugadorAAlineacion ──

    @Test
    void agregarJugadorALaAlineacionDevuelvePreview() {
        Alineacion alineacion = new Alineacion(equipoLocal);

        AlineacionPreviewDTO preview = gestor.agregarJugadorAAlineacion(jugador, 1, alineacion);

        assertThat(preview.jugadores()).hasSize(1);
        assertThat(preview.jugadores().get(0).jugadorId()).isEqualTo(jugador.getId());
        assertThat(preview.jugadores().get(0).posicion()).isEqualTo(1);
    }

    // ── seleccionarEquipoSaqueInicial ──

    @Test
    void seleccionarEquipoSaqueInicialAsignaCorrectamente() {
        SetPartido set = partido.iniciarSet();

        gestor.seleccionarEquipoSaqueInicial(equipoLocal, set);

        assertThat(set.getSaque()).isEqualTo(equipoLocal);
    }

    // ── confirmarInicioPartido ──

    @Test
    void confirmarInicioPartidoDevuelveExito() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any())).thenReturn(set);

        ConfirmacionDTO result = gestor.confirmarInicioPartido(partido, set);

        assertThat(result.exitoso()).isTrue();
        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
        assertThat(set.getEstado()).isEqualTo(EstadoSet.EN_CURSO);
    }

    // ── iniciarAnotacion ──

    @Test
    void iniciarAnotacionDevuelveDatosDeEquipos() {
        partido.iniciar();
        partido.iniciarSet();

        EquiposDTO dto = gestor.iniciarAnotacion(partido);

        assertThat(dto.local().nombre()).isEqualTo("Club Local");
        assertThat(dto.visitante().nombre()).isEqualTo("Club Visitante");
        assertThat(dto.setActual()).isEqualTo(1);
    }

    // ── confirmarPunto ──

    @Test
    void confirmarPuntoRegistraYDevuelveExito() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any())).thenReturn(set);
        when(eventoRepo.guardar(any(), any())).thenAnswer(inv -> inv.getArgument(0));

        ConfirmacionDTO result = gestor.confirmarPunto(partido, equipoLocal, jugador, TipoFundamento.ATAQUE);

        assertThat(result.exitoso()).isTrue();
        assertThat(result.mensaje()).contains("Punto registrado");
        assertThat(set.getMarcador().getPuntos(partido.getLados().get(0))).isEqualTo(1);
    }

    @Test
    void confirmarPuntoConEquipoNoParticipanteRetornaError() {
        Equipo desconocido = new Equipo(UUID.randomUUID(), "Otro", "X");
        partido.iniciar();
        partido.iniciarSet().iniciar();

        ConfirmacionDTO result = gestor.confirmarPunto(partido, desconocido, jugador, TipoFundamento.ATAQUE);

        assertThat(result.exitoso()).isFalse();
    }

    // ── cargarOpcionesPunto ──

    @Test
    void cargarOpcionesPuntoDevuelveJugadoresEnCancha() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.crearAlineacion(equipoLocal);
        gestor.agregarJugadorAAlineacion(jugador, 1, set.getAlineacion(equipoLocal));

        OpcionesPuntoDTO opciones = gestor.cargarOpcionesPunto(set, equipoLocal);

        assertThat(opciones.jugadores()).hasSize(1);
    }

    @Test
    void cargarOpcionesPuntoSinAlineacionDevuelveVacio() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();

        OpcionesPuntoDTO opciones = gestor.cargarOpcionesPunto(set, equipoLocal);

        assertThat(opciones.jugadores()).isEmpty();
    }
}
