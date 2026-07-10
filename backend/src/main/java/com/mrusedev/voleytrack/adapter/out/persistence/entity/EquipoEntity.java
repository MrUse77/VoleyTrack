package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("equipos")
public class EquipoEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private String nombreClub;
    private String entrenador;
    private boolean activo;

    @Transient
    private boolean isNew = true;

    public EquipoEntity() {}

    public EquipoEntity(UUID id, String nombreClub, String entrenador, boolean activo) {
        this.id = id;
        this.nombreClub = nombreClub;
        this.entrenador = entrenador;
        this.activo = activo;
        this.isNew = true;
    }

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }

    public void markPersisted() { this.isNew = false; }

    public String getNombreClub() { return nombreClub; }
    public void setNombreClub(String nombreClub) { this.nombreClub = nombreClub; }

    public String getEntrenador() { return entrenador; }
    public void setEntrenador(String entrenador) { this.entrenador = entrenador; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
