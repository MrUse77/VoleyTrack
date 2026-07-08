package com.mrusedev.voleytrack.domain;


import java.util.UUID;

/**
 * Proyección materializada de estadísticas por jugador y set.
 * Se actualiza con cada Evento registrado.
 */
public class Estadistica {
    private final UUID id;
    private final Jugador jugador;
    private final SetPartido set;
    private int ataques;
    private int bloqueos;
    private int saques;
    private int defensas;
    private int recepciones;
    private int erroresNoForzados;
    private int erroresSaque;

    public Estadistica(Jugador jugador, SetPartido set) {
        this.id = UUID.randomUUID();
        this.jugador = jugador;
        this.set = set;
        this.ataques = 0;
        this.bloqueos = 0;
        this.saques = 0;
        this.defensas = 0;
        this.recepciones = 0;
        this.erroresNoForzados = 0;
        this.erroresSaque = 0;
    }

    public UUID getId() { return id; }

    public Jugador getJugador() { return jugador; }

    public SetPartido getSet() { return set; }

    public int getAtaques() { return ataques; }

    public int getBloqueos() { return bloqueos; }

    public int getSaques() { return saques; }

    public int getDefensas() { return defensas; }

    public int getRecepciones() { return recepciones; }

    public int getErroresNoForzados() { return erroresNoForzados; }

    public int getErroresSaque() { return erroresSaque; }

    public void incrementar(TipoFundamento tipoFundamento) {
        switch (tipoFundamento) {
            case ATAQUE -> ataques++;
            case BLOQUEO -> bloqueos++;
            case SAQUE -> saques++;
            case DEFENSA -> defensas++;
            case RECEPCION -> recepciones++;
            case ERROR_NO_FORZADO -> erroresNoForzados++;
            case ERROR_SAQUE -> erroresSaque++;
        }
    }
}
