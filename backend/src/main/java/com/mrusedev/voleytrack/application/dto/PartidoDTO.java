package com.mrusedev.voleytrack.application.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record PartidoDTO(UUID equipoA, UUID equipoB, LocalDateTime fechaHora) {}
