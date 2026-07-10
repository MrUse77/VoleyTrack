package com.mrusedev.voleytrack.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PartidoTest {

    private Equipo equipoLocal;
    private Equipo equipoVisitante;
    private Jugador jugadorLocal;
    private Jugador jugadorVisitante;

    @BeforeEach
    void setUp() {
        equipoLocal = new Equipo(UUID.randomUUID(), "Club A", "Entrenador A");
        equipoVisitante = new Equipo(UUID.randomUUID(), "Club B", "Entrenador B");
        jugadorLocal = new Jugador(UUID.randomUUID(), "Jugador", "Local",
                LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
        jugadorVisitante = new Jugador(UUID.randomUUID(), "Jugador", "Visitante",
                LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
    }

    // ── RF-6: Creación de partido ──

    @Test
    void partidoSeCreaEnEstadoProgramado() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));

        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.PROGRAMADO);
        assertThat(partido.getLados()).hasSize(2);
        assertThat(partido.getSets()).isEmpty();
    }

    @Test
    void partidoConoceSusLados() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));

        Lado ladoLocal = partido.getLados().get(0);
        Lado ladoVisitante = partido.getLados().get(1);

        assertThat(ladoLocal.getTipo()).isEqualTo(TipoLado.LOCAL);
        assertThat(ladoLocal.getEquipo()).isEqualTo(equipoLocal);
        assertThat(ladoVisitante.getTipo()).isEqualTo(TipoLado.VISITANTE);
        assertThat(ladoVisitante.getEquipo()).isEqualTo(equipoVisitante);
    }

    // ── resolverLado ──

    @Test
    void resolverLadoDevuelveLadoCorrecto() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));

        assertThat(partido.resolverLado(equipoLocal).getTipo()).isEqualTo(TipoLado.LOCAL);
        assertThat(partido.resolverLado(equipoVisitante).getTipo()).isEqualTo(TipoLado.VISITANTE);
    }

    @Test
    void resolverLadoLanzaExcepcionParaEquipoDesconocido() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        Equipo desconocido = new Equipo(UUID.randomUUID(), "Otro", "Otro");

        assertThatThrownBy(() -> partido.resolverLado(desconocido))
                .isInstanceOf(IllegalArgumentException.class);
    }

    // ── RF-9: Inicio del partido ──

    @Test
    void iniciarCambiaEstadoAEnCurso() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        partido.iniciar();

        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
    }

    @Test
    void iniciarPartidoYaIniciadoLanzaExcepcion() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        partido.iniciar();

        assertThatThrownBy(() -> partido.iniciar())
                .isInstanceOf(IllegalStateException.class);
    }

    // ── iniciarSet ──

    @Test
    void iniciarSetCreaNuevoSetYLoAgrega() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        partido.iniciar();

        SetPartido set = partido.iniciarSet();
        assertThat(set.getNumeroSet()).isEqualTo(1);
        assertThat(set.isEsTieBreak()).isFalse();
        assertThat(partido.getSets()).hasSize(1);
        assertThat(partido.getSetActual()).isEqualTo(set);
    }

    @Test
    void quintoSetEnPartidoA5EsTieBreak() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        partido.iniciar();

        for (int i = 0; i < 4; i++) {
            partido.iniciarSet();
        }
        SetPartido tieBreak = partido.iniciarSet();
        assertThat(tieBreak.getNumeroSet()).isEqualTo(5);
        assertThat(tieBreak.isEsTieBreak()).isTrue();
        assertThat(tieBreak.getMarcador().getLimitePuntos()).isEqualTo(15);
    }

    @Test
    void tercerSetEnPartidoA3EsTieBreak() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(3));
        partido.iniciar();

        partido.iniciarSet();
        partido.iniciarSet();
        SetPartido tieBreak = partido.iniciarSet();
        assertThat(tieBreak.getNumeroSet()).isEqualTo(3);
        assertThat(tieBreak.isEsTieBreak()).isTrue();
    }

    // ── RF-10: Registro de punto ──

    @Test
    void anotarPuntoIncrementaMarcador() {
        Partido partido = crearPartidoEnCursoConSetIniciado(5);
        SetPartido set = partido.getSetActual();
        set.iniciar();

        Evento evento = partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);

        assertThat(evento).isNotNull();
        assertThat(evento.getJugador()).isEqualTo(jugadorLocal);
        assertThat(evento.getTipoFundamento()).isEqualTo(TipoFundamento.ATAQUE);
        assertThat(set.getMarcador().getPuntos(partido.getLados().get(0))).isEqualTo(1);
    }

    @Test
    void anotarPuntoConPartidoNoIniciadoLanzaExcepcion() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));

        assertThatThrownBy(() -> partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE))
                .isInstanceOf(IllegalStateException.class);
    }

    // ── RN-04: Condición de victoria ──

    @Test
    void partidoAlMejorDe5TerminaCuandoUnEquipoGana3Sets() {
        Partido partido = crearPartidoEnCursoConSetIniciado(5);

        // ganar 3 sets para local
        for (int s = 0; s < 3; s++) {
            if (s > 0) {
                partido.iniciarSet();
            }
            SetPartido set = partido.getSetActual();
            set.iniciar();
            // local gana 25-0
            for (int i = 0; i < 25; i++) {
                partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);
            }
        }

        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.FINALIZADO);
        assertThat(partido.getGanador().getEquipo()).isEqualTo(equipoLocal);
    }

    @Test
    void partidoAlMejorDe3TerminaCuandoUnEquipoGana2Sets() {
        Partido partido = crearPartidoEnCursoConSetIniciado(3);

        for (int s = 0; s < 2; s++) {
            if (s > 0) {
                partido.iniciarSet();
            }
            SetPartido set = partido.getSetActual();
            set.iniciar();
            for (int i = 0; i < 25; i++) {
                partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.ATAQUE);
            }
        }

        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.FINALIZADO);
        assertThat(partido.getGanador().getEquipo()).isEqualTo(equipoVisitante);
    }

    @Test
    void partidoNoTerminaSiFaltanSetsPorGanar() {
        Partido partido = crearPartidoEnCursoConSetIniciado(5);

        // ganar solo 2 sets
        for (int s = 0; s < 2; s++) {
            if (s > 0) partido.iniciarSet();
            SetPartido set = partido.getSetActual();
            set.iniciar();
            for (int i = 0; i < 25; i++) {
                partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);
            }
        }

        assertThat(partido.getEstado()).isEqualTo(EstadoPartido.EN_CURSO);
        assertThat(partido.getGanador()).isNull();
    }

    // ── RN-03: Cambio de lado en tie-break a los 8 puntos ──

    @Test
    void tieBreakIndicaCambioDeLadoAlLlegarAOchoPuntos() {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
        partido.iniciar();

        // Alternar ganadores para llegar 2-2 al tie-break
        Equipo[] ganadores = {equipoLocal, equipoVisitante, equipoLocal, equipoVisitante};
        Jugador[] jugadores = {jugadorLocal, jugadorVisitante, jugadorLocal, jugadorVisitante};
        for (int s = 0; s < 4; s++) {
            partido.iniciarSet();
            SetPartido set = partido.getSetActual();
            set.iniciar();
            for (int i = 0; i < 25; i++) {
                partido.anotarPunto(ganadores[s], jugadores[s], TipoFundamento.ATAQUE);
            }
        }

        // Quinto set (tie-break)
        SetPartido tieBreak = partido.iniciarSet();
        tieBreak.iniciar();

        // Antes de 8 puntos no hay cambio de lado
        for (int i = 0; i < 4; i++) {
            partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);
            partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.ATAQUE);
        }
        // 4-4, suma de puntos = 8 → cambio de lado
        assertThat(tieBreak.debeCambiarDeLado()).isTrue();
    }

    // ── helpers ──

    private Partido crearPartidoEnCursoConSetIniciado(int cantSets) {
        Partido partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(cantSets));
        partido.iniciar();
        partido.iniciarSet();
        return partido;
    }
}
