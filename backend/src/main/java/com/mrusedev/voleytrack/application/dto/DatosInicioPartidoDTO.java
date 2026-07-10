package com.mrusedev.voleytrack.application.dto;

import java.util.UUID;

public record DatosInicioPartidoDTO(
        UUID partidoId,
        String equipoLocalNombre,
        String equipoVisitanteNombre,
        int cantSets,
        int setsParaGanar,
        String estado
) {}
