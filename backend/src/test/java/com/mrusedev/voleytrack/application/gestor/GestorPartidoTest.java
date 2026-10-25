package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.in.*;
import com.mrusedev.voleytrack.application.dto.out.*;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import com.mrusedev.voleytrack.application.port.in.GestorPizarraPort;
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
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
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
    @Mock private NotificadorPizarraPort notificadorPizarra;
    @Mock private GestorPizarraPort gestorPizarra;

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
    void cargarDatosInicioLanzaRecursoNoEncontradoSiNoExiste() {
        UUID id = UUID.randomUUID();
        when(partidoRepo.buscarPorId(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.cargarDatosInicio(id))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Partido no encontrado: " + id);
    }

    // ── crearSet ──

    @Test
    void crearSetDevuelveDatosDelSetYPersiste() {
        partido.iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        InicioSetDTO dto = gestor.crearSet(partido.getId());

        assertThat(dto.numeroSet()).isEqualTo(1);
        assertThat(dto.esTieBreak()).isFalse();
        assertThat(dto.limitePuntos()).isEqualTo(25);
        verify(setRepo).guardar(partido.getSetActual(), partido.getId());
    }

    @Test
    void crearSetConPartidoInexistenteLanzaRecursoNoEncontrado() {
        UUID partidoId = UUID.randomUUID();
        when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.crearSet(partidoId))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Partido no encontrado: " + partidoId);

        verifyNoInteractions(setRepo);
    }

    @Test
    void crearSetConTopeDeSetsLanzaReglaDeNegocioExceptionYSinPersistir() {
        partido.iniciar();
        for (int i = 0; i < 5; i++) {
            partido.iniciarSet();
        }
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        assertThatThrownBy(() -> gestor.crearSet(partido.getId()))
                .isInstanceOf(ReglaDeNegocioException.class)
                .hasMessage("Ya se alcanzó el máximo de sets");

        verifyNoInteractions(setRepo);
    }

    // ── crearAlineacion ──

    @Test
    void crearAlineacionDevuelvePreviewVacioYPersiste() {
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        AlineacionPreviewDTO preview = gestor.crearAlineacion(set.getId(), equipoLocal.getId());

        assertThat(preview.equipoId()).isEqualTo(equipoLocal.getId());
        assertThat(preview.equipoNombre()).isEqualTo("Club Local");
        assertThat(preview.jugadores()).isEmpty();
        assertThat(set.getAlineacion(equipoLocal)).isNotNull();
        verify(setRepo).guardar(set, partido.getId());
    }

    @Test
    void crearAlineacionConSetInexistenteLanzaRecursoNoEncontrado() {
        UUID setId = UUID.randomUUID();
        when(setRepo.buscarPorId(setId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.crearAlineacion(setId, equipoLocal.getId()))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setId);

        verifyNoInteractions(equipoRepo);
    }

    // ── cargarJugadoresDisponibles ──

    @Test
    void cargarJugadoresDisponiblesMapeaCamposYFiltraInactivos() {
        Jugador inactivo = new Jugador(UUID.randomUUID(), "Bea", "Dos",
                LocalDate.of(1999, 5, 5), 2, Posicion.CENTRAL);
        inactivo.desactivar();
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorEquipo(equipoLocal.getId())).thenReturn(List.of(jugador, inactivo));

        List<JugadorDTO> disponibles = gestor.cargarJugadoresDisponibles(equipoLocal.getId());

        assertThat(disponibles).hasSize(1);
        JugadorDTO dto = disponibles.getFirst();
        assertThat(dto.id()).isEqualTo(jugador.getId());
        assertThat(dto.nombre()).isEqualTo("Jugador");
        assertThat(dto.apellido()).isEqualTo("Test");
        assertThat(dto.fechaNacimiento()).isEqualTo("2000-01-01");
        assertThat(dto.dorsal()).isEqualTo(10);
        assertThat(dto.posicion()).isEqualTo("PUNTA_RECEPTOR");
        assertThat(dto.activo()).isTrue();
    }

    @Test
    void cargarJugadoresDisponiblesConEquipoInexistenteLanzaRecursoNoEncontrado() {
        UUID equipoId = UUID.randomUUID();
        when(equipoRepo.buscarPorId(equipoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.cargarJugadoresDisponibles(equipoId))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Equipo no encontrado: " + equipoId);

        verifyNoInteractions(jugadorRepo);
    }

    // ── agregarJugadorAAlineacion ──

    @Test
    void agregarJugadorALaAlineacionDevuelvePreviewYPersiste() {
        SetPartido set = partido.iniciarSet();
        set.crearAlineacion(equipoLocal);
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        AlineacionPreviewDTO preview = gestor.agregarJugadorAAlineacion(
                set.getId(), equipoLocal.getId(), jugador.getId(), 1);

        assertThat(preview.jugadores()).hasSize(1);
        assertThat(preview.jugadores().get(0).jugadorId()).isEqualTo(jugador.getId());
        assertThat(preview.jugadores().get(0).posicionEnCancha()).isEqualTo(1);
        verify(setRepo).guardar(set, partido.getId());
    }

    @Test
    void agregarJugadorAAlineacionConJugadorInexistenteLanzaRecursoNoEncontrado() {
        SetPartido set = partido.iniciarSet();
        set.crearAlineacion(equipoLocal);
        UUID jugadorId = UUID.randomUUID();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugadorId)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                gestor.agregarJugadorAAlineacion(set.getId(), equipoLocal.getId(), jugadorId, 1))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Jugador no encontrado: " + jugadorId);

        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void agregarJugadorAAlineacionSinAlineacionParaElEquipoLanzaRecursoNoEncontrado() {
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        assertThatThrownBy(() ->
                gestor.agregarJugadorAAlineacion(set.getId(), equipoLocal.getId(), jugador.getId(), 1))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Alineación no encontrada para el equipo: " + equipoLocal.getId());

        verify(setRepo, never()).guardar(any(), any());
    }

    // ── seleccionarEquipoSaqueInicial ──

    @Test
    void seleccionarEquipoSaqueInicialAsignaYPersiste() {
        SetPartido set = partido.iniciarSet();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        gestor.seleccionarEquipoSaqueInicial(partido.getId(), set.getId(), equipoLocal.getId());

        assertThat(set.getSaque()).isEqualTo(equipoLocal);
        verify(setRepo).guardar(set, partido.getId());
    }

    @Test
    void seleccionarEquipoSaqueInicialConSetDeOtroPartidoLanzaRecursoNoEncontradoYSinPersistir() {
        SetPartido set = partido.iniciarSet();
        Partido otroPartido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(otroPartido.getId()));

        assertThatThrownBy(() ->
                gestor.seleccionarEquipoSaqueInicial(partido.getId(), set.getId(), equipoLocal.getId()))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + set.getId());

        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void seleccionarEquipoSaqueInicialConEquipoDeOtroPartidoLanzaRecursoNoEncontradoYSinPersistir() {
        SetPartido set = partido.iniciarSet();
        Equipo ajeno = new Equipo(UUID.randomUUID(), "Ajeno", "X");
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(ajeno.getId())).thenReturn(Optional.of(ajeno));

        assertThatThrownBy(() ->
                gestor.seleccionarEquipoSaqueInicial(partido.getId(), set.getId(), ajeno.getId()))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Equipo no encontrado en el set: " + ajeno.getId());

        verify(setRepo, never()).guardar(any(), any());
    }

    // ── guardarAlineacion ──

    @Test
    void guardarAlineacionAgregaTitularesYDevuelvePreviewYPersiste() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        AlineacionPreviewDTO preview = gestor.guardarAlineacion(partido.getId(), set.getId(),
                equipoLocal.getId(), List.of(new JugadorEnPosicion(jugador.getId(), 1)));

        assertThat(preview.equipoId()).isEqualTo(equipoLocal.getId());
        assertThat(preview.equipoNombre()).isEqualTo("Club Local");
        assertThat(preview.jugadores()).hasSize(1);
        assertThat(preview.jugadores().get(0).jugadorId()).isEqualTo(jugador.getId());
        assertThat(preview.jugadores().get(0).posicionEnCancha()).isEqualTo(1);
        assertThat(preview.jugadores().get(0).esTitular()).isTrue();
        verify(setRepo, times(1)).guardar(set, partido.getId());
    }

    @Test
    void guardarAlineacionSinTitularesDevuelvePreviewVacioYPersiste() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

        AlineacionPreviewDTO preview = gestor.guardarAlineacion(partido.getId(), set.getId(),
                equipoLocal.getId(), List.of());

        assertThat(preview.equipoId()).isEqualTo(equipoLocal.getId());
        assertThat(preview.equipoNombre()).isEqualTo("Club Local");
        assertThat(preview.jugadores()).isEmpty();
        verifyNoInteractions(jugadorRepo);
        verify(setRepo).guardar(set, partido.getId());
    }

    @Test
    void guardarAlineacionConPartidoInexistenteLanzaRecursoNoEncontrado() {
        UUID partidoId = UUID.randomUUID();
        UUID setId = UUID.randomUUID();
        when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.guardarAlineacion(partidoId, setId, equipoLocal.getId(),
                List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Partido no encontrado: " + partidoId);

        verifyNoInteractions(setRepo);
    }

    @Test
    void guardarAlineacionConSetInexistenteLanzaRecursoNoEncontrado() {
        UUID setId = UUID.randomUUID();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(setId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), setId, equipoLocal.getId(),
                List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setId);

        verifyNoInteractions(equipoRepo);
    }

    @Test
    void guardarAlineacionConSetDeOtroPartidoLanzaRecursoNoEncontradoYSinPersistir() {
        Partido otroPartido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        SetPartido setDeOtroPartido = otroPartido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(setDeOtroPartido.getId())).thenReturn(Optional.of(setDeOtroPartido));
        when(setRepo.buscarPartidoId(setDeOtroPartido.getId())).thenReturn(Optional.of(otroPartido.getId()));

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), setDeOtroPartido.getId(),
                equipoLocal.getId(), List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setDeOtroPartido.getId());

        verify(setRepo, never()).guardar(any(), any());
        verifyNoInteractions(equipoRepo);
        verifyNoInteractions(jugadorRepo);
    }

    @Test
    void guardarAlineacionConEquipoInexistenteLanzaRecursoNoEncontrado() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), set.getId(),
                equipoLocal.getId(), List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Equipo no encontrado: " + equipoLocal.getId());

        verifyNoInteractions(jugadorRepo);
        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void guardarAlineacionConJugadorInexistenteLanzaRecursoNoEncontradoYSinPersistir() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), set.getId(),
                equipoLocal.getId(), List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Jugador no encontrado: " + jugador.getId());

        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void guardarAlineacionConMasDeSieteTitularesLanzaReglaDeNegocioExceptionYSinPersistir() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        List<JugadorEnPosicion> ochoTitulares = List.of(
                new JugadorEnPosicion(jugador.getId(), 1),
                new JugadorEnPosicion(jugador.getId(), 2),
                new JugadorEnPosicion(jugador.getId(), 3),
                new JugadorEnPosicion(jugador.getId(), 4),
                new JugadorEnPosicion(jugador.getId(), 5),
                new JugadorEnPosicion(jugador.getId(), 6),
                new JugadorEnPosicion(jugador.getId(), 7),
                new JugadorEnPosicion(jugador.getId(), 8));

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), set.getId(),
                equipoLocal.getId(), ochoTitulares))
                .isInstanceOf(ReglaDeNegocioException.class)
                .hasMessage("La alineación no puede tener más de 7 jugadores (6 + líbero)");

        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void guardarAlineacionConEquipoDeOtroPartidoLanzaRecursoNoEncontrado() {
        SetPartido set = partido.iniciarSet();
        Equipo ajeno = new Equipo(UUID.randomUUID(), "Ajeno", "X");
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
        when(equipoRepo.buscarPorId(ajeno.getId())).thenReturn(Optional.of(ajeno));

        assertThatThrownBy(() -> gestor.guardarAlineacion(partido.getId(), set.getId(),
                ajeno.getId(), List.of(new JugadorEnPosicion(jugador.getId(), 1))))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Equipo no encontrado en el set: " + ajeno.getId());

        verify(setRepo, never()).guardar(any(), any());
    }

    // ── confirmarInicioPartido ──

    @Test
    void confirmarInicioPartidoDevuelveExito() {
        SetPartido set = partido.iniciarSet();
        when(partidoRepo.guardar(any())).thenReturn(partido);
        when(setRepo.guardar(any(), any())).thenReturn(set);
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));

        gestor.confirmarInicioPartido(partido.getId(), set.getId());
        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
        assertThat(set.getEstado()).isEqualTo(EstadoSet.EN_CURSO);
    }

    @Test
    void confirmarInicioPartidoLanzaReglaDeNegocioSiElDominioRechaza() {
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));

        assertThatThrownBy(() -> gestor.confirmarInicioPartido(partido.getId(), set.getId()))
                .isInstanceOf(ReglaDeNegocioException.class)
                .hasMessage("El set no está en estado PENDIENTE");

        verify(partidoRepo, never()).guardar(any());
    }

    @Test
    void confirmarInicioPartidoConSetDeOtroPartidoLanzaRecursoNoEncontradoYSinPersistir() {
        Partido otroPartido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        SetPartido setDeOtroPartido = otroPartido.iniciarSet();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(setDeOtroPartido.getId())).thenReturn(Optional.of(setDeOtroPartido));
        when(setRepo.buscarPartidoId(setDeOtroPartido.getId())).thenReturn(Optional.of(otroPartido.getId()));

        assertThatThrownBy(() -> gestor.confirmarInicioPartido(partido.getId(), setDeOtroPartido.getId()))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setDeOtroPartido.getId());

        verify(partidoRepo, never()).guardar(any());
        verify(setRepo, never()).guardar(any(), any());
    }

    @Test
    void confirmarInicioPartidoConSetInexistenteLanzaRecursoNoEncontradoYSinPersistir() {
        UUID setId = UUID.randomUUID();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(setRepo.buscarPorId(setId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.confirmarInicioPartido(partido.getId(), setId))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setId);

        verify(partidoRepo, never()).guardar(any());
        verify(setRepo, never()).guardar(any(), any());
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
        PizarraEnVivoDTO pizarra =
                new PizarraEnVivoDTO(
                        new PizarraEnVivoDTO.EquipoPizarraDTO(
                                equipoLocal.getId(), equipoLocal.getNombreClub()),
                        new PizarraEnVivoDTO.EquipoPizarraDTO(
                                equipoVisitante.getId(), equipoVisitante.getNombreClub()),
                        0,
                        0,
                        new PizarraEnVivoDTO.SetActualDTO(1, false, 25, 1, 0),
                        equipoLocal.getId(),
                        "EN_CURSO",
                        "EN_CURSO",
                        List.of(
                                new PizarraEnVivoDTO.EventoPizarraDTO(
                                        jugador.getId(), "Jugador Test", "ATAQUE")));
        when(gestorPizarra.obtenerPizarra(partido.getId())).thenReturn(pizarra);

        ConfirmacionDTO result = gestor.confirmarPunto(
                partido.getId(), equipoLocal.getId(), jugador.getId(), "ATAQUE");

        assertThat(result.mensaje()).contains("Punto registrado");
        assertThat(set.getMarcador().getPuntos(partido.getLados().get(0))).isEqualTo(1);
        verify(gestorPizarra).obtenerPizarra(partido.getId());
        verify(notificadorPizarra).notificarCambioPizarra(
                eq(partido.getId()),
                argThat(cambio -> "PUNTO_REGISTRADO".equals(cambio.tipo())
                        && cambio.evento().jugadorId().equals(jugador.getId())
                        && cambio.evento().fundamento().equals("ATAQUE")
                        && cambio.pizarra() == pizarra));
    }

    @Test
    void confirmarPuntoConEquipoNoParticipanteLanzaReglaDeNegocio() {
        Equipo desconocido = new Equipo(UUID.randomUUID(), "Otro", "X");
        partido.iniciar();
        partido.iniciarSet().iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(desconocido.getId())).thenReturn(Optional.of(desconocido));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        assertThatThrownBy(() -> gestor.confirmarPunto(
                partido.getId(), desconocido.getId(), jugador.getId(), "ATAQUE"))
                .isInstanceOf(ReglaDeNegocioException.class)
                .hasMessage("El equipo no pertenece a este partido");
    }

    @Test
    void confirmarPuntoConFundamentoInvalidoLanzaIllegalArgumentException() {
        partido.iniciar();
        partido.iniciarSet().iniciar();
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));
        when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
        when(jugadorRepo.buscarPorId(jugador.getId())).thenReturn(Optional.of(jugador));

        assertThatThrownBy(() -> gestor.confirmarPunto(
                partido.getId(), equipoLocal.getId(), jugador.getId(), "NO_EXISTE"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Fundamento inválido: NO_EXISTE");
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
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));

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

        // The domain rejects with a business rule before any persistence call
        assertThatThrownBy(() -> gestor.confirmarPunto(
                partido.getId(), desconocido.getId(), jugador.getId(), "ATAQUE"))
                .isInstanceOf(ReglaDeNegocioException.class);

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
        when(setRepo.buscarPartidoId(set.getId())).thenReturn(Optional.of(partido.getId()));
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

    @Test
    void cargarOpcionesPuntoConSetDesconocidoLanzaRecursoNoEncontrado() {
        UUID setId = UUID.randomUUID();
        when(setRepo.buscarPorId(setId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.cargarOpcionesPunto(setId, equipoLocal.getId()))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Set no encontrado: " + setId);

        verifyNoInteractions(equipoRepo);
    }

    @Test
    void cargarOpcionesPuntoConEquipoDesconocidoLanzaRecursoNoEncontrado() {
        SetPartido set = partido.iniciarSet();
        UUID equipoId = UUID.randomUUID();
        when(setRepo.buscarPorId(set.getId())).thenReturn(Optional.of(set));
        when(equipoRepo.buscarPorId(equipoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.cargarOpcionesPunto(set.getId(), equipoId))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Equipo no encontrado: " + equipoId);
    }
}
