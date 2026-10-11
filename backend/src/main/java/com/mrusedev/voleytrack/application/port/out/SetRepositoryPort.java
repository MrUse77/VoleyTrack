package com.mrusedev.voleytrack.application.port.out;

import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

public interface SetRepositoryPort {

  SetPartido guardar(SetPartido set, UUID partidoId);

  Optional<SetPartido> buscarPorId(UUID id);

  Optional<UUID> buscarPartidoId(UUID setId);

  List<SetPartido> buscarPorPartido(UUID partidoId);

  Map<UUID, List<SetPartido>> buscarPorPartidos(Map<UUID, Partido> partidos);
}
