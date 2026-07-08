package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import com.mrusedev.voleytrack.domain.EstadoPartido;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("partidos")
public class PartidoEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private LocalDateTime fechaHora;
    private EstadoPartido estado;
    private int cantSets;
    private UUID equipoLocalId;
    private UUID equipoVisitanteId;

    @Transient
    private boolean isNew = true;

    public PartidoEntity() {}

    public PartidoEntity(UUID id, LocalDateTime fechaHora, EstadoPartido estado,
                         int cantSets, UUID equipoLocalId, UUID equipoVisitanteId) {
        this.id = id;
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.cantSets = cantSets;
        this.equipoLocalId = equipoLocalId;
        this.equipoVisitanteId = equipoVisitanteId;
        this.isNew = true;
    }

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }
    public void markPersisted() { this.isNew = false; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public EstadoPartido getEstado() { return estado; }
    public void setEstado(EstadoPartido estado) { this.estado = estado; }

    public int getCantSets() { return cantSets; }
    public void setCantSets(int cantSets) { this.cantSets = cantSets; }

    public UUID getEquipoLocalId() { return equipoLocalId; }
    public void setEquipoLocalId(UUID equipoLocalId) { this.equipoLocalId = equipoLocalId; }

    public UUID getEquipoVisitanteId() { return equipoVisitanteId; }
    public void setEquipoVisitanteId(UUID equipoVisitanteId) { this.equipoVisitanteId = equipoVisitanteId; }
}
