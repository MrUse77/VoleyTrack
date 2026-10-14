package com.mrusedev.voleytrack.domain;

import java.util.Arrays;
import java.util.List;

public enum TipoFundamento {
  SAQUE("Saque"),
  ATAQUE("Ataque"),
  BLOQUEO("Bloqueo"),
  DEFENSA("Defensa"),
  RECEPCION("Recepción"),
  ERROR_NO_FORZADO("Error no forzado"),
  ERROR_SAQUE("Error de saque");

  private final String descripcion;

  TipoFundamento(String descripcion) {
    this.descripcion = descripcion;
  }

  public String getDescripcion() {
    return descripcion;
  }

  public static List<String> getFundamentos() {
    return Arrays.stream(TipoFundamento.values()).map(TipoFundamento::name).toList();
  }
}
