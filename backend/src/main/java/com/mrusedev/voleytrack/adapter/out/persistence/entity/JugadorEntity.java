package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import com.mrusedev.voleytrack.domain.Posicion;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;
import java.util.UUID;

@Table("jugadores")
public class JugadorEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private int dorsal;
    private boolean activo;
    private Posicion posicion;

    @Transient
    private boolean isNew = true;

    public JugadorEntity() {}

    public JugadorEntity(UUID id, String nombre, String apellido, LocalDate fechaNacimiento,
                         int dorsal, boolean activo, Posicion posicion) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
        this.dorsal = dorsal;
        this.activo = activo;
        this.posicion = posicion;
        this.isNew = true;
    }

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }

    public void markPersisted() { this.isNew = false; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public int getDorsal() { return dorsal; }
    public void setDorsal(int dorsal) { this.dorsal = dorsal; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public Posicion getPosicion() { return posicion; }
    public void setPosicion(Posicion posicion) { this.posicion = posicion; }
}
