package com.mrusedev.voleytrack.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CambiosTest {

    private Cambios cambios;

    @BeforeEach
    void setUp() {
        cambios = new Cambios();
    }

    @Test
    void iniciaConSeisCambiosDisponibles() {
        assertThat(cambios.quedanDisponibles()).isEqualTo(6);
    }

    @Test
    void consumirReduceCambiosDisponibles() {
        cambios.consumir();
        assertThat(cambios.quedanDisponibles()).isEqualTo(5);

        cambios.consumir();
        assertThat(cambios.quedanDisponibles()).isEqualTo(4);
    }

    @Test
    void lanzaExcepcionAlConsumirSinCambiosDisponibles() {
        for (int i = 0; i < 6; i++) {
            cambios.consumir();
        }
        assertThat(cambios.quedanDisponibles()).isEqualTo(0);

        assertThatThrownBy(() -> cambios.consumir())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("No quedan cambios disponibles");
    }

    @Test
    void reiniciarRestauraSeisCambios() {
        for (int i = 0; i < 6; i++) {
            cambios.consumir();
        }
        cambios.reiniciar();
        assertThat(cambios.quedanDisponibles()).isEqualTo(6);
    }
}
