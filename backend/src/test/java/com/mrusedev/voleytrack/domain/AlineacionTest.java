package com.mrusedev.voleytrack.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class AlineacionTest {

    private Equipo equipo;
    private Jugador titular1, titular2, titular3, titular4, titular5, titular6;
    private Jugador libero;

    @BeforeEach
    void setUp() {
        equipo = new Equipo(UUID.randomUUID(), "Club A", "Entrenador A");
        titular1 = crearJugador("T1", 1, Posicion.ARMADOR);
        titular2 = crearJugador("T2", 2, Posicion.PUNTA_RECEPTOR);
        titular3 = crearJugador("T3", 3, Posicion.PUNTA_RECEPTOR);
        titular4 = crearJugador("T4", 4, Posicion.OPUESTO);
        titular5 = crearJugador("T5", 5, Posicion.CENTRAL);
        titular6 = crearJugador("T6", 6, Posicion.CENTRAL);
        libero = crearJugador("L1", 99, Posicion.LIBERO);
    }

    // ── RF-8: Selección de alineación ──

    @Test
    void alineacionSeCreaVaciaParaUnEquipo() {
        Alineacion alineacion = new Alineacion(equipo);

        assertThat(alineacion.getEquipo()).isEqualTo(equipo);
        assertThat(alineacion.getJugadoresEnCancha()).isEmpty();
    }

    @Test
    void agregarJugadorTitularALaAlineacion() {
        Alineacion alineacion = new Alineacion(equipo);
        alineacion.agregarJugador(titular1, 1, true);

        assertThat(alineacion.getJugadoresEnCancha()).hasSize(1);
        AlineacionJugador aj = alineacion.getJugadoresEnCancha().get(0);
        assertThat(aj.getJugador()).isEqualTo(titular1);
        assertThat(aj.getPosicion()).isEqualTo(1);
        assertThat(aj.isEsTitular()).isTrue();
    }

    @Test
    void alineacionCompletaConSeisTitularesYUnLibero() {
        Alineacion alineacion = new Alineacion(equipo);

        alineacion.agregarJugador(titular1, 1, true);
        alineacion.agregarJugador(titular2, 2, true);
        alineacion.agregarJugador(titular3, 3, true);
        alineacion.agregarJugador(titular4, 4, true);
        alineacion.agregarJugador(titular5, 5, true);
        alineacion.agregarJugador(titular6, 6, true);
        alineacion.agregarJugador(libero, 7, false);

        assertThat(alineacion.getJugadoresEnCancha()).hasSize(7);
    }

    @Test
    void getJugadorEnPosicionDevuelveJugadorCorrecto() {
        Alineacion alineacion = new Alineacion(equipo);
        alineacion.agregarJugador(titular1, 1, true);
        alineacion.agregarJugador(titular4, 4, true);

        assertThat(alineacion.getJugadorEnPosicion(1).getJugador()).isEqualTo(titular1);
        assertThat(alineacion.getJugadorEnPosicion(4).getJugador()).isEqualTo(titular4);
        assertThat(alineacion.getJugadorEnPosicion(3)).isNull();
    }

    // ── Equipo y Jugador ──

    @Test
    void equipoPuedeAgregarYListarJugadores() {
        Equipo e = new Equipo(UUID.randomUUID(), "Club", "Entrenador");
        Jugador j = crearJugador("Nuevo", 10, Posicion.CENTRAL);

        e.agregarJugador(j);

        assertThat(e.getJugadores()).contains(j);
        assertThat(e.getJugadoresActivos()).contains(j);
    }

    @Test
    void jugadorDesactivadoNoApareceEnActivos() {
        Equipo e = new Equipo(UUID.randomUUID(), "Club", "Entrenador");
        Jugador j = crearJugador("Inactivo", 10, Posicion.CENTRAL);
        e.agregarJugador(j);

        j.desactivar();

        assertThat(e.getJugadores()).contains(j);          // sigue en la lista completa
        assertThat(e.getJugadoresActivos()).doesNotContain(j); // pero no en activos
    }

    @Test
    void jugadorSeCreaActivoPorDefecto() {
        Jugador j = crearJugador("Nuevo", 10, Posicion.ARMADOR);
        assertThat(j.isActivo()).isTrue();
    }

    @Test
    void removerJugadorDeEquipo() {
        Equipo e = new Equipo(UUID.randomUUID(), "Club", "Entrenador");
        Jugador j = crearJugador("Sale", 10, Posicion.CENTRAL);
        e.agregarJugador(j);

        e.removerJugador(j);

        assertThat(e.getJugadores()).doesNotContain(j);
    }

    // ── Plantel ──

    @Test
    void plantelVinculaEquipoYJugador() {
        Plantel plantel = new Plantel(UUID.randomUUID(), equipo, titular1);

        assertThat(plantel.getEquipo()).isEqualTo(equipo);
        assertThat(plantel.getJugador()).isEqualTo(titular1);
        assertThat(plantel.isActivo()).isTrue();
        assertThat(plantel.getFechaAsignacion()).isNotNull();
    }

    @Test
    void plantelSePuedeDesvincular() {
        Plantel plantel = new Plantel(UUID.randomUUID(), equipo, titular1);
        plantel.desvincular();

        assertThat(plantel.isActivo()).isFalse();
    }

    // ── helpers ──

    private Jugador crearJugador(String nombre, int dorsal, Posicion posicion) {
        return new Jugador(UUID.randomUUID(), nombre, "Apellido",
                LocalDate.of(2000, 1, 1), dorsal, posicion);
    }
}
