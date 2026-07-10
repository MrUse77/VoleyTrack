package com.mrusedev.voleytrack.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MarcadorTest {

    private Equipo equipoLocal;
    private Equipo equipoVisitante;
    private Lado ladoLocal;
    private Lado ladoVisitante;

    @BeforeEach
    void setUp() {
        equipoLocal = new Equipo(UUID.randomUUID(), "Club A", "Entrenador A");
        equipoVisitante = new Equipo(UUID.randomUUID(), "Club B", "Entrenador B");
        ladoLocal = new Lado(TipoLado.LOCAL, equipoLocal);
        ladoVisitante = new Lado(TipoLado.VISITANTE, equipoVisitante);
    }

    // ── RN-01: Set regular a 25, ganar por 2 ──

    @Test
    void setRegularSeGanaCon25PuntosYDiferenciaDe2() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);

        // local llega a 25, visitante a 23 → no debería terminar (dif = 2 justo, pero falta un punto más?)
        // 25-23: diferencia es 2, debería terminar
        for (int i = 0; i < 25; i++) marcador.incrementar(ladoLocal);
        for (int i = 0; i < 23; i++) marcador.incrementar(ladoVisitante);

        assertThat(marcador.estaTerminado()).isTrue();
        assertThat(marcador.getGanador()).isEqualTo(ladoLocal);
    }

    @Test
    void setNoTerminaCon25PuntosSiDiferenciaEsMenorA2() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);

        for (int i = 0; i < 25; i++) marcador.incrementar(ladoLocal);
        for (int i = 0; i < 24; i++) marcador.incrementar(ladoVisitante);

        // 25-24: diferencia 1, no terminado
        assertThat(marcador.estaTerminado()).isFalse();
        assertThat(marcador.getGanador()).isNull();
    }

    // ── RN-02: Deuce — sin límite superior, ganar por 2 ──

    @Test
    void deuceContinuaHastaDiferenciaDe2() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);

        // llevar a 24-24
        for (int i = 0; i < 24; i++) {
            marcador.incrementar(ladoLocal);
            marcador.incrementar(ladoVisitante);
        }
        assertThat(marcador.estaTerminado()).isFalse();

        // van alternando: 25-24, 25-25, 26-25, 26-26, 27-26, 27-27, 28-27, 28-28, 29-28, 29-29, 30-29, 30-30, 31-30, 31-31, 32-31, 32-32
        // en 32-31 no termina (dif 1)
        marcador.incrementar(ladoLocal); // 25-24
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoVisitante); // 25-25
        marcador.incrementar(ladoLocal); // 26-25
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoVisitante); // 26-26
        marcador.incrementar(ladoLocal); // 27-26
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoVisitante); // 27-27
        marcador.incrementar(ladoLocal); // 28-27
        marcador.incrementar(ladoVisitante); // 28-28
        marcador.incrementar(ladoLocal); // 29-28
        marcador.incrementar(ladoVisitante); // 29-29
        marcador.incrementar(ladoLocal); // 30-29
        marcador.incrementar(ladoVisitante); // 30-30
        marcador.incrementar(ladoLocal); // 31-30
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoVisitante); // 31-31
        marcador.incrementar(ladoLocal); // 32-31
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoLocal); // 33-31 → diferencia 2
        assertThat(marcador.estaTerminado()).isTrue();
        assertThat(marcador.getGanador()).isEqualTo(ladoLocal);
    }

    @Test
    void visitantePuedeGanarEnDeuce() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);

        for (int i = 0; i < 24; i++) {
            marcador.incrementar(ladoLocal);
            marcador.incrementar(ladoVisitante);
        }
        marcador.incrementar(ladoVisitante); // 24-25 → visitante llega a 25 pero dif 1
        assertThat(marcador.estaTerminado()).isFalse();
        marcador.incrementar(ladoVisitante); // 24-26 → dif 2
        assertThat(marcador.estaTerminado()).isTrue();
        assertThat(marcador.getGanador()).isEqualTo(ladoVisitante);
    }

    // ── Tie-break: límite 15 ──

    @Test
    void tieBreakSeGanaCon15PuntosYDiferenciaDe2() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 15);

        for (int i = 0; i < 15; i++) marcador.incrementar(ladoLocal);
        for (int i = 0; i < 13; i++) marcador.incrementar(ladoVisitante);

        assertThat(marcador.estaTerminado()).isTrue();
        assertThat(marcador.getGanador()).isEqualTo(ladoLocal);
    }

    @Test
    void tieBreakDeuce() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 15);

        for (int i = 0; i < 14; i++) {
            marcador.incrementar(ladoLocal);
            marcador.incrementar(ladoVisitante);
        }
        assertThat(marcador.estaTerminado()).isFalse();

        marcador.incrementar(ladoVisitante); // 14-15
        marcador.incrementar(ladoVisitante); // 14-16 → dif 2
        assertThat(marcador.estaTerminado()).isTrue();
    }

    // ── reiniciar ──

    @Test
    void reiniciarPoneMarcadorEnCero() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);
        marcador.incrementar(ladoLocal);
        marcador.incrementar(ladoLocal);
        marcador.incrementar(ladoVisitante);

        marcador.reiniciar();

        assertThat(marcador.getPuntos(ladoLocal)).isEqualTo(0);
        assertThat(marcador.getPuntos(ladoVisitante)).isEqualTo(0);
        assertThat(marcador.estaTerminado()).isFalse();
    }

    // ── Lado inválido ──

    @Test
    void lanzaExcepcionSiLadoNoPerteneceAlMarcador() {
        Marcador marcador = new Marcador(ladoLocal, ladoVisitante, 25);
        Equipo otro = new Equipo(UUID.randomUUID(), "Otro", "Otro");
        Lado ladoInvalido = new Lado(TipoLado.LOCAL, otro);

        assertThatThrownBy(() -> marcador.incrementar(ladoInvalido))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("no pertenece");
    }
}
