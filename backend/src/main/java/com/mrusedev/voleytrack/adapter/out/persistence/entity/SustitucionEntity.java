package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import com.mrusedev.voleytrack.domain.TipoSustitucion;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("sustituciones")
public class SustitucionEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private UUID setId;
    private UUID equipoId;
    private UUID jugadorSaleId;
    private UUID jugadorEntraId;
    private TipoSustitucion tipo;
    private LocalDateTime creadoEn;

    @Transient
    private boolean isNew = true;

    public SustitucionEntity() {}

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

    public UUID getJugadorSaleId() { return jugadorSaleId; }
    public void setJugadorSaleId(UUID jugadorSaleId) { this.jugadorSaleId = jugadorSaleId; }

    public UUID getJugadorEntraId() { return jugadorEntraId; }
    public void setJugadorEntraId(UUID jugadorEntraId) { this.jugadorEntraId = jugadorEntraId; }

    public TipoSustitucion getTipo() { return tipo; }
    public void setTipo(TipoSustitucion tipo) { this.tipo = tipo; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
