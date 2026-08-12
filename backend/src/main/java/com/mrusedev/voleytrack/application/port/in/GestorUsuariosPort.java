package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.in.*;
import com.mrusedev.voleytrack.application.dto.out.*;

public interface GestorUsuariosPort {
  SesionIniciadaDTO IniciarSesion(IniciarSesionDTO user);

  void CambiarContraseña(CambiarContraseñaDTO user);

  void CerrarSesion();
}
