package com.mrusedev.voleytrack.domain;

public class CantSets {
    private final int cantidad;

    public CantSets(int cantidad) {
        if (cantidad != 3 && cantidad != 5) {
            throw new IllegalArgumentException("Cantidad de sets debe ser 3 o 5");
        }
        this.cantidad = cantidad;
    }

    public int getCantidad() { return cantidad; }

    public int setsParaGanar() {
        return (cantidad / 2) + 1;
    }
}
