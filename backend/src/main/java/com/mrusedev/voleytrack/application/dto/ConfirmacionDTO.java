package com.mrusedev.voleytrack.application.dto;

public record ConfirmacionDTO(
        boolean exitoso,
        String mensaje
) {

    public static ConfirmacionDTO ok(String mensaje) {
        return new ConfirmacionDTO(true, mensaje);
    }

    public static ConfirmacionDTO error(String mensaje) {
        return new ConfirmacionDTO(false, mensaje);
    }
}
