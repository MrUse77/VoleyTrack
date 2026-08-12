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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
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
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        InicioSetDTO dto = gestor.crearSet(partido.getId());

        assertThat(dto.numeroSet()).isEqualTo(1);
        assertThat(dto.esTieBreak()).isFalse();
        assertThat(dto.limitePuntos()).isEqualTo(25);
    }

    // ── crearAlineacion ──

    @Test
    void crearAlineacionDevuelvePreviewVacio() {
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        AlineacionPreviewDTO preview = gestor.crearAlineacion(set.getId(), equipoLocal.getId());

        assertThat(preview.equipoId()).isEqualTo(equipoLocal.getId());
        assertThat(preview.equipoNombre()).isEqualTo("Club Local");
        assertThat(preview.jugadores()).isEmpty();
        assertThat(set.getAlineacion(equipoLocal)).isNotNull();
    }

    // ── cargarJugadoresDisponibles ──

    @Test
    void cargarJugadoresDisponiblesDevuelveActivos() {
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorEquipo(equipoLocal.getId())).thenReturn(List.of(jugador));

        var disponibles = gestor.cargarJugadoresDisponibles(equipoLocal.getId());

        assertThat(disponibles).hasSize(1);
        assertThat(disponibles.get(0).nombre()).isEqualTo("Jugador");
        assertThat(disponibles.get(0).dorsal()).isEqualTo(10);
    }

    // ── agregarJugadorAAlineacion ──

    @Test
    void agregarJugadorALaAlineacionDevuelvePreview() {
        SetPartido set = partido.iniciarSet();
        set.crearAlineacion(equipoLocal);
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        AlineacionPreviewDTO preview = gestor.agregarJugadorAAlineacion(
                set.getId(), equipoLocal.getId(), jugador.getId(), 1);

        assertThat(preview.jugadores()).hasSize(1);
        assertThat(preview.jugadores().get(0).jugadorId()).isEqualTo(jugador.getId());
        assertThat(preview.jugadores().get(0).posicion()).isEqualTo(1);
    }

    // ── seleccionarEquipoSaqueInicial ──

    @Test
    void seleccionarEquipoSaqueInicialAsignaCorrectamente() {
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        gestor.seleccionarEquipoSaqueInicial(set.getId(), equipoLocal.getId());

        assertThat(set.getSaque()).isEqualTo(equipoLocal);
    }

    // ── confirmarInicioPartido ──

    @Test
    void confirmarInicioPartidoDevuelveExito() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any())).thenReturn(set);
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));

        ConfirmacionDTO result = gestor.confirmarInicioPartido(partido.getId(), set.getId());

        assertThat(result.exitoso()).isTrue();
        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
        assertThat(set.getEstado()).isEqualTo(EstadoSet.EN_CURSO);
    }

    // ── iniciarAnotacion ──

    @Test
    void iniciarAnotacionDevuelveDatosDeEquipos() {
        partido.iniciar();
        partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        EquiposDTO dto = gestor.iniciarAnotacion(partido.getId());

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
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        ConfirmacionDTO result = gestor.confirmarPunto(
                partido.getId(), equipoLocal.getId(), jugador.getId(), "ATAQUE");

        assertThat(result.exitoso()).isTrue();
        assertThat(result.mensaje()).contains("Punto registrado");
        assertThat(set.getMarcador().getPuntos(partido.getLados().get(0))).isEqualTo(1);
    }

    @Test
    void confirmarPuntoConEquipoNoParticipanteRetornaError() {
        Equipo desconocido = new Equipo(UUID.randomUUID(), "Otro", "X");
        partido.iniciar();
        partido.iniciarSet().iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(desconocido.getId())).thenReturn(Optional.of(desconocido));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        ConfirmacionDTO result = gestor.confirmarPunto(
                partido.getId(), desconocido.getId(), jugador.getId(), "ATAQUE");

        assertThat(result.exitoso()).isFalse();
    }

    // ── Persistence failure atomicy ──

    @Test
    void confirmarInicioPartidoPropagaFalloDePersistencia() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any()))
                .thenThrow(new RuntimeException("DB failure"));
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));

        assertThatThrownBy(() -> gestor.confirmarInicioPartido(partido.getId(), set.getId()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("DB failure");
    }

    @Test
    void confirmarPuntoPropagaFalloDePersistenciaEnSetRepo() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any()))
                .thenThrow(new RuntimeException("DB failure"));
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        assertThatThrownBy(() ->
                gestor.confirmarPunto(
                        partido.getId(), equipoLocal.getId(), jugador.getId(), "ATAQUE"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("DB failure");
    }

    @Test
    void confirmarPuntoNoLlamaPersistenciaSiDominioRechaza() {
        Equipo desconocido = new Equipo(UUID.randomUUID(), "Otro", "X");
        partido.iniciar();
        partido.iniciarSet().iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(desconocido.getId())).thenReturn(Optional.of(desconocido));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        // The domain should reject before any persistence call
        gestor.confirmarPunto(partido.getId(), desconocido.getId(), jugador.getId(), "ATAQUE");

        // Verify no persistence was invoked — domain rejection short-circuits the call
        verify(partidoRepo, never()).guardar(any());
        verifyNoInteractions(setRepo);
        verifyNoInteractions(eventoRepo);
    }

    // ── cargarOpcionesPunto ──

    @Test
    void cargarOpcionesPuntoDevuelveJugadoresEnCancha() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.crearAlineacion(equipoLocal);
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));
        gestor.agregarJugadorAAlineacion(set.getId(), equipoLocal.getId(), jugador.getId(), 1);

        OpcionesPuntoDTO opciones = gestor.cargarOpcionesPunto(set.getId(), equipoLocal.getId());

        assertThat(opciones.jugadores()).hasSize(1);
    }

    @Test
    void cargarOpcionesPuntoSinAlineacionDevuelveVacio() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        OpcionesPuntoDTO opciones = gestor.cargarOpcionesPunto(set.getId(), equipoLocal.getId());

        assertThat(opciones.jugadores()).isEmpty();
    }
}
