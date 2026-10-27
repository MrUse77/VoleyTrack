package com.mrusedev.voleytrack.adapter.websocket;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

class PartidoSessionRegistryTest {

    private static final String PAYLOAD = "{\"tipo\":\"PUNTO_REGISTRADO\"}";

    private final PartidoSessionRegistry registry = new PartidoSessionRegistry();

    private static WebSocketSession sesion(String id) {
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(sesion.getId()).thenReturn(id);
        when(sesion.isOpen()).thenReturn(true);
        return sesion;
    }

    private static boolean llevaElPayload(Object mensaje) {
        return PAYLOAD.equals(((TextMessage) mensaje).getPayload());
    }

    @Test
    void enviarSoloAlcanzaLasSesionesDelPartido() throws Exception {
        UUID partidoA = UUID.randomUUID();
        UUID partidoB = UUID.randomUUID();
        WebSocketSession a1 = sesion("a1");
        WebSocketSession a2 = sesion("a2");
        WebSocketSession b1 = sesion("b1");

        registry.registrar(partidoA, a1);
        registry.registrar(partidoA, a2);
        registry.registrar(partidoB, b1);

        registry.enviar(partidoA, PAYLOAD);

        verify(a1).sendMessage(argThat(PartidoSessionRegistryTest::llevaElPayload));
        verify(a2).sendMessage(argThat(PartidoSessionRegistryTest::llevaElPayload));
        verify(b1, never()).sendMessage(any());
    }

    @Test
    void unaSesionQueFallaNoCortaElEnvioANiQuedaRegistrada() throws Exception {
        UUID partido = UUID.randomUUID();
        WebSocketSession rota = sesion("rota");
        WebSocketSession sana = sesion("sana");
        doThrow(new IOException("sesion caida")).when(rota).sendMessage(any());

        registry.registrar(partido, rota);
        registry.registrar(partido, sana);

        registry.enviar(partido, PAYLOAD);
        registry.enviar(partido, PAYLOAD);

        verify(sana, times(2)).sendMessage(argThat(PartidoSessionRegistryTest::llevaElPayload));
        verify(rota, times(1)).sendMessage(any());
    }

    @Test
    void unaSesionCerradaSeDescartaSinEnviar() throws Exception {
        UUID partido = UUID.randomUUID();
        WebSocketSession cerrada = sesion("cerrada");
        when(cerrada.isOpen()).thenReturn(false);

        registry.registrar(partido, cerrada);

        registry.enviar(partido, PAYLOAD);

        verify(cerrada, never()).sendMessage(any());
    }
}
