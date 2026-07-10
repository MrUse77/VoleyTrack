package com.mrusedev.voleytrack.adapter.out.persistence;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.EventoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PartidoPersistenciaIntegrationTest {

    @Autowired
    private EquipoRepositoryPort equipoRepo;

    @Autowired
    private PartidoRepositoryPort partidoRepo;

    @Autowired
    private SetRepositoryPort setRepo;

    @Autowired
    private JugadorRepositoryPort jugadorRepo;

    @Autowired
    private EventoRepositoryPort eventoRepo;

    private Equipo equipoLocal;
    private Equipo equipoVisitante;
    private Jugador jugador;
    private Partido partido;
    private UUID partidoId;

    @BeforeEach
    void setUp() {
        equipoLocal = new Equipo(UUID.randomUUID(), "Club Local Test", "Entrenador L");
        equipoVisitante = new Equipo(UUID.randomUUID(), "Club Visitante Test", "Entrenador V");
        equipoRepo.guardar(equipoLocal);
        equipoRepo.guardar(equipoVisitante);

        jugador = new Jugador(UUID.randomUUID(), "Jugador", "Test",
                LocalDate.of(2000, 1, 1), 10, Posicion.PUNTA_RECEPTOR);
        equipoLocal.agregarJugador(jugador);
        jugadorRepo.guardar(jugador);

        partidoId = UUID.randomUUID();
        partido = new Partido(partidoId, equipoLocal, equipoVisitante, new CantSets(5));
    }

    // ── Round-trip tests ──

    @Test
    void partidoRoundTripPreservaIdFechaHoraYEstado() {
        LocalDateTime beforeSave = partido.getFechaHora();
        partido.iniciar();
        partido.iniciarSet();

        partidoRepo.guardar(partido);
        SetPartido set = partido.getSetActual();
        setRepo.guardar(set, partido.getId());

        Optional<Partido> loaded = partidoRepo.buscarPorId(partidoId);
        assertThat(loaded).isPresent();

        Partido p = loaded.get();
        assertThat(p.getId()).isEqualTo(partidoId);
        // H2 round-trips only millisecond precision
        assertThat(p.getFechaHora().truncatedTo(ChronoUnit.MILLIS))
                .isEqualTo(beforeSave.truncatedTo(ChronoUnit.MILLIS));
        assertThat(p.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
        assertThat(p.getCantSets().getCantidad()).isEqualTo(5);
        assertThat(p.getLados()).hasSize(2);

        Lado ladoLocal = p.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.LOCAL).findFirst().orElseThrow();
        Lado ladoVisitante = p.getLados().stream()
                .filter(l -> l.getTipo() == TipoLado.VISITANTE).findFirst().orElseThrow();
        assertThat(ladoLocal.getEquipo().getId()).isEqualTo(equipoLocal.getId());
        assertThat(ladoLocal.getEquipo().getNombreClub()).isEqualTo("Club Local Test");
        assertThat(ladoVisitante.getEquipo().getId()).isEqualTo(equipoVisitante.getId());
        assertThat(ladoVisitante.getEquipo().getNombreClub()).isEqualTo("Club Visitante Test");
    }

    @Test
    void setRoundTripPreservaIdEstadoMarcadorCambiosYSaque() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        set.asignarSaqueInicial(equipoLocal);
        UUID setId = set.getId();

        set.getMarcador().incrementar(partido.resolverLado(equipoLocal));
        set.getMarcador().incrementar(partido.resolverLado(equipoLocal));
        set.getMarcador().incrementar(partido.resolverLado(equipoVisitante));
        set.getCambiosLocal().consumir();
        set.getCambiosVisitante().consumir();
        set.getCambiosVisitante().consumir();

        partidoRepo.guardar(partido);
        setRepo.guardar(set, partido.getId());

        Optional<SetPartido> loaded = setRepo.buscarPorId(setId);
        assertThat(loaded).isPresent();

        SetPartido s = loaded.get();
        assertThat(s.getId()).isEqualTo(setId);
        assertThat(s.getNumeroSet()).isEqualTo(1);
        assertThat(s.getEstado()).isEqualTo(EstadoSet.EN_CURSO);
        assertThat(s.getSaque().getId()).isEqualTo(equipoLocal.getId());
        assertThat(s.getCambiosLocal().quedanDisponibles()).isEqualTo(5);
        assertThat(s.getCambiosVisitante().quedanDisponibles()).isEqualTo(4);

        Lado ladoLocal = s.getMarcador().getLadoLocal();
        Lado ladoVisitante = s.getMarcador().getLadoVisitante();
        assertThat(s.getMarcador().getPuntos(ladoLocal)).isEqualTo(2);
        assertThat(s.getMarcador().getPuntos(ladoVisitante)).isEqualTo(1);
    }

    @Test
    void setReconstruidoPreservaEquiposRealesNoStubs() {
        partidoRepo.guardar(partido);
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        setRepo.guardar(set, partido.getId());

        Optional<SetPartido> loaded = setRepo.buscarPorId(set.getId());
        assertThat(loaded).isPresent();

        SetPartido s = loaded.get();
        Lado ladoLocal = s.getMarcador().getLadoLocal();
        Lado ladoVisitante = s.getMarcador().getLadoVisitante();

        assertThat(ladoLocal.getEquipo().getId()).isEqualTo(equipoLocal.getId());
        assertThat(ladoLocal.getEquipo().getNombreClub()).isEqualTo("Club Local Test");
        assertThat(ladoVisitante.getEquipo().getId()).isEqualTo(equipoVisitante.getId());
        assertThat(ladoVisitante.getEquipo().getNombreClub()).isEqualTo("Club Visitante Test");
        assertThat(ladoLocal.getEquipo().getId()).isNotEqualTo(UUID.randomUUID());
    }

    @Test
    void partidoReconstruidoTieneMismaFechaHoraQueElOriginal() {
        LocalDateTime originalFecha = partido.getFechaHora();
        partidoRepo.guardar(partido);

        Partido loaded = partidoRepo.buscarPorId(partidoId).orElseThrow();
        // H2 round-trips only millisecond precision
        assertThat(loaded.getFechaHora().truncatedTo(ChronoUnit.MILLIS))
                .isEqualTo(originalFecha.truncatedTo(ChronoUnit.MILLIS));
        assertThat(loaded.getFechaHora()).isBeforeOrEqualTo(LocalDateTime.now());
    }

    // ── Defect 1: Reloading a Partido preserves its persisted sets ──

    @Test
    void partidoReloadedPreservesPersistedSets() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        partidoRepo.guardar(partido);
        setRepo.guardar(set, partido.getId());

        Partido reloaded = partidoRepo.buscarPorId(partidoId).orElseThrow();
        assertThat(reloaded.getSets()).hasSize(1);
        assertThat(reloaded.getSetActual()).isNotNull();
        assertThat(reloaded.getSetActual().getId()).isEqualTo(set.getId());
        // The loaded match must permit continued scoring
        reloaded.getSetActual().iniciar();
        assertThat(reloaded.getSetActual().getEstado()).isEqualTo(EstadoSet.EN_CURSO);
    }

    // ── Defect 2: Reloading a Set preserves its persisted events ──

    @Test
    void setReloadedPreservesPersistedEvents() {
        partido.iniciar();
        SetPartido set = partido.iniciarSet();
        set.iniciar();
        partidoRepo.guardar(partido);
        setRepo.guardar(set, partido.getId());

        Lado ladoLocal = partido.resolverLado(equipoLocal);
        Evento evt = set.registrarPunto(ladoLocal, jugador, TipoFundamento.ATAQUE);
        setRepo.guardar(set, partido.getId());
        eventoRepo.guardar(evt, set.getId());

        SetPartido reloaded = setRepo.buscarPorId(set.getId()).orElseThrow();
        // Point-by-point history must survive reload
        assertThat(reloaded.getEventos()).hasSize(1);
        assertThat(reloaded.getEventos().get(0).getId()).isEqualTo(evt.getId());
        assertThat(reloaded.getEventos().get(0).getTipoFundamento()).isEqualTo(TipoFundamento.ATAQUE);
        assertThat(reloaded.getEventos().get(0).getJugador().getId()).isEqualTo(jugador.getId());
    }
}
