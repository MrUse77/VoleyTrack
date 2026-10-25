package com.mrusedev.voleytrack.adapter.in.websocket;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import java.net.URI;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

class PartidoWebSocketHandlerTest {

    private final PartidoSessionRegistry registry = mock(PartidoSessionRegistry.class);
    private final PartidoWebSocketHandler handler = new PartidoWebSocketHandler(registry);

    private static WebSocketSession sesionConUri(String uri) {
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(sesion.getUri()).thenReturn(URI.create(uri));
        return sesion;
    }

    @Test
    void alConectarRegistraLaSesionBajoElPartidoDeLaUri() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = sesionConUri("/ws/partidos/" + partidoId);

        handler.afterConnectionEstablished(sesion);

        verify(registry).registrar(partidoId, sesion);
    }

    @Test
    void alConectarConUnPartidoInvalidoCierraLaConexion() throws Exception {
        WebSocketSession sesion = sesionConUri("/ws/partidos/no-es-un-uuid");

        handler.afterConnectionEstablished(sesion);

        verify(registry, never()).registrar(any(), any());
        verify(sesion).close(CloseStatus.BAD_DATA);
    }

    @Test
    void alCerrarDesregistraLaSesion() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = sesionConUri("/ws/partidos/" + partidoId);

        handler.afterConnectionClosed(sesion, CloseStatus.NORMAL);

        verify(registry).desregistrar(partidoId, sesion);
    }
}
