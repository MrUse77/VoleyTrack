package com.mrusedev.voleytrack.domain;

import java.time.LocalDateTime;
import java.util.UUID;

public class Plantel {
    private final UUID id;
    private final Equipo equipo;
    private final Jugador jugador;
    private LocalDateTime fechaAsignacion;
    private boolean activo;

    public Plantel(UUID id, Equipo equipo, Jugador jugador) {
        this.id = id;
        this.equipo = equipo;
        this.jugador = jugador;
        this.fechaAsignacion = LocalDateTime.now();
        this.activo = true;
    }

    public UUID getId() { return id; }

    public Equipo getEquipo() { return equipo; }

    public Jugador getJugador() { return jugador; }

    public LocalDateTime getFechaAsignacion() { return fechaAsignacion; }

    public boolean isActivo() { return activo; }

    public void desvincular() {
        this.activo = false;
    }
}
