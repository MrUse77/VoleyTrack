package com.mrusedev.voleytrack.adapter.out.persistence.entity;

import com.mrusedev.voleytrack.domain.TipoFundamento;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("eventos")
public class EventoEntity implements Persistable<UUID> {

    @Id
    private UUID id;
    private UUID setId;
    private UUID jugadorId;
    private TipoFundamento tipoFundamento;
    private LocalDateTime creadoEn;

    @Transient
    private boolean isNew = true;

    public EventoEntity() {}

    @Override
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    @Override
    public boolean isNew() { return isNew; }
    public void markPersisted() { this.isNew = false; }

    public UUID getSetId() { return setId; }
    public void setSetId(UUID setId) { this.setId = setId; }

    public UUID getJugadorId() { return jugadorId; }
    public void setJugadorId(UUID jugadorId) { this.jugadorId = jugadorId; }

    public TipoFundamento getTipoFundamento() { return tipoFundamento; }
    public void setTipoFundamento(TipoFundamento tipoFundamento) { this.tipoFundamento = tipoFundamento; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
