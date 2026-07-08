package com.mrusedev.voleytrack.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class Equipo {
    private final UUID id;
    private String nombreClub;
    private String entrenador;
    private boolean activo;
    private final List<Jugador> jugadores;

    public Equipo(UUID id, String nombreClub, String entrenador) {
        this.id = id;
        this.nombreClub = nombreClub;
        this.entrenador = entrenador;
        this.activo = true;
        this.jugadores = new ArrayList<>();
    }

    public UUID getId() { return id; }

    public String getNombreClub() { return nombreClub; }

    public String getEntrenador() { return entrenador; }

    public boolean isActivo() { return activo; }

    public List<Jugador> getJugadores() {
        return Collections.unmodifiableList(jugadores);
    }

    public List<Jugador> getJugadoresActivos() {
        return jugadores.stream()
                .filter(Jugador::isActivo)
                .toList();
    }

    public void agregarJugador(Jugador jugador) {
        if (!jugadores.contains(jugador)) {
            jugadores.add(jugador);
        }
    }

    public void removerJugador(Jugador jugador) {
        jugadores.remove(jugador);
    }

    public void desactivar() {
        this.activo = false;
    }
}
