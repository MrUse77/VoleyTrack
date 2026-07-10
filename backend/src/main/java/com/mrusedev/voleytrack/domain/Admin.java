package com.mrusedev.voleytrack.domain;

public class Admin extends Usuario {

    public Admin(Long id, String nombre, String apellido, String email,
                 String password, String dni) {
        super(id, nombre, apellido, email, password, dni, RolUsuario.ADMIN);
    }
}
