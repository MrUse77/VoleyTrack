package com.mrusedev.voleytrack.domain;

/**
 * Encapsula los cambios disponibles por equipo en un set.
 * Cada equipo tiene 6 cambios por set en vóley estándar.
 */
public class Cambios {
    private static final int MAX_CAMBIOS = 6;
    private int restantes;

    public Cambios() {
        this.restantes = MAX_CAMBIOS;
    }

    public void consumir() {
        if (restantes <= 0) {
            throw new IllegalStateException("No quedan cambios disponibles");
        }
        restantes--;
    }

    public void reiniciar() {
        restantes = MAX_CAMBIOS;
    }

    public int quedanDisponibles() {
        return restantes;
    }
}
