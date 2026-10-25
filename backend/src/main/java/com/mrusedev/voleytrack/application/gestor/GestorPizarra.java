package com.mrusedev.voleytrack.application.gestor;

import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPizarraPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Lado;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.TipoLado;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

/**
 * Experto en Información de la proyección "pizarra en vivo" (RF-13, RF-14): sabe cómo se ve el
 * estado de un partido, sin enviarlo ni persistirlo.
 */
@Service
public class GestorPizarra implements GestorPizarraPort {

  private final PartidoRepositoryPort partidoRepo;

  public GestorPizarra(PartidoRepositoryPort partidoRepo) {
    this.partidoRepo = partidoRepo;
  }

  @Override
  public PizarraEnVivoDTO obtenerPizarra(UUID partidoId) {
    Partido partido = buscarPartido(partidoId);

    Lado ladoLocal =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.LOCAL)
            .findFirst()
            .orElseThrow();
    Lado ladoVisitante =
        partido.getLados().stream()
            .filter(l -> l.getTipo() == TipoLado.VISITANTE)
            .findFirst()
            .orElseThrow();

    SetPartido setActual = partido.getSetActual();
    PizarraEnVivoDTO.SetActualDTO setActualDTO =
        setActual == null
            ? null
            : new PizarraEnVivoDTO.SetActualDTO(
                setActual.getNumeroSet(),
                setActual.isEsTieBreak(),
                setActual.getMarcador().getLimitePuntos(),
                setActual.getMarcador().getPuntos(setActual.getMarcador().getLadoLocal()),
                setActual.getMarcador().getPuntos(setActual.getMarcador().getLadoVisitante()));

    UUID equipoSaqueId =
        setActual != null && setActual.getSaque() != null ? setActual.getSaque().getId() : null;

    String estadoSet = setActual == null ? null : setActual.getEstado().name();

    return new PizarraEnVivoDTO(
        new PizarraEnVivoDTO.EquipoPizarraDTO(
            ladoLocal.getEquipo().getId(), ladoLocal.getEquipo().getNombreClub()),
        new PizarraEnVivoDTO.EquipoPizarraDTO(
            ladoVisitante.getEquipo().getId(), ladoVisitante.getEquipo().getNombreClub()),
        contarSetsGanados(partido, TipoLado.LOCAL),
        contarSetsGanados(partido, TipoLado.VISITANTE),
        setActualDTO,
        equipoSaqueId,
        partido.getEstado().name(),
        estadoSet,
        ultimosEventos(partido));
  }

  private int contarSetsGanados(Partido partido, TipoLado tipo) {
    return (int)
        partido.getSets().stream()
            .filter(s -> s.getMarcador().getGanador() != null)
            .filter(s -> s.getMarcador().getGanador().getTipo() == tipo)
            .count();
  }

  private List<PizarraEnVivoDTO.EventoPizarraDTO> ultimosEventos(Partido partido) {
    List<PizarraEnVivoDTO.EventoPizarraDTO> eventos = new ArrayList<>();
    for (SetPartido set : partido.getSets()) {
      if (set.getEventos() == null) {
        continue;
      }
      for (Evento evento : set.getEventos()) {
        Jugador jugador = evento.getJugador();
        eventos.add(
            new PizarraEnVivoDTO.EventoPizarraDTO(
                jugador != null ? jugador.getId() : null,
                jugador != null ? jugador.getNombre() + " " + jugador.getApellido() : null,
                evento.getTipoFundamento().name()));
      }
    }
    int desde = Math.max(0, eventos.size() - 10);
    return List.copyOf(eventos.subList(desde, eventos.size()));
  }

  private Partido buscarPartido(UUID partidoId) {
    return partidoRepo
        .buscarPorId(partidoId)
        .orElseThrow(() -> new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));
  }
}
