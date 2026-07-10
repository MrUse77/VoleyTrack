package com.mrusedev.voleytrack.domain;


import java.time.LocalDateTime;
import java.util.UUID;

public class Evento {
    private final UUID id;
    private final LocalDateTime timestamp;
    private final Jugador jugador;
    private final TipoFundamento tipoFundamento;

    public Evento(Jugador jugador, TipoFundamento tipoFundamento) {
        this(UUID.randomUUID(), LocalDateTime.now(), jugador, tipoFundamento);
    }

    /** Reconstruction constructor — preserves persisted ID and timestamp. */
    public Evento(UUID id, LocalDateTime timestamp, Jugador jugador, TipoFundamento tipoFundamento) {
        this.id = id;
        this.timestamp = timestamp;
        this.jugador = jugador;
        this.tipoFundamento = tipoFundamento;
    }

    public UUID getId() { return id; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public Jugador getJugador() { return jugador; }

    public TipoFundamento getTipoFundamento() { return tipoFundamento; }
}
