package com.mrusedev.voleytrack.domain;

/**
 * Encapsula la lógica del marcador de un set de vóley.
 * Reglas: se gana por 2 puntos de diferencia, sin límite superior
 * una vez alcanzado el límite (25 normal, 15 tie-break).
 */
public class Marcador {
    private final Lado ladoLocal;
    private final Lado ladoVisitante;
    private final int limitePuntos;
    private int puntosLocal;
    private int puntosVisitante;

    public Marcador(Lado ladoLocal, Lado ladoVisitante, int limitePuntos) {
        this.ladoLocal = ladoLocal;
        this.ladoVisitante = ladoVisitante;
        this.limitePuntos = limitePuntos;
        this.puntosLocal = 0;
        this.puntosVisitante = 0;
    }

    public void incrementar(Lado lado) {
        if (lado.equals(ladoLocal)) {
            puntosLocal++;
        } else if (lado.equals(ladoVisitante)) {
            puntosVisitante++;
        } else {
            throw new IllegalArgumentException("El lado no pertenece a este marcador");
        }
    }

    public boolean estaTerminado() {
        int max = Math.max(puntosLocal, puntosVisitante);
        int min = Math.min(puntosLocal, puntosVisitante);
        return max >= limitePuntos && (max - min) >= 2;
    }

    public Lado getGanador() {
        if (!estaTerminado()) {
            return null;
        }
        return puntosLocal > puntosVisitante ? ladoLocal : ladoVisitante;
    }

    public void reiniciar() {
        puntosLocal = 0;
        puntosVisitante = 0;
    }

    public int getPuntos(Lado lado) {
        if (lado.equals(ladoLocal)) return puntosLocal;
        if (lado.equals(ladoVisitante)) return puntosVisitante;
        throw new IllegalArgumentException("El lado no pertenece a este marcador");
    }

    public Lado getLadoLocal() { return ladoLocal; }

    public Lado getLadoVisitante() { return ladoVisitante; }

    public int getLimitePuntos() { return limitePuntos; }
}
