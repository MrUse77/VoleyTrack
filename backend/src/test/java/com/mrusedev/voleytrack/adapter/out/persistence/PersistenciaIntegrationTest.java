package com.mrusedev.voleytrack.adapter.out.persistence;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Posicion;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class PersistenciaIntegrationTest {

    @Autowired
    private JugadorRepositoryPort jugadorRepo;

    @Autowired
    private EquipoRepositoryPort equipoRepo;

    @Test
    void guardarYRecuperarJugador() {
        UUID id = UUID.randomUUID();
        Jugador jugador = new Jugador(id, "Agustín", "Gómez",
                LocalDate.of(1995, 6, 15), 10, Posicion.ARMADOR);

        jugadorRepo.guardar(jugador);

        Optional<Jugador> found = jugadorRepo.buscarPorId(id);
        assertThat(found).isPresent();
        assertThat(found.get().getNombre()).isEqualTo("Agustín");
        assertThat(found.get().getDorsal()).isEqualTo(10);
        assertThat(found.get().getPosicion()).isEqualTo(Posicion.ARMADOR);
    }

    @Test
    void guardarYRecuperarEquipo() {
        UUID id = UUID.randomUUID();
        Equipo equipo = new Equipo(id, "Club Voley A", "Entrenador X");

        equipoRepo.guardar(equipo);

        Optional<Equipo> found = equipoRepo.buscarPorId(id);
        assertThat(found).isPresent();
        assertThat(found.get().getNombreClub()).isEqualTo("Club Voley A");
        assertThat(found.get().getEntrenador()).isEqualTo("Entrenador X");
    }

    @Test
    void jugadorDesactivadoSePersisteCorrectamente() {
        UUID id = UUID.randomUUID();
        Jugador jugador = new Jugador(id, "Inactivo", "Test",
                LocalDate.of(2000, 1, 1), 5, Posicion.CENTRAL);
        jugador.desactivar();

        jugadorRepo.guardar(jugador);

        Jugador found = jugadorRepo.buscarPorId(id).orElseThrow();
        assertThat(found.isActivo()).isFalse();
    }
}
