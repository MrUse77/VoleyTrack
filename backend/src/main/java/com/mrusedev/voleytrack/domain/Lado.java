package com.mrusedev.voleytrack.domain;


import java.util.Objects;

public class Lado {
    private final TipoLado tipo;
    private final Equipo equipo;

    public Lado(TipoLado tipo, Equipo equipo) {
        this.tipo = tipo;
        this.equipo = equipo;
    }

    public TipoLado getTipo() { return tipo; }

    public Equipo getEquipo() { return equipo; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Lado lado)) return false;
        return tipo == lado.tipo && Objects.equals(equipo.getId(), lado.equipo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(tipo, equipo.getId());
    }

    @Override
    public String toString() {
        return tipo + "(" + equipo.getNombreClub() + ")";
    }
}
