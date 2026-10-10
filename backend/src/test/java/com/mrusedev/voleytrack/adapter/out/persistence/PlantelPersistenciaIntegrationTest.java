package com.mrusedev.voleytrack.adapter.out.persistence;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Posicion;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PlantelPersistenciaIntegrationTest {

    @Autowired
    private EquipoRepositoryPort equipoRepo;

    @Autowired
    private JugadorRepositoryPort jugadorRepo;

    @Autowired
    private JdbcTemplate jdbc;

    // ── (a) buscarPorId rehydrates the active roster ──

    @Test
    void buscarPorIdRehidrataJugadoresActivosDelPlantel() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        Equipo equipo = new Equipo(UUID.randomUUID(), "Club Plantel " + suffix, "Entrenador " + suffix);
        equipoRepo.guardar(equipo);

        Jugador jugador1 = new Jugador(UUID.randomUUID(), "NombreUno" + suffix, "ApellidoUno" + suffix,
                LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
        Jugador jugador2 = new Jugador(UUID.randomUUID(), "NombreDos" + suffix, "ApellidoDos" + suffix,
                LocalDate.of(2001, 2, 2), 2, Posicion.ARMADOR);
        jugadorRepo.guardar(jugador1);
        jugadorRepo.guardar(jugador2);

        insertarPlantel(equipo.getId(), jugador1.getId(), true);
        insertarPlantel(equipo.getId(), jugador2.getId(), true);

        Equipo recargado = equipoRepo.buscarPorId(equipo.getId()).orElseThrow();

        assertThat(recargado.getJugadores()).hasSize(2);
        assertThat(recargado.getJugadoresActivos()).hasSize(2);

        assertThat(recargado.getJugadoresActivos())
                .extracting(Jugador::getId)
                .containsExactlyInAnyOrder(jugador1.getId(), jugador2.getId());

        Jugador uno = jugadorDe(recargado, jugador1.getId());
        assertThat(uno.getNombre()).isEqualTo(jugador1.getNombre());
        assertThat(uno.getDorsal()).isEqualTo(1);
        assertThat(uno.getPosicion()).isEqualTo(Posicion.PUNTA_RECEPTOR);

        Jugador dos = jugadorDe(recargado, jugador2.getId());
        assertThat(dos.getNombre()).isEqualTo(jugador2.getNombre());
        assertThat(dos.getDorsal()).isEqualTo(2);
        assertThat(dos.getPosicion()).isEqualTo(Posicion.ARMADOR);
    }

    // ── (b) only active jugadores with an active plantel row survive ──

    @Test
    void buscarPorIdOmitePlantelInactivoYJugadoresDesactivados() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        Equipo equipo = new Equipo(UUID.randomUUID(), "Club Filtro " + suffix, "Entrenador " + suffix);
        equipoRepo.guardar(equipo);

        Jugador activoEnPlantel = new Jugador(UUID.randomUUID(), "Activo" + suffix, "Apellido" + suffix,
                LocalDate.of(2000, 3, 3), 3, Posicion.CENTRAL);
        Jugador plantelInactivo = new Jugador(UUID.randomUUID(), "FueraPlantel" + suffix, "Apellido" + suffix,
                LocalDate.of(2000, 4, 4), 4, Posicion.OPUESTO);
        Jugador jugadorDesactivado = new Jugador(UUID.randomUUID(), "Desactivado" + suffix, "Apellido" + suffix,
                LocalDate.of(2000, 5, 5), 5, Posicion.LIBERO);
        jugadorDesactivado.desactivar();

        jugadorRepo.guardar(activoEnPlantel);
        jugadorRepo.guardar(plantelInactivo);
        jugadorRepo.guardar(jugadorDesactivado);

        insertarPlantel(equipo.getId(), activoEnPlantel.getId(), true);
        insertarPlantel(equipo.getId(), plantelInactivo.getId(), false);
        insertarPlantel(equipo.getId(), jugadorDesactivado.getId(), true);

        Equipo recargado = equipoRepo.buscarPorId(equipo.getId()).orElseThrow();

        assertThat(recargado.getJugadoresActivos()).hasSize(1);
        assertThat(recargado.getJugadoresActivos())
                .extracting(Jugador::getId)
                .containsExactly(activoEnPlantel.getId());

        assertThat(recargado.getJugadores())
                .extracting(Jugador::getId)
                .doesNotContain(plantelInactivo.getId(), jugadorDesactivado.getId());
    }

    // ── (c) buscarTodos rehydrates the roster too ──

    @Test
    void buscarTodosRehidrataJugadoresActivosDelPlantel() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        Equipo equipo = new Equipo(UUID.randomUUID(), "Club Listado " + suffix, "Entrenador " + suffix);
        equipoRepo.guardar(equipo);

        Jugador jugador1 = new Jugador(UUID.randomUUID(), "ListaUno" + suffix, "Apellido" + suffix,
                LocalDate.of(2000, 6, 6), 6, Posicion.PUNTA_RECEPTOR);
        Jugador jugador2 = new Jugador(UUID.randomUUID(), "ListaDos" + suffix, "Apellido" + suffix,
                LocalDate.of(2000, 7, 7), 7, Posicion.CENTRAL);
        jugadorRepo.guardar(jugador1);
        jugadorRepo.guardar(jugador2);

        insertarPlantel(equipo.getId(), jugador1.getId(), true);
        insertarPlantel(equipo.getId(), jugador2.getId(), true);

        Equipo recargado = equipoRepo.buscarTodos().stream()
                .filter(e -> e.getId().equals(equipo.getId()))
                .findFirst()
                .orElseThrow();

        assertThat(recargado.getJugadoresActivos()).hasSize(2);
        assertThat(recargado.getJugadoresActivos())
                .extracting(Jugador::getId)
                .containsExactlyInAnyOrder(jugador1.getId(), jugador2.getId());
    }

    // ── helpers ──

    /** No write port exists for the plantel join table, so seed it directly. */
    private void insertarPlantel(UUID equipoId, UUID jugadorId, boolean activo) {
        jdbc.update("INSERT INTO plantel (equipo_id, jugador_id, fecha_asignacion, activo) VALUES (?, ?, now(), ?)",
                equipoId, jugadorId, activo);
    }

    private Jugador jugadorDe(Equipo equipo, UUID jugadorId) {
        return equipo.getJugadores().stream()
                .filter(j -> j.getId().equals(jugadorId))
                .findFirst()
                .orElseThrow();
    }
}
