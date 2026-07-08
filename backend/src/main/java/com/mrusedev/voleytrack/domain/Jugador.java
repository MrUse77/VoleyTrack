package com.mrusedev.voleytrack.domain;

import java.time.LocalDate;
import java.util.UUID;

public class Jugador {
    private final UUID id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private int dorsal;
    private boolean activo;
    private Posicion posicion;

    public Jugador(UUID id, String nombre, String apellido, LocalDate fechaNacimiento,
                   int dorsal, Posicion posicion) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.dorsal = dorsal;
        this.posicion = posicion;
        this.activo = true;
    }

    public UUID getId() { return id; }

    public String getNombre() { return nombre; }

    public String getApellido() { return apellido; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }

    public int getDorsal() { return dorsal; }

    public boolean isActivo() { return activo; }

    public Posicion getPosicion() { return posicion; }

    public void desactivar() {
        this.activo = false;
    }

    public void activar() {
        this.activo = true;
    }
}
