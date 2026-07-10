package com.mrusedev.voleytrack.domain;


import java.util.UUID;

public class AlineacionJugador {
    private final UUID id;
    private final Jugador jugador;
    private boolean esTitular;
    private boolean esSacadorInicial;
    private int posicion;

    public AlineacionJugador(Jugador jugador, int posicion, boolean esTitular) {
        this.id = UUID.randomUUID();
        this.jugador = jugador;
        this.posicion = posicion;
        this.esTitular = esTitular;
        this.esSacadorInicial = false;
    }

    public UUID getId() { return id; }

    public Jugador getJugador() { return jugador; }

    public int getPosicion() { return posicion; }

    public boolean isEsTitular() { return esTitular; }

    public boolean isEsSacadorInicial() { return esSacadorInicial; }

    public void marcarComoSacadorInicial() {
        this.esSacadorInicial = true;
    }
}
