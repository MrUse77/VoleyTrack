package com.mrusedev.voleytrack.domain;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class Partido {
    private final UUID id;
    private final LocalDateTime fechaHora;
    private EstadoPartido estado;
    private final List<Lado> lados;
    private final List<SetPartido> sets;
    private final CantSets cantSets;

    public Partido(UUID id, Equipo equipoLocal, Equipo equipoVisitante, CantSets cantSets) {
        this.id = id;
        this.fechaHora = LocalDateTime.now();
        this.estado = EstadoPartido.PROGRAMADO;
        this.cantSets = cantSets;

        Lado ladoLocal = new Lado(TipoLado.LOCAL, equipoLocal);
        Lado ladoVisitante = new Lado(TipoLado.VISITANTE, equipoVisitante);
        this.lados = List.of(ladoLocal, ladoVisitante);
        this.sets = new ArrayList<>();
    }

    public UUID getId() { return id; }

    public LocalDateTime getFechaHora() { return fechaHora; }

    public EstadoPartido getEstado() { return estado; }

    public List<Lado> getLados() { return lados; }

    public CantSets getCantSets() { return cantSets; }

    public List<SetPartido> getSets() {
        return Collections.unmodifiableList(sets);
    }

    public SetPartido getSetActual() {
        if (sets.isEmpty()) return null;
        return sets.getLast();
    }

    public Lado resolverLado(Equipo equipo) {
        return lados.stream()
                .filter(l -> l.getEquipo().equals(equipo))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("El equipo no pertenece a este partido"));
    }

    public SetPartido iniciarSet() {
        if (sets.size() >= cantSets.getCantidad()) {
            throw new IllegalStateException("Ya se alcanzó el máximo de sets");
        }
        int numeroSet = sets.size() + 1;
        boolean esTieBreak = (numeroSet == cantSets.getCantidad());

        Lado ladoLocal = getLado(TipoLado.LOCAL);
        Lado ladoVisitante = getLado(TipoLado.VISITANTE);

        SetPartido set = new SetPartido(numeroSet, esTieBreak, ladoLocal, ladoVisitante);
        sets.add(set);
        return set;
    }

    public void iniciar() {
        if (estado != EstadoPartido.PROGRAMADO) {
            throw new IllegalStateException("El partido no está en estado PROGRAMADO");
        }
        this.estado = EstadoPartido.EN_CURSO;
    }

    public void cambiarEstado(EstadoPartido estado) {
        this.estado = estado;
    }

    public Evento anotarPunto(Equipo equipo, Jugador jugador, TipoFundamento tipoFundamento) {
        if (estado != EstadoPartido.EN_CURSO) {
            throw new IllegalStateException("El partido no está en curso");
        }
        Lado lado = resolverLado(equipo);
        SetPartido setActual = getSetActual();
        if (setActual == null || setActual.getEstado() == EstadoSet.FINALIZADO) {
            throw new IllegalStateException("No hay un set en curso");
        }
        Evento evento = setActual.registrarPunto(lado, jugador, tipoFundamento);

        if (setActual.getEstado() == EstadoSet.FINALIZADO) {
            verificarFinPartido();
        }
        return evento;
    }

    private void verificarFinPartido() {
        int setsParaGanar = cantSets.setsParaGanar();
        long ganadosLocal = sets.stream()
                .filter(s -> s.getEstado() == EstadoSet.FINALIZADO)
                .filter(s -> s.getMarcador().getGanador() != null
                        && s.getMarcador().getGanador().getTipo() == TipoLado.LOCAL)
                .count();
        long ganadosVisitante = sets.stream()
                .filter(s -> s.getEstado() == EstadoSet.FINALIZADO)
                .filter(s -> s.getMarcador().getGanador() != null
                        && s.getMarcador().getGanador().getTipo() == TipoLado.VISITANTE)
                .count();

        if (ganadosLocal >= setsParaGanar || ganadosVisitante >= setsParaGanar) {
            this.estado = EstadoPartido.FINALIZADO;
        }
    }

    public Lado getGanador() {
        if (estado != EstadoPartido.FINALIZADO) return null;
        int setsParaGanar = cantSets.setsParaGanar();
        long ganadosLocal = sets.stream()
                .filter(s -> s.getMarcador().getGanador() != null
                        && s.getMarcador().getGanador().getTipo() == TipoLado.LOCAL)
                .count();
        return ganadosLocal >= setsParaGanar ? getLado(TipoLado.LOCAL) : getLado(TipoLado.VISITANTE);
    }

    private Lado getLado(TipoLado tipo) {
        return lados.stream()
                .filter(l -> l.getTipo() == tipo)
                .findFirst()
                .orElseThrow();
    }
}
