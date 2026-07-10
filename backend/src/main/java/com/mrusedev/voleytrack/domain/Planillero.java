package com.mrusedev.voleytrack.domain;

public class Planillero extends Usuario {
    private String telefono;

    public Planillero(Long id, String nombre, String apellido, String email,
                      String password, String dni, String telefono) {
        super(id, nombre, apellido, email, password, dni, RolUsuario.PLANILLERO);
        this.telefono = telefono;
    }

    public String getTelefono() { return telefono; }
}
