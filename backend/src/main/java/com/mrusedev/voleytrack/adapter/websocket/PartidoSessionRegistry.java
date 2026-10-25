package com.mrusedev.voleytrack.adapter.websocket;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;

@Component
public class PartidoSessionRegistry {
    private static final Logger log =LoggerFactory.getLogger(PartidoSessionRegistry.class);
    private static final int LIMITE_ENVIO_MS = 5_000;
    private static final int LIMITE_BUFFER_BYTES = 64 * 1024;
    private final Map<UUID, Map<String, WebSocketSession>> sesiones = new ConcurrentHashMap<>();
    public void registrar(UUID partidoId, WebSocketSession sesion) {
        WebSocketSession segura = new ConcurrentWebSocketSessionDecorator(sesion,LIMITE_ENVIO_MS,LIMITE_BUFFER_BYTES);
        sesiones.computeIfAbsent(partidoId, id ->new ConcurrentHashMap<>()).put(sesion.getId(), segura);
    }


    public void desregistrar(UUID partidoId, WebSocketSession sesion) {
        sesiones.computeIfPresent(partidoId, (id,porSesion)->{
            porSesion.remove(sesion.getId());
            return porSesion.isEmpty()?null: porSesion;
        });
    }

    public void enviar(UUID partidoId, String payload) {
        Map<String, WebSocketSession> destinos = sesiones.get(partidoId);
        if(destinos == null){
            return;
        }
        destinos.forEach((idSesion, sesion)->enviarA(partidoId, idSesion, sesion, payload));
    }
    private void enviarA(UUID partidoId, String idSesion, WebSocketSession sesion, String payload){
        if(!sesion.isOpen()){
            desregistrar(partidoId, sesion);
            return;
        }
        try{
            sesion.sendMessage(new TextMessage(payload));
        }catch(IOException | RuntimeException e){
            log.warn("No se pudo enviar la pizarra del partido {} a la sesión {}: {}",
                    partidoId, idSesion, e.getMessage());
            desregistrar(partidoId, sesion);
        }

    }
}
