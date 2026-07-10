package com.mrusedev.voleytrack.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class SetPartido {
    private final UUID id;
    private final int numeroSet;
    private final boolean esTieBreak;
    private EstadoSet estado;
    private Marcador marcador;
    private Cambios cambiosLocal;
    private Cambios cambiosVisitante;
    private Equipo saque;
    private Alineacion alineacionLocal;
    private Alineacion alineacionVisitante;
    private final List<Evento> eventos;
    private final List<Sustitucion> sustituciones;

    public SetPartido(int numeroSet, boolean esTieBreak, Lado ladoLocal, Lado ladoVisitante) {
        this(UUID.randomUUID(), numeroSet, esTieBreak, ladoLocal, ladoVisitante);
    }

    /** Reconstruction constructor — preserves persisted ID. */
    public SetPartido(UUID id, int numeroSet, boolean esTieBreak, Lado ladoLocal, Lado ladoVisitante) {
        this.id = id;
        this.numeroSet = numeroSet;
        this.esTieBreak = esTieBreak;
        this.estado = EstadoSet.PENDIENTE;
        this.marcador = new Marcador(ladoLocal, ladoVisitante, esTieBreak ? 15 : 25);
        this.cambiosLocal = new Cambios();
        this.cambiosVisitante = new Cambios();
        this.eventos = new ArrayList<>();
        this.sustituciones = new ArrayList<>();
    }

    public UUID getId() { return id; }

    public int getNumeroSet() { return numeroSet; }

    public boolean isEsTieBreak() { return esTieBreak; }

    public EstadoSet getEstado() { return estado; }

    public Marcador getMarcador() { return marcador; }

    public Equipo getSaque() { return saque; }

    public List<Evento> getEventos() {
        return Collections.unmodifiableList(eventos);
    }

    public List<Sustitucion> getSustituciones() {
        return Collections.unmodifiableList(sustituciones);
    }

    public Alineacion getAlineacion(Equipo equipo) {
        if (alineacionLocal != null && alineacionLocal.getEquipo().equals(equipo)) {
            return alineacionLocal;
        }
        if (alineacionVisitante != null && alineacionVisitante.getEquipo().equals(equipo)) {
            return alineacionVisitante;
        }
        return null;
    }

    public Alineacion crearAlineacion(Equipo equipo) {
        Alineacion alineacion = new Alineacion(equipo);
        if (marcador.getLadoLocal().getEquipo().equals(equipo)) {
            this.alineacionLocal = alineacion;
        } else if (marcador.getLadoVisitante().getEquipo().equals(equipo)) {
            this.alineacionVisitante = alineacion;
        }
        return alineacion;
    }

    public void asignarSaqueInicial(Equipo equipoSaqueInicial) {
        this.saque = equipoSaqueInicial;
    }

    public void cambiarEstado(EstadoSet estado) {
        this.estado = estado;
    }

    public void iniciar() {
        if (estado != EstadoSet.PENDIENTE) {
            throw new IllegalStateException("El set no está en estado PENDIENTE");
        }
        this.estado = EstadoSet.EN_CURSO;
    }

    public Evento registrarPunto(Lado lado, Jugador jugador, TipoFundamento tipoFundamento) {
        if (estado != EstadoSet.EN_CURSO) {
            throw new IllegalStateException("No se puede registrar un punto: el set no está en curso");
        }
        marcador.incrementar(lado);
        Evento evento = new Evento(jugador, tipoFundamento);
        eventos.add(evento);

        if (marcador.estaTerminado()) {
            estado = EstadoSet.FINALIZADO;
        }
        return evento;
    }

    public Sustitucion realizarSustitucion(Equipo equipo, Jugador jugadorEntra,
                                           Jugador jugadorSale, TipoSustitucion tipo) {
        if (estado != EstadoSet.EN_CURSO) {
            throw new IllegalStateException("No se puede realizar sustitución: el set no está en curso");
        }
        // RN-06: los cambios de líbero no descuentan del límite de 6
        if (tipo != TipoSustitucion.LIBERO) {
            Cambios cambios = getCambios(equipo);
            cambios.consumir();
        }

        Sustitucion sustitucion = new Sustitucion(equipo, jugadorSale, jugadorEntra, tipo);
        sustituciones.add(sustitucion);
        return sustitucion;
    }

    private Cambios getCambios(Equipo equipo) {
        if (marcador.getLadoLocal().getEquipo().equals(equipo)) {
            return cambiosLocal;
        } else if (marcador.getLadoVisitante().getEquipo().equals(equipo)) {
            return cambiosVisitante;
        }
        throw new IllegalArgumentException("El equipo no pertenece a este set");
    }

    /** Restores persisted events after reconstruction (idempotent). */
    public void restaurarEventos(List<Evento> eventos) {
        this.eventos.clear();
        this.eventos.addAll(eventos);
    }

    /** Restores persisted sustituciones after reconstruction (idempotent). */
    public void restaurarSustituciones(List<Sustitucion> sustituciones) {
        this.sustituciones.clear();
        this.sustituciones.addAll(sustituciones);
    }

    public Cambios getCambiosLocal() { return cambiosLocal; }

    public Cambios getCambiosVisitante() { return cambiosVisitante; }

    public Alineacion getAlineacionLocal() { return alineacionLocal; }

    public Alineacion getAlineacionVisitante() { return alineacionVisitante; }

    // ── RN-03: cambio de lado en tie-break a los 8 puntos ──

    public boolean debeCambiarDeLado() {
        if (!esTieBreak) return false;
        int total = marcador.getPuntos(marcador.getLadoLocal())
                  + marcador.getPuntos(marcador.getLadoVisitante());
        return total == 8;
    }
}
