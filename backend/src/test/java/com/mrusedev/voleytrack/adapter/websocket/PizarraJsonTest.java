package com.mrusedev.voleytrack.adapter.websocket;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.dto.out.PuntoRegistradoDTO;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class PizarraJsonTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final PizarraJson pizarraJson = new PizarraJson(objectMapper);

    private static CambioPizarraDTO unCambio() {
        UUID local = UUID.randomUUID();
        UUID jugador = UUID.randomUUID();
        PizarraEnVivoDTO pizarra =
                new PizarraEnVivoDTO(
                        new PizarraEnVivoDTO.EquipoPizarraDTO(local, "Local FC"),
                        new PizarraEnVivoDTO.EquipoPizarraDTO(UUID.randomUUID(), "Visitante FC"),
                        1,
                        0,
                        new PizarraEnVivoDTO.SetActualDTO(2, false, 25, 7, 3),
                        local,
                        "EN_CURSO",
                        "EN_CURSO",
                        List.of(new PizarraEnVivoDTO.EventoPizarraDTO(jugador, "Perez", "ATAQUE")));
        return new CambioPizarraDTO(
                "PUNTO_REGISTRADO",
                new PuntoRegistradoDTO(local, jugador, "Perez", "Juan", "ATAQUE", 2),
                pizarra);
    }

    @Test
    void serializaElContratoDelWire() {
        JsonNode json = objectMapper.readTree(pizarraJson.aJson(unCambio()).orElseThrow());

        assertThat(json.get("tipo").asString()).isEqualTo("PUNTO_REGISTRADO");
        assertThat(json.get("evento").get("jugadorNombre").asString()).isEqualTo("Perez");
        assertThat(json.get("evento").get("numeroSet").asInt()).isEqualTo(2);
        assertThat(json.get("pizarra").get("setsLocal").asInt()).isEqualTo(1);
        assertThat(json.get("pizarra").get("setActual").get("puntosLocal").asInt()).isEqualTo(7);
        assertThat(json.get("pizarra").get("ultimosEventos").get(0).get("tipoFundamento").asString())
                .isEqualTo("ATAQUE");
    }

    @Test
    void siElMapperFallaDevuelveVacioSinPropagar() {
        ObjectMapper roto = mock(ObjectMapper.class);
        when(roto.writeValueAsString(any())).thenThrow(new JacksonException("boom") {});
        PizarraJson pizarraJsonConMapperRoto = new PizarraJson(roto);

        assertThatNoException().isThrownBy(() -> pizarraJsonConMapperRoto.aJson(unCambio()));
        assertThat(pizarraJsonConMapperRoto.aJson(unCambio())).isEmpty();
    }
}
