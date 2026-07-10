package com.mrusedev.voleytrack.domain;


import java.time.LocalDateTime;
import java.util.UUID;

public class Sustitucion {
  private final UUID id;
  private final LocalDateTime timestamp;
  private final Equipo equipo;
  private final Jugador jugadorSale;
  private final Jugador jugadorEntra;
  private final TipoSustitucion tipo;

  public Sustitucion(
      Equipo equipo, Jugador jugadorSale, Jugador jugadorEntra, TipoSustitucion tipo) {
    this.id = UUID.randomUUID();
    this.timestamp = LocalDateTime.now();
    this.equipo = equipo;
    this.jugadorSale = jugadorSale;
    this.jugadorEntra = jugadorEntra;
    this.tipo = tipo;
  }

  /** Reconstruction constructor — preserves persisted ID and timestamp. */
  public Sustitucion(UUID id, LocalDateTime timestamp, Equipo equipo,
                     Jugador jugadorSale, Jugador jugadorEntra, TipoSustitucion tipo) {
    this.id = id;
    this.timestamp = timestamp;
    this.equipo = equipo;
    this.jugadorSale = jugadorSale;
    this.jugadorEntra = jugadorEntra;
    this.tipo = tipo;
  }

  public UUID getId() {
    return id;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public Equipo getEquipo() {
    return equipo;
  }

  public Jugador getJugadorSale() {
    return jugadorSale;
  }

  public Jugador getJugadorEntra() {
    return jugadorEntra;
  }

  public TipoSustitucion getTipo() {
    return tipo;
  }
}
