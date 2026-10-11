package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/sets")
public class SetController {

    private final GestorPartidoPort gestorPartidoPort;

    public SetController(GestorPartidoPort gestorPartidoPort) {
        this.gestorPartidoPort = gestorPartidoPort;
    }

    @GetMapping("/{setId}/equipos/{equipoId}/opciones-punto")
    public OpcionesPuntoDTO cargarOpcionesPunto(@PathVariable UUID setId,
                                                @PathVariable UUID equipoId) {
        return gestorPartidoPort.cargarOpcionesPunto(setId, equipoId);
    }
}
