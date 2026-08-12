package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.port.out.*;
import com.mrusedev.voleytrack.domain.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class GestorPartidoTransactionalIntegrationTest {

    @Autowired
    private EquipoRepositoryPort equipoRepo;

    @Autowired
    private PartidoRepositoryPort partidoRepo;

    @Autowired
    private SetRepositoryPort setRepo;

    @Autowired
    private JugadorRepositoryPort jugadorRepo;

    @Autowired
    private GestorPartidoImpl gestor;

    /** Replaced with a mock so guardar() throws — simulates a DB failure
     *  that must roll back the entire @Transactional unit. */
    @MockitoBean
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

    @Test
    void confirmarPuntoRollsBackAllStateWhenEventoPersistenceFails() {
        // Arrange: match in progress with a real persisted set
        partido.iniciar();
        partido.iniciarSet().iniciar();
        partidoRepo.guardar(partido);
        setRepo.guardar(partido.getSetActual(), partido.getId());

        // Simulate DB failure on eventoRepo — every guardar() call will throw
        when(eventoRepo.guardar(any(), any()))
                .thenThrow(new RuntimeException("Simulated DB failure"));

        // Act & Assert: the RuntimeException propagates out of @Transactional
        assertThatThrownBy(() ->
                gestor.confirmarPunto(
                            partido.getId(), equipoLocal.getId(), jugador.getId(), "ATAQUE"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Simulated DB failure");

        // Verify NO partial state persisted: the transaction must have rolled back
        Partido reloaded = partidoRepo.buscarPorId(partidoId).orElseThrow();
        SetPartido reloadedSet = reloaded.getSetActual();
        assertThat(reloadedSet).isNotNull();

        int puntosLocal = reloadedSet.getMarcador().getPuntos(
                reloadedSet.getMarcador().getLadoLocal());
        int puntosVisitante = reloadedSet.getMarcador().getPuntos(
                reloadedSet.getMarcador().getLadoVisitante());
        assertThat(puntosLocal).isZero();
        assertThat(puntosVisitante).isZero();
        assertThat(reloadedSet.getEventos()).isEmpty();
    }
}
