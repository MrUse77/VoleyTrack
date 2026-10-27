package com.mrusedev.voleytrack.adapter.websocket;

import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPizarraPort;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Component
public class PizarraBienvenida {

    private final GestorPizarraPort gestorPizarra;
    private final PizarraJson pizarraJson;

    public PizarraBienvenida(GestorPizarraPort gestorPizarra, PizarraJson pizarraJson) {
        this.gestorPizarra = gestorPizarra;
        this.pizarraJson = pizarraJson;
    }

    /**
     * Manda el estado actual al socket que acaba de conectar. Se invoca antes de registrar la
     * sesión, así que todavía no hay broadcasts compitiendo por esta escritura.
     */
    public boolean enviarEstadoInicial(UUID partidoId, WebSocketSession sesion) throws IOException {
        PizarraEnVivoDTO pizarra;
        try {
            pizarra = gestorPizarra.obtenerPizarra(partidoId);
        } catch (RecursoNoEncontradoException e) {
            return false;
        }
        Optional<String> payload =
                pizarraJson.aJson(new CambioPizarraDTO("ESTADO_INICIAL", null, pizarra));
        if (payload.isEmpty()) {
            return false;
        }
        sesion.sendMessage(new TextMessage(payload.get()));
        return true;
    }
}
