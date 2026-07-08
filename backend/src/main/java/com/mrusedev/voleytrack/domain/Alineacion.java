package com.mrusedev.voleytrack.domain;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Alineacion {
    private final Equipo equipo;
    private final List<AlineacionJugador> jugadoresEnCancha;

    public Alineacion(Equipo equipo) {
        this.equipo = equipo;
        this.jugadoresEnCancha = new ArrayList<>();
    }

    public Equipo getEquipo() { return equipo; }

    public List<AlineacionJugador> getJugadoresEnCancha() {
        return Collections.unmodifiableList(jugadoresEnCancha);
    }

    public void agregarJugador(Jugador jugador, int posicion, boolean esTitular) {
        if (jugadoresEnCancha.size() >= 7) {
            throw new IllegalStateException("La alineación no puede tener más de 7 jugadores (6 + líbero)");
        }
        jugadoresEnCancha.add(new AlineacionJugador(jugador, posicion, esTitular));
    }

    public AlineacionJugador getJugadorEnPosicion(int posicion) {
        return jugadoresEnCancha.stream()
                .filter(aj -> aj.getPosicion() == posicion)
                .findFirst()
                .orElse(null);
    }
}
