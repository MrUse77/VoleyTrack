package com.mrusedev.voleytrack.domain;


import java.time.LocalDateTime;
import java.util.UUID;

public class Evento {
    private final UUID id;
    private final LocalDateTime timestamp;
    private final Jugador jugador;
    private final TipoFundamento tipoFundamento;

    public Evento(Jugador jugador, TipoFundamento tipoFundamento) {
        this.id = UUID.randomUUID();
        this.timestamp = LocalDateTime.now();
        this.jugador = jugador;
        this.tipoFundamento = tipoFundamento;
    }

    public UUID getId() { return id; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public Jugador getJugador() { return jugador; }

    public TipoFundamento getTipoFundamento() { return tipoFundamento; }
}
