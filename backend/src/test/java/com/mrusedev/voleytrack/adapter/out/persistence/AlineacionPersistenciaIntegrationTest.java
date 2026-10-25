package com.mrusedev.voleytrack.adapter.out.persistence;

import com.mrusedev.voleytrack.application.dto.out.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.JugadorRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.Alineacion;
import com.mrusedev.voleytrack.domain.CantSets;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.Posicion;
import com.mrusedev.voleytrack.domain.SetPartido;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Sql(scripts = "/schema.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
class AlineacionPersistenciaIntegrationTest {

    @Autowired
    private EquipoRepositoryPort equipoRepo;

    @Autowired
    private PartidoRepositoryPort partidoRepo;

    @Autowired
    private SetRepositoryPort setRepo;

    @Autowired
    private JugadorRepositoryPort jugadorRepo;

    @Autowired
    private GestorPartidoPort gestorPartidoPort;

    private Equipo equipo;
    private Jugador jugador1;
    private Jugador jugador2;
    private SetPartido set;
    private UUID partidoId;

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        equipo = new Equipo(UUID.randomUUID(), "Club Alineacion " + suffix, "Entrenador " + suffix);
        equipoRepo.guardar(equipo);

        jugador1 = new Jugador(UUID.randomUUID(), "NombreUno" + suffix, "ApellidoUno" + suffix,
                LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
        jugador2 = new Jugador(UUID.randomUUID(), "NombreDos" + suffix, "ApellidoDos" + suffix,
                LocalDate.of(2001, 2, 2), 2, Posicion.ARMADOR);
        equipo.agregarJugador(jugador1);
        equipo.agregarJugador(jugador2);
        jugadorRepo.guardar(jugador1);
        jugadorRepo.guardar(jugador2);

        Equipo visitante = new Equipo(UUID.randomUUID(), "Club Rival " + suffix, "Entrenador Rival " + suffix);
        equipoRepo.guardar(visitante);

        partidoId = UUID.randomUUID();
        Partido partido = new Partido(partidoId, equipo, visitante, new CantSets(5));
        partidoRepo.guardar(partido);
        set = partido.iniciarSet();
        setRepo.guardar(set, partidoId);
    }

    // ── (a) Round-trip of a set alignment ──

    @Test
    void roundTripPersisteYRehidrataAlineacion() {
        crearAlineacionDeDosTitularesConSacadorInicial();

        setRepo.guardar(set, partidoId);

        SetPartido porId = setRepo.buscarPorId(set.getId()).orElseThrow();
        assertAlineacionLocalCompleta(porId);

        SetPartido porPartido = setRepo.buscarPorPartido(partidoId).stream()
                .filter(s -> s.getId().equals(set.getId()))
                .findFirst()
                .orElseThrow();
        assertAlineacionLocalCompleta(porPartido);
    }

    // ── (b) End-to-end: point options after reload ──

    @Test
    void cargarOpcionesPuntoDevuelveJugadoresEnCanchaTrasPersistir() {
        crearAlineacionDeDosTitularesConSacadorInicial();
        setRepo.guardar(set, partidoId);

        OpcionesPuntoDTO opciones = gestorPartidoPort.cargarOpcionesPunto(set.getId(), equipo.getId());

        assertThat(opciones.equipoId()).isEqualTo(equipo.getId());
        assertThat(opciones.jugadores()).hasSize(2);
        assertThat(opciones.jugadores()).allMatch(OpcionesPuntoDTO.JugadorOpcionDTO::enCancha);

        Map<UUID, OpcionesPuntoDTO.JugadorOpcionDTO> porId = opciones.jugadores().stream()
                .collect(Collectors.toMap(OpcionesPuntoDTO.JugadorOpcionDTO::id, Function.identity()));

        assertThat(porId).containsOnlyKeys(jugador1.getId(), jugador2.getId());

        OpcionesPuntoDTO.JugadorOpcionDTO opcion1 = porId.get(jugador1.getId());
        assertThat(opcion1.nombre()).isEqualTo(jugador1.getNombre());
        assertThat(opcion1.apellido()).isEqualTo(jugador1.getApellido());
        assertThat(opcion1.dorsal()).isEqualTo(jugador1.getDorsal());

        OpcionesPuntoDTO.JugadorOpcionDTO opcion2 = porId.get(jugador2.getId());
        assertThat(opcion2.nombre()).isEqualTo(jugador2.getNombre());
        assertThat(opcion2.apellido()).isEqualTo(jugador2.getApellido());
        assertThat(opcion2.dorsal()).isEqualTo(jugador2.getDorsal());
    }

    // ── (c) Re-save replaces rows instead of duplicating ──

    @Test
    void reguardarReemplazaJugadoresSinFilasObsoletas() {
        Alineacion conDos = set.crearAlineacion(equipo);
        conDos.agregarJugador(jugador1, 1, true);
        conDos.agregarJugador(jugador2, 2, true);
        setRepo.guardar(set, partidoId);
        assertThat(setRepo.buscarPorId(set.getId()).orElseThrow()
                .getAlineacionLocal().getJugadoresEnCancha()).hasSize(2);

        Alineacion conUno = set.crearAlineacion(equipo);
        conUno.agregarJugador(jugador2, 2, true);
        setRepo.guardar(set, partidoId);

        SetPartido recargado = setRepo.buscarPorId(set.getId()).orElseThrow();
        assertThat(recargado.getAlineacionLocal().getJugadoresEnCancha()).hasSize(1);
        assertThat(recargado.getAlineacionLocal().getJugadoresEnCancha().get(0)
                .getJugador().getId()).isEqualTo(jugador2.getId());
    }

    // ── helpers ──

    private Alineacion crearAlineacionDeDosTitularesConSacadorInicial() {
        Alineacion alineacion = set.crearAlineacion(equipo);
        alineacion.agregarJugador(jugador1, 1, true);
        alineacion.agregarJugador(jugador2, 2, true);
        alineacion.getJugadorEnPosicion(1).marcarComoSacadorInicial();
        return alineacion;
    }

    private void assertAlineacionLocalCompleta(SetPartido cargado) {
        Alineacion local = cargado.getAlineacionLocal();
        assertThat(local).isNotNull();
        assertThat(local.getJugadoresEnCancha()).hasSize(2);
        assertThat(local.getJugadorEnPosicion(1)).isNotNull();
        assertThat(local.getJugadorEnPosicion(2)).isNotNull();
        assertThat(local.getJugadorEnPosicion(1).getJugador().getId()).isEqualTo(jugador1.getId());
        assertThat(local.getJugadorEnPosicion(2).getJugador().getId()).isEqualTo(jugador2.getId());
        assertThat(local.getJugadorEnPosicion(1).isEsTitular()).isTrue();
        assertThat(local.getJugadorEnPosicion(2).isEsTitular()).isTrue();
        assertThat(local.getJugadorEnPosicion(1).isEsSacadorInicial()).isTrue();
        assertThat(local.getJugadorEnPosicion(2).isEsSacadorInicial()).isFalse();
    }
}
