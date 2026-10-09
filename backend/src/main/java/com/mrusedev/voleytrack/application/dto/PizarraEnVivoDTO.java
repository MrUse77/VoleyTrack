package com.mrusedev.voleytrack.application.dto;

import java.util.List;
import java.util.UUID;

public record PizarraEnVivoDTO(
        EquipoPizarraDTO equipoLocal,
        EquipoPizarraDTO equipoVisitante,
        int setsLocal,
        int setsVisitante,
        SetActualDTO setActual,
        UUID equipoSaqueId,
        String estadoPartido,
        String estadoSet,
        List<EventoPizarraDTO> ultimosEventos
) {

    public record EquipoPizarraDTO(UUID id, String nombre) {}

    public record SetActualDTO(int numeroSet, boolean esTieBreak, int limitePuntos,
                               int puntosLocal, int puntosVisitante) {}

    public record EventoPizarraDTO(UUID jugadorId, String jugadorNombre, String tipoFundamento) {}
}
