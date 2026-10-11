package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.AlineacionJugadorSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.AlineacionSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.SetSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.PartidoSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.AlineacionEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.PartidoEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.SetEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.AlineacionMapper;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.SetMapper;

import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.EventoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SustitucionRepositoryPort;
import com.mrusedev.voleytrack.domain.Alineacion;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Evento;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.Sustitucion;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class SetRepositoryPortImpl implements SetRepositoryPort {

    private final SetSpringDataRepository repo;
    private final PartidoSpringDataRepository partidoRepo;
    private final EquipoRepositoryPort equipoRepo;
    private final EventoRepositoryPort eventoRepo;
    private final SustitucionRepositoryPort sustitucionRepo;
    private final JugadorRepositoryPort jugadorRepo;
    private final AlineacionSpringDataRepository alineacionRepo;
    private final AlineacionJugadorSpringDataRepository alineacionJugadorRepo;

    public SetRepositoryPortImpl(SetSpringDataRepository repo,
                                 PartidoSpringDataRepository partidoRepo,
                                 EquipoRepositoryPort equipoRepo,
                                 EventoRepositoryPort eventoRepo,
                                 SustitucionRepositoryPort sustitucionRepo,
                                 JugadorRepositoryPort jugadorRepo,
                                 AlineacionSpringDataRepository alineacionRepo,
                                 AlineacionJugadorSpringDataRepository alineacionJugadorRepo) {
        this.repo = repo;
        this.partidoRepo = partidoRepo;
        this.equipoRepo = equipoRepo;
        this.eventoRepo = eventoRepo;
        this.sustitucionRepo = sustitucionRepo;
        this.jugadorRepo = jugadorRepo;
        this.alineacionRepo = alineacionRepo;
        this.alineacionJugadorRepo = alineacionJugadorRepo;
    }

    @Override
    public SetPartido guardar(SetPartido set, UUID partidoId) {
        SetEntity entity = SetMapper.toEntity(set, partidoId);
        if (repo.existsById(set.getId())) {
            entity.markPersisted();
        }
        repo.save(entity);
        reemplazarAlineaciones(set);
        return set;
    }

    /** Wipes and rewrites this set's alignments so re-saves never duplicate rows. */
    private void reemplazarAlineaciones(SetPartido set) {
        List<AlineacionEntity> existentes = alineacionRepo.findBySetId(set.getId());
        for (AlineacionEntity header : existentes) {
            alineacionJugadorRepo.deleteAll(
                    alineacionJugadorRepo.findByAlineacionId(header.getId()));
        }
        alineacionRepo.deleteAll(existentes);

        guardarAlineacion(set.getAlineacionLocal(), set.getId());
        guardarAlineacion(set.getAlineacionVisitante(), set.getId());
    }

    private void guardarAlineacion(Alineacion alineacion, UUID setId) {
        if (alineacion == null) {
            return;
        }
        AlineacionEntity header = AlineacionMapper.toEntity(alineacion, setId);
        alineacionRepo.save(header);
        alineacionJugadorRepo.saveAll(
                AlineacionMapper.toJugadorEntities(alineacion, header.getId()));
    }

    @Override
    public Optional<SetPartido> buscarPorId(UUID id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<UUID> buscarPartidoId(UUID setId) {
        return repo.findById(setId).map(SetEntity::getPartidoId);
    }

    @Override
    public List<SetPartido> buscarPorPartido(UUID partidoId) {
        return repo.findByPartidoId(partidoId).stream()
                .map(this::toDomain)
                .toList();
    }

    /**
     * Carga los sets de varios partidos de una sola pasada.
     *
     * <p>TODO(optimizacion): hoy delega en {@link #buscarPorPartido} — correcto, pero sigue
     * consultando por partido, asi que no elimina el N+1 todavia. La version en bloque de verdad
     * necesita un overload {@code toDomain(SetEntity, Partido yaCargado)} para reusar los partidos
     * ya traidos por {@code PartidoRepositoryPortImpl.buscarTodos} SIN perder la restauracion de
     * saque / eventos / sustituciones / alineaciones que hace {@link #toDomain(SetEntity)}.
     */
    @Override
    public Map<UUID, List<SetPartido>> buscarPorPartidos(Map<UUID, Partido> partidos) {
        return partidos.keySet().stream()
                .collect(Collectors.toMap(id -> id, this::buscarPorPartido));
    }

    private SetPartido toDomain(SetEntity entity) {
        // Load real equipos from the associated partido — never use stubs.
        PartidoEntity partidoEntity = partidoRepo.findById(entity.getPartidoId())
                .orElse(null);
        Equipo equipoLocal;
        Equipo equipoVisitante;
        if (partidoEntity != null) {
            equipoLocal = equipoRepo.buscarPorId(partidoEntity.getEquipoLocalId()).orElse(null);
            equipoVisitante = equipoRepo.buscarPorId(partidoEntity.getEquipoVisitanteId()).orElse(null);
        } else {
            equipoLocal = null;
            equipoVisitante = null;
        }
        SetPartido set = SetMapper.toDomain(entity, equipoLocal, equipoVisitante);
        // Restore serve ownership
        if (entity.getSaqueInicialId() != null) {
            Equipo saque = equipoRepo.buscarPorId(entity.getSaqueInicialId()).orElse(null);
            if (saque != null) {
                set.asignarSaqueInicial(saque);
            }
        }
        // Restore persisted events — point-by-point history must survive reload
        List<Evento> eventos = eventoRepo.buscarPorSet(entity.getId());
        set.restaurarEventos(eventos);
        // Restore persisted sustituciones
        List<Sustitucion> sustituciones = sustitucionRepo.buscarPorSet(entity.getId());
        set.restaurarSustituciones(sustituciones);
        // Restore persisted alignments — must reuse the exact marcador equipo instances
        restaurarAlineaciones(set, entity.getId(), equipoLocal, equipoVisitante);
        return set;
    }

    private void restaurarAlineaciones(SetPartido set, UUID setId,
                                       Equipo equipoLocal, Equipo equipoVisitante) {
        for (AlineacionEntity header : alineacionRepo.findBySetId(setId)) {
            Equipo equipo = matchEquipo(header.getEquipoId(), equipoLocal, equipoVisitante);
            if (equipo == null) {
                continue;
            }
            Alineacion alineacion = set.crearAlineacion(equipo);
            AlineacionMapper.restaurar(alineacion,
                    alineacionJugadorRepo.findByAlineacionId(header.getId()),
                    jugadorId -> jugadorRepo.buscarPorId(jugadorId).orElse(null));
        }
    }

    private Equipo matchEquipo(UUID equipoId, Equipo equipoLocal, Equipo equipoVisitante) {
        if (equipoLocal != null && equipoLocal.getId().equals(equipoId)) {
            return equipoLocal;
        }
        if (equipoVisitante != null && equipoVisitante.getId().equals(equipoId)) {
            return equipoVisitante;
        }
        return null;
    }
}
