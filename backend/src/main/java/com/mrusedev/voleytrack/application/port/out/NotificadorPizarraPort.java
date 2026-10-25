package com.mrusedev.voleytrack.application.port.out;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public interface NotificadorPizarraPort {
  void notificarCambioPizarra(UUID partidoId, CambioPizarraDTO cambio);
}
