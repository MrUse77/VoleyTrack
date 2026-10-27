package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.in.*;
import com.mrusedev.voleytrack.application.dto.out.*;

public interface GestorPlanilleroPort {
  void crearPlanillero(PlanilleroDTO planillero);
}
