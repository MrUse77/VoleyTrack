package com.mrusedev.voleytrack.adapter.in.websocket;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import com.mrusedev.voleytrack.adapter.websocket.PizarraBienvenida;
import java.net.URI;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.InOrder;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

class PartidoWebSocketHandlerTest {

    private final PartidoSessionRegistry registry = mock(PartidoSessionRegistry.class);
    private final PizarraBienvenida bienvenida = mock(PizarraBienvenida.class);
    private final PartidoWebSocketHandler handler =
            new PartidoWebSocketHandler(registry, bienvenida);

    private static WebSocketSession sesionConUri(String uri) {
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(sesion.getUri()).thenReturn(URI.create(uri));
        return sesion;
    }

    @Test
    void alConectarEnviaElEstadoInicialAntesDeRegistrarLaSesion() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = sesionConUri("/ws/partidos/" + partidoId);
        when(bienvenida.enviarEstadoInicial(partidoId, sesion)).thenReturn(true);

        handler.afterConnectionEstablished(sesion);

        InOrder orden = inOrder(bienvenida, registry);
        orden.verify(bienvenida).enviarEstadoInicial(partidoId, sesion);
        orden.verify(registry).registrar(partidoId, sesion);
    }

    @Test
    void alConectarConUnPartidoInexistenteCierraLaConexionSinRegistrar() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = sesionConUri("/ws/partidos/" + partidoId);
        when(bienvenida.enviarEstadoInicial(partidoId, sesion)).thenReturn(false);

        handler.afterConnectionEstablished(sesion);

        verify(registry, never()).registrar(any(), any());
        verify(sesion).close(CloseStatus.BAD_DATA);
    }

    @Test
    void alConectarConUnPartidoInvalidoNiPideLaPizarraNiRegistra() throws Exception {
        WebSocketSession sesion = sesionConUri("/ws/partidos/no-es-un-uuid");

        handler.afterConnectionEstablished(sesion);

        verifyNoInteractions(registry, bienvenida);
        verify(sesion).close(CloseStatus.BAD_DATA);
    }

    @Test
    void alCerrarDesregistraLaSesion() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = sesionConUri("/ws/partidos/" + partidoId);

        handler.afterConnectionClosed(sesion, CloseStatus.NORMAL);

        verify(registry).desregistrar(partidoId, sesion);
        verifyNoInteractions(bienvenida);
    }
}
