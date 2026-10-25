package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;

import java.util.UUID;

public interface GestorPizarraPort {

	PizarraEnVivoDTO obtenerPizarra(UUID partidoId);
}
