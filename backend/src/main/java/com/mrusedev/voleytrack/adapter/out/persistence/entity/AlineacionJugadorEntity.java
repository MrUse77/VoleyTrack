package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("alineacion_jugadores")
public class AlineacionJugadorEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private UUID alineacionId;
    private UUID jugadorId;
    private int posicion;
    private boolean esTitular;
    private boolean esSacadorInicial;

    @Transient
    private boolean isNew = true;

    public AlineacionJugadorEntity() {}

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }
    public void markPersisted() { this.isNew = false; }

    public UUID getAlineacionId() { return alineacionId; }
    public void setAlineacionId(UUID alineacionId) { this.alineacionId = alineacionId; }

    public UUID getJugadorId() { return jugadorId; }
    public void setJugadorId(UUID jugadorId) { this.jugadorId = jugadorId; }

    public int getPosicion() { return posicion; }
    public void setPosicion(int posicion) { this.posicion = posicion; }

    public boolean isEsTitular() { return esTitular; }
    public void setEsTitular(boolean esTitular) { this.esTitular = esTitular; }

    public boolean isEsSacadorInicial() { return esSacadorInicial; }
    public void setEsSacadorInicial(boolean esSacadorInicial) { this.esSacadorInicial = esSacadorInicial; }
}
