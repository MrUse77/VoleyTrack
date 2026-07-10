package com.mrusedev.voleytrack.domain;

public abstract class Usuario {
    private final Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String dni;
    private final RolUsuario rol;

    protected Usuario(Long id, String nombre, String apellido, String email,
                      String password, String dni, RolUsuario rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.dni = dni;
        this.rol = rol;
    }

    public Long getId() { return id; }

    public String getNombre() { return nombre; }

    public String getApellido() { return apellido; }

    public String getEmail() { return email; }

    public String getPassword() { return password; }

    public String getDni() { return dni; }

    public RolUsuario getRol() { return rol; }
}
