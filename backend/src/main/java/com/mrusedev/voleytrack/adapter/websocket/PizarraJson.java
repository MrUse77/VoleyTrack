package com.mrusedev.voleytrack.adapter.websocket;

import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

/** Único lugar donde el DTO de aplicación se convierte en el JSON que viaja por el socket. */
@Component
public class PizarraJson {

    private static final Logger log = LoggerFactory.getLogger(PizarraJson.class);

    private final ObjectMapper objectMapper;

    public PizarraJson(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Optional<String> aJson(CambioPizarraDTO cambio) {
        try {
            return Optional.of(objectMapper.writeValueAsString(cambio));
        } catch (JacksonException e) {
            log.error("No se pudo serializar el cambio de pizarra: {}", e.getMessage());
            return Optional.empty();
        }
    }
}
