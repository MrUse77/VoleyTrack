package com.mrusedev.voleytrack.adapter.out.websocket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import com.mrusedev.voleytrack.adapter.websocket.PizarraJson;
import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.dto.out.PuntoRegistradoDTO;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class NotificadorPizarraPortImplTest {

    private final PartidoSessionRegistry registry = mock(PartidoSessionRegistry.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final NotificadorPizarraPortImpl notificador =
            new NotificadorPizarraPortImpl(registry, new PizarraJson(objectMapper));

    private static CambioPizarraDTO unCambio() {
        UUID local = UUID.randomUUID();
        UUID visitante = UUID.randomUUID();
        UUID jugador = UUID.randomUUID();
        PizarraEnVivoDTO pizarra =
                new PizarraEnVivoDTO(
                        new PizarraEnVivoDTO.EquipoPizarraDTO(local, "Local FC"),
                        new PizarraEnVivoDTO.EquipoPizarraDTO(visitante, "Visitante FC"),
                        1,
                        0,
                        new PizarraEnVivoDTO.SetActualDTO(1, false, 25, 12, 9),
                        local,
                        "EN_JUEGO",
                        "EN_JUEGO",
                        List.of(new PizarraEnVivoDTO.EventoPizarraDTO(jugador, "Perez", "ATAQUE")));
        PuntoRegistradoDTO punto =
                new PuntoRegistradoDTO(local, jugador, "Perez", "Juan", "ATAQUE", 1);
        return new CambioPizarraDTO("PUNTO_REGISTRADO", punto, pizarra);
    }

    @Test
    void publicaElCambioSerializadoEnElPartidoDelCambio() {
        UUID partidoId = UUID.randomUUID();

        notificador.notificarCambioPizarra(partidoId, unCambio());

        ArgumentCaptor<String> payload = ArgumentCaptor.forClass(String.class);
        verify(registry).enviar(eq(partidoId), payload.capture());

        JsonNode json = objectMapper.readTree(payload.getValue());
        assertThat(json.get("tipo").asString()).isEqualTo("PUNTO_REGISTRADO");
        assertThat(json.get("evento").get("jugadorNombre").asString()).isEqualTo("Perez");
        assertThat(json.get("evento").get("numeroSet").asInt()).isEqualTo(1);
        assertThat(json.get("pizarra").get("setsLocal").asInt()).isEqualTo(1);
        assertThat(json.get("pizarra").get("setActual").get("puntosLocal").asInt()).isEqualTo(12);
    }

    @Test
    void siLaSerializacionFallaNoPropagaElErrorNiPublica() {
        ObjectMapper roto = mock(ObjectMapper.class);
        when(roto.writeValueAsString(any())).thenThrow(new JacksonException("boom") {});
        NotificadorPizarraPortImpl notificadorConMapperRoto =
                new NotificadorPizarraPortImpl(registry, new PizarraJson(roto));

        assertThatNoException()
                .isThrownBy(
                        () ->
                                notificadorConMapperRoto.notificarCambioPizarra(
                                        UUID.randomUUID(), unCambio()));
        verifyNoInteractions(registry);
    }
}
