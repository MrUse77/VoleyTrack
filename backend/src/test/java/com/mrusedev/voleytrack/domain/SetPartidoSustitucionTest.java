package com.mrusedev.voleytrack.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SetPartidoSustitucionTest {

    private Equipo equipoLocal;
    private Equipo equipoVisitante;
    private Lado ladoLocal;
    private Lado ladoVisitante;
    private SetPartido set;

    private Jugador titular1;
    private Jugador titular2;
    private Jugador suplente1;
    private Jugador suplente2;
    private Jugador libero;

    @BeforeEach
    void setUp() {
        equipoLocal = new Equipo(UUID.randomUUID(), "Club A", "Entrenador A");
        equipoVisitante = new Equipo(UUID.randomUUID(), "Club B", "Entrenador B");
        ladoLocal = new Lado(TipoLado.LOCAL, equipoLocal);
        ladoVisitante = new Lado(TipoLado.VISITANTE, equipoVisitante);

        set = new SetPartido(1, false, ladoLocal, ladoVisitante);
        set.iniciar();

        titular1 = new Jugador(UUID.randomUUID(), "Titular", "Uno",
                LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
        titular2 = new Jugador(UUID.randomUUID(), "Titular", "Dos",
                LocalDate.of(2000, 1, 1), 2, Posicion.CENTRAL);
        suplente1 = new Jugador(UUID.randomUUID(), "Suplente", "Uno",
                LocalDate.of(2000, 1, 1), 10, Posicion.PUNTA_RECEPTOR);
        suplente2 = new Jugador(UUID.randomUUID(), "Suplente", "Dos",
                LocalDate.of(2000, 1, 1), 11, Posicion.CENTRAL);
        libero = new Jugador(UUID.randomUUID(), "Libero", "Equipo",
                LocalDate.of(2000, 1, 1), 99, Posicion.LIBERO);
    }

    // ── RN-05: Sustitución regular descuenta un cambio ──

    @Test
    void sustitucionRegularDescuentaUnCambio() {
        int cambiosAntes = set.getCambiosLocal().quedanDisponibles();

        set.realizarSustitucion(equipoLocal, suplente1, titular1, TipoSustitucion.REGULAR);

        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(cambiosAntes - 1);
    }

    @Test
    void sustitucionRegularAgotaCambiosYSextaFalla() {
        for (int i = 0; i < 6; i++) {
            Jugador sale = new Jugador(UUID.randomUUID(), "Sale", "" + i,
                    LocalDate.of(2000, 1, 1), i, Posicion.PUNTA_RECEPTOR);
            Jugador entra = new Jugador(UUID.randomUUID(), "Entra", "" + i,
                    LocalDate.of(2000, 1, 1), 20 + i, Posicion.PUNTA_RECEPTOR);
            set.realizarSustitucion(equipoLocal, entra, sale, TipoSustitucion.REGULAR);
        }

        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(0);

        // La séptima debe fallar
        Jugador extraEntra = new Jugador(UUID.randomUUID(), "Extra", "Entra",
                LocalDate.of(2000, 1, 1), 30, Posicion.PUNTA_RECEPTOR);
        Jugador extraSale = new Jugador(UUID.randomUUID(), "Extra", "Sale",
                LocalDate.of(2000, 1, 1), 5, Posicion.PUNTA_RECEPTOR);

        assertThatThrownBy(() ->
                set.realizarSustitucion(equipoLocal, extraEntra, extraSale, TipoSustitucion.REGULAR))
                .isInstanceOf(IllegalStateException.class);
    }

    // ── RN-06: Líbero NO descuenta cambios ──

    @Test
    void sustitucionLiberoNoDescuentaCambios() {
        int cambiosAntes = set.getCambiosLocal().quedanDisponibles();

        set.realizarSustitucion(equipoLocal, libero, titular1, TipoSustitucion.LIBERO);

        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(cambiosAntes);
    }

    @Test
    void sustitucionLiberoEsIlimitadaInclusoConCambiosAgotados() {
        // agotar cambios regulares
        for (int i = 0; i < 6; i++) {
            Jugador sale = new Jugador(UUID.randomUUID(), "Sale", "" + i,
                    LocalDate.of(2000, 1, 1), i, Posicion.PUNTA_RECEPTOR);
            Jugador entra = new Jugador(UUID.randomUUID(), "Entra", "" + i,
                    LocalDate.of(2000, 1, 1), 20 + i, Posicion.PUNTA_RECEPTOR);
            set.realizarSustitucion(equipoLocal, entra, sale, TipoSustitucion.REGULAR);
        }
        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(0);

        // líbero entra y sale sin problema
        set.realizarSustitucion(equipoLocal, libero, titular2, TipoSustitucion.LIBERO);
        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(0);

        set.realizarSustitucion(equipoLocal, titular2, libero, TipoSustitucion.LIBERO);
        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(0);
    }

    // ── No se puede sustituir con set no iniciado ──

    @Test
    void noSePuedeSustituirSiSetNoEstaEnCurso() {
        SetPartido setPendiente = new SetPartido(1, false, ladoLocal, ladoVisitante);
        // no llamamos a iniciar()

        assertThatThrownBy(() ->
                setPendiente.realizarSustitucion(equipoLocal, suplente1, titular1, TipoSustitucion.REGULAR))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void equipoVisitanteTieneSusPropiosCambios() {
        int cambiosLocalAntes = set.getCambiosLocal().quedanDisponibles();
        int cambiosVisitanteAntes = set.getCambiosVisitante().quedanDisponibles();

        set.realizarSustitucion(equipoLocal, suplente1, titular1, TipoSustitucion.REGULAR);

        assertThat(set.getCambiosLocal().quedanDisponibles()).isEqualTo(cambiosLocalAntes - 1);
        assertThat(set.getCambiosVisitante().quedanDisponibles()).isEqualTo(cambiosVisitanteAntes);
    }
}
