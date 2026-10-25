package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.in.*;
import com.mrusedev.voleytrack.application.dto.out.*;
import com.mrusedev.voleytrack.domain.*;
import java.util.List;
import java.util.UUID;

public interface GestorEquipoPort {
  EquipoDTO obtenerEquipo(UUID id);

  List<EquipoDTO> obtenerEquipos();
}
