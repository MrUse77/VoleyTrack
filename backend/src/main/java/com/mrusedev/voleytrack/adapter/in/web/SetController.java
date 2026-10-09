package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.port.in.ConsultarPartidoPort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/sets")
public class SetController {

    private final ConsultarPartidoPort consultarPartidoPort;

    public SetController(ConsultarPartidoPort consultarPartidoPort) {
        this.consultarPartidoPort = consultarPartidoPort;
    }

    @GetMapping("/{setId}/equipos/{equipoId}/opciones-punto")
    public OpcionesPuntoDTO cargarOpcionesPunto(@PathVariable UUID setId,
                                                @PathVariable UUID equipoId) {
        return consultarPartidoPort.cargarOpcionesPunto(setId, equipoId);
    }
}
