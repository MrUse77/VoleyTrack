package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("alineaciones")
public class AlineacionEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private UUID setId;
    private UUID equipoId;

    @Transient
    private boolean isNew = true;

    public AlineacionEntity() {}

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }
    public void markPersisted() { this.isNew = false; }

    public UUID getSetId() { return setId; }
    public void setSetId(UUID setId) { this.setId = setId; }

    public UUID getEquipoId() { return equipoId; }
    public void setEquipoId(UUID equipoId) { this.equipoId = equipoId; }
}
