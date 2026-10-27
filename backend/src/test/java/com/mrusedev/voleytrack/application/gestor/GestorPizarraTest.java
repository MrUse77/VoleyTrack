package com.mrusedev.voleytrack.application.gestor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.domain.CantSets;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.Posicion;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.TipoFundamento;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GestorPizarraTest {

    @Mock private PartidoRepositoryPort partidoRepo;

    @InjectMocks private GestorPizarra gestor;

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

    // ── obtenerPizarra ──

    @Test
    void obtenerPizarraDerivaEstadoPuntosSaqueYEventosDelAgregado() {
        Jugador jugadorLocal2 = new Jugador(UUID.randomUUID(), "Jugador", "Local2",
                LocalDate.of(2000, 1, 1), 2, Posicion.PUNTA_RECEPTOR);
        Jugador jugadorVisitante = new Jugador(UUID.randomUUID(), "Jugador", "Visitante",
                LocalDate.of(2000, 1, 1), 3, Posicion.PUNTA_RECEPTOR);

        partido.iniciar();
        SetPartido set1 = partido.iniciarSet();
        set1.iniciar();
        for (int i = 0; i < 15; i++) {
            partido.anotarPunto(equipoLocal, jugador, TipoFundamento.ATAQUE);
        }
        for (int i = 0; i < 10; i++) {
            partido.anotarPunto(equipoLocal, jugadorLocal2, TipoFundamento.BLOQUEO);
        }

        SetPartido set2 = partido.iniciarSet();
        set2.iniciar();
        set2.asignarSaqueInicial(equipoVisitante);
        partido.anotarPunto(equipoLocal, jugador, TipoFundamento.SAQUE);
        partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.DEFENSA);
        partido.anotarPunto(equipoLocal, jugador, TipoFundamento.ATAQUE);
        partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.BLOQUEO);

        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        PizarraEnVivoDTO pizarra = gestor.obtenerPizarra(partido.getId());

        assertThat(pizarra.equipoLocal().id()).isEqualTo(equipoLocal.getId());
        assertThat(pizarra.equipoLocal().nombre()).isEqualTo("Club Local");
        assertThat(pizarra.equipoVisitante().id()).isEqualTo(equipoVisitante.getId());
        assertThat(pizarra.equipoVisitante().nombre()).isEqualTo("Club Visitante");
        assertThat(pizarra.setsLocal()).isEqualTo(1);
        assertThat(pizarra.setsVisitante()).isZero();
        assertThat(pizarra.setActual().numeroSet()).isEqualTo(2);
        assertThat(pizarra.setActual().esTieBreak()).isFalse();
        assertThat(pizarra.setActual().limitePuntos()).isEqualTo(25);
        assertThat(pizarra.setActual().puntosLocal()).isEqualTo(2);
        assertThat(pizarra.setActual().puntosVisitante()).isEqualTo(2);
        assertThat(pizarra.equipoSaqueId()).isEqualTo(equipoVisitante.getId());
        assertThat(pizarra.estadoPartido()).isEqualTo("EN_CURSO");
        assertThat(pizarra.estadoSet()).isEqualTo("EN_CURSO");
        assertThat(pizarra.ultimosEventos()).hasSize(10);
        assertThat(pizarra.ultimosEventos().getFirst().jugadorId()).isEqualTo(jugadorLocal2.getId());
        assertThat(pizarra.ultimosEventos().getFirst().jugadorNombre()).isEqualTo("Jugador Local2");
        assertThat(pizarra.ultimosEventos().getFirst().tipoFundamento()).isEqualTo("BLOQUEO");
        assertThat(pizarra.ultimosEventos().getLast().jugadorId()).isEqualTo(jugadorVisitante.getId());
        assertThat(pizarra.ultimosEventos().getLast().jugadorNombre()).isEqualTo("Jugador Visitante");
        assertThat(pizarra.ultimosEventos().getLast().tipoFundamento()).isEqualTo("BLOQUEO");
    }

    @Test
    void obtenerPizarraInexistenteLanzaRecursoNoEncontrado() {
        UUID partidoId = UUID.randomUUID();
        when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> gestor.obtenerPizarra(partidoId))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessage("Partido no encontrado: " + partidoId);
    }

    @Test
    void obtenerPizarraSinSetsDevuelveCamposNulosYEventosVacios() {
        when(partidoRepo.buscarPorId(partido.getId())).thenReturn(Optional.of(partido));

        PizarraEnVivoDTO pizarra = gestor.obtenerPizarra(partido.getId());

        assertThat(pizarra.setActual()).isNull();
        assertThat(pizarra.estadoSet()).isNull();
        assertThat(pizarra.equipoSaqueId()).isNull();
        assertThat(pizarra.ultimosEventos()).isEmpty();
        assertThat(pizarra.estadoPartido()).isEqualTo("PROGRAMADO");
    }
}
