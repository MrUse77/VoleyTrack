package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.*;
import com.mrusedev.voleytrack.application.port.out.*;
import com.mrusedev.voleytrack.domain.*;
import org.springframework.stereotype.Service;

@Service
public class GestorUsuariosImpl {
  private final UsuarioRepositoryPort usuarioRepo;

  public GestorUsuariosImpl(UsuarioRepositoryPort usuarioRepo) {
    this.usuarioRepo = usuarioRepo;
  }
}
