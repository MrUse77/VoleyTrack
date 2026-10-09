package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.port.in.ConsultarPartidoPort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/partidos")
public class PartidoController {

    private final ConsultarPartidoPort consultarPartidoPort;

    public PartidoController(ConsultarPartidoPort consultarPartidoPort) {
        this.consultarPartidoPort = consultarPartidoPort;
    }

    @GetMapping("/{partidoId}/inicio")
    public DatosInicioPartidoDTO cargarDatosInicio(@PathVariable UUID partidoId) {
        return consultarPartidoPort.cargarDatosInicio(partidoId);
    }

    @GetMapping("/{partidoId}/pizarra")
    public PizarraEnVivoDTO obtenerPizarra(@PathVariable UUID partidoId) {
        return consultarPartidoPort.obtenerPizarra(partidoId);
    }
}
