package com.mrusedev.voleytrack.adapter.websocket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPizarraPort;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class PizarraBienvenidaTest {

    private final GestorPizarraPort gestorPizarra = mock(GestorPizarraPort.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final PizarraBienvenida bienvenida =
            new PizarraBienvenida(gestorPizarra, new PizarraJson(objectMapper));

    private static PizarraEnVivoDTO unaPizarra() {
        UUID local = UUID.randomUUID();
        UUID jugador = UUID.randomUUID();
        return new PizarraEnVivoDTO(
                new PizarraEnVivoDTO.EquipoPizarraDTO(local, "Local FC"),
                new PizarraEnVivoDTO.EquipoPizarraDTO(UUID.randomUUID(), "Visitante FC"),
                1,
                0,
                new PizarraEnVivoDTO.SetActualDTO(2, false, 25, 7, 3),
                local,
                "EN_CURSO",
                "EN_CURSO",
                List.of(new PizarraEnVivoDTO.EventoPizarraDTO(jugador, "Perez", "ATAQUE")));
    }

    @Test
    void enviaElEstadoInicialConLaPizarraActual() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(gestorPizarra.obtenerPizarra(partidoId)).thenReturn(unaPizarra());

        assertThat(bienvenida.enviarEstadoInicial(partidoId, sesion)).isTrue();

        ArgumentCaptor<TextMessage> mensaje = ArgumentCaptor.forClass(TextMessage.class);
        verify(sesion).sendMessage(mensaje.capture());
        JsonNode json = objectMapper.readTree(mensaje.getValue().getPayload());
        assertThat(json.get("tipo").asString()).isEqualTo("ESTADO_INICIAL");
        assertThat(json.get("evento").isNull()).isTrue();
        assertThat(json.get("pizarra").get("setsLocal").asInt()).isEqualTo(1);
        assertThat(json.get("pizarra").get("setActual").get("puntosLocal").asInt()).isEqualTo(7);
        assertThat(json.get("pizarra").get("ultimosEventos").get(0).get("tipoFundamento").asString())
                .isEqualTo("ATAQUE");
    }

    @Test
    void siElPartidoNoExisteNoEnviaNada() throws Exception {
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(gestorPizarra.obtenerPizarra(partidoId))
                .thenThrow(new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));

        assertThat(bienvenida.enviarEstadoInicial(partidoId, sesion)).isFalse();

        verifyNoInteractions(sesion);
    }

    @Test
    void siLaSerializacionFallaNoEnviaNada() throws Exception {
        ObjectMapper roto = mock(ObjectMapper.class);
        when(roto.writeValueAsString(any())).thenThrow(new JacksonException("boom") {});
        PizarraBienvenida bienvenidaSinJson =
                new PizarraBienvenida(gestorPizarra, new PizarraJson(roto));
        UUID partidoId = UUID.randomUUID();
        WebSocketSession sesion = mock(WebSocketSession.class);
        when(gestorPizarra.obtenerPizarra(partidoId)).thenReturn(unaPizarra());

        assertThat(bienvenidaSinJson.enviarEstadoInicial(partidoId, sesion)).isFalse();

        verifyNoInteractions(sesion);
    }
}
