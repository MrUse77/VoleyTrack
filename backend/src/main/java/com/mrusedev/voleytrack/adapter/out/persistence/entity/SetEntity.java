package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import com.mrusedev.voleytrack.domain.EstadoSet;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("sets")
public class SetEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private UUID partidoId;
    private int numSet;
    private boolean esTieBreak;
    private EstadoSet estado;
    private int puntosLocal;
    private int puntosVisitante;
    private int cambiosLocal;
    private int cambiosVisitante;
    private UUID saqueInicialId;

    @Transient
    private boolean isNew = true;

    public SetEntity() {}

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }
    public void markPersisted() { this.isNew = false; }

    public UUID getPartidoId() { return partidoId; }
    public void setPartidoId(UUID partidoId) { this.partidoId = partidoId; }

    public int getNumSet() { return numSet; }
    public void setNumSet(int numSet) { this.numSet = numSet; }

    public boolean isEsTieBreak() { return esTieBreak; }
    public void setEsTieBreak(boolean esTieBreak) { this.esTieBreak = esTieBreak; }

    public EstadoSet getEstado() { return estado; }
    public void setEstado(EstadoSet estado) { this.estado = estado; }

    public int getPuntosLocal() { return puntosLocal; }
    public void setPuntosLocal(int puntosLocal) { this.puntosLocal = puntosLocal; }

    public int getPuntosVisitante() { return puntosVisitante; }
    public void setPuntosVisitante(int puntosVisitante) { this.puntosVisitante = puntosVisitante; }

    public int getCambiosLocal() { return cambiosLocal; }
    public void setCambiosLocal(int cambiosLocal) { this.cambiosLocal = cambiosLocal; }

    public int getCambiosVisitante() { return cambiosVisitante; }
    public void setCambiosVisitante(int cambiosVisitante) { this.cambiosVisitante = cambiosVisitante; }

    public UUID getSaqueInicialId() { return saqueInicialId; }
    public void setSaqueInicialId(UUID saqueInicialId) { this.saqueInicialId = saqueInicialId; }
}
