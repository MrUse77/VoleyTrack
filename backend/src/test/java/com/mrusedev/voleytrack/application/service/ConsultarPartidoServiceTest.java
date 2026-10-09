package com.mrusedev.voleytrack.application.service;

import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import com.mrusedev.voleytrack.application.port.out.EquipoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.PartidoRepositoryPort;
import com.mrusedev.voleytrack.application.port.out.SetRepositoryPort;
import com.mrusedev.voleytrack.domain.CantSets;
import com.mrusedev.voleytrack.domain.Equipo;
import com.mrusedev.voleytrack.domain.Jugador;
import com.mrusedev.voleytrack.domain.Lado;
import com.mrusedev.voleytrack.domain.Partido;
import com.mrusedev.voleytrack.domain.Posicion;
import com.mrusedev.voleytrack.domain.SetPartido;
import com.mrusedev.voleytrack.domain.TipoFundamento;
import com.mrusedev.voleytrack.domain.TipoLado;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConsultarPartidoServiceTest {

	@Mock
	private PartidoRepositoryPort partidoRepo;
	@Mock
	private SetRepositoryPort setRepo;
	@Mock
	private EquipoRepositoryPort equipoRepo;
	@Mock
	private GestorPartidoPort gestorPartidoPort;

	@InjectMocks
	private ConsultarPartidoService service;

	private Equipo equipoLocal;
	private Equipo equipoVisitante;
	private Jugador jugadorLocal;
	private Jugador jugadorLocal2;
	private Jugador jugadorVisitante;

	@BeforeEach
	void setUp() {
		equipoLocal = new Equipo(UUID.randomUUID(), "Club A", "Entrenador A");
		equipoVisitante = new Equipo(UUID.randomUUID(), "Club B", "Entrenador B");
		jugadorLocal = new Jugador(UUID.randomUUID(), "Jugador", "Local",
				LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
		jugadorLocal2 = new Jugador(UUID.randomUUID(), "Jugador", "Local2",
				LocalDate.of(2000, 1, 1), 2, Posicion.PUNTA_RECEPTOR);
		jugadorVisitante = new Jugador(UUID.randomUUID(), "Jugador", "Visitante",
				LocalDate.of(2000, 1, 1), 1, Posicion.PUNTA_RECEPTOR);
	}

	// ── cargarDatosInicio ──

	@Test
	void cargarDatosInicioDevuelveDtoDelGestor() {
		UUID partidoId = UUID.randomUUID();
		Partido partido = new Partido(partidoId, equipoLocal, equipoVisitante, new CantSets(5));
		DatosInicioPartidoDTO esperado = new DatosInicioPartidoDTO(
				partidoId, "Club A", "Club B", 5, 3, "PROGRAMADO");
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(gestorPartidoPort.cargarDatosInicio(partidoId)).thenReturn(esperado);

		DatosInicioPartidoDTO resultado = service.cargarDatosInicio(partidoId);

		assertThat(resultado).isEqualTo(esperado);
		verify(gestorPartidoPort).cargarDatosInicio(partidoId);
	}

	@Test
	void cargarDatosInicioInexistenteLanzaRecursoNoEncontrado() {
		UUID partidoId = UUID.randomUUID();
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.cargarDatosInicio(partidoId))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Partido no encontrado: " + partidoId);

		verifyNoInteractions(gestorPartidoPort);
	}

	// ── obtenerPizarra ──

	@Test
	void obtenerPizarraDerivaEstadoPuntosSaqueYEventosDelAgregado() {
		UUID partidoId = UUID.randomUUID();
		Partido partido = new Partido(partidoId, equipoLocal, equipoVisitante, new CantSets(5));
		partido.iniciar();

		SetPartido set1 = partido.iniciarSet();
		set1.iniciar();
		for (int i = 0; i < 15; i++) {
			partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);
		}
		for (int i = 0; i < 10; i++) {
			partido.anotarPunto(equipoLocal, jugadorLocal2, TipoFundamento.BLOQUEO);
		}

		SetPartido set2 = partido.iniciarSet();
		set2.iniciar();
		set2.asignarSaqueInicial(equipoVisitante);
		partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.SAQUE);
		partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.DEFENSA);
		partido.anotarPunto(equipoLocal, jugadorLocal, TipoFundamento.ATAQUE);
		partido.anotarPunto(equipoVisitante, jugadorVisitante, TipoFundamento.BLOQUEO);

		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));

		PizarraEnVivoDTO pizarra = service.obtenerPizarra(partidoId);

		assertThat(pizarra.equipoLocal().id()).isEqualTo(equipoLocal.getId());
		assertThat(pizarra.equipoLocal().nombre()).isEqualTo("Club A");
		assertThat(pizarra.equipoVisitante().id()).isEqualTo(equipoVisitante.getId());
		assertThat(pizarra.equipoVisitante().nombre()).isEqualTo("Club B");
		assertThat(pizarra.setsLocal()).isEqualTo(1);
		assertThat(pizarra.setsVisitante()).isZero();
		assertThat(pizarra.setActual().numeroSet()).isEqualTo(2);
		assertThat(pizarra.setActual().esTieBreak()).isFalse();
		assertThat(pizarra.setActual().limitePuntos()).isEqualTo(25);
		assertThat(pizarra.setActual().puntosLocal()).isEqualTo(2);
		assertThat(pizarra.setActual().puntosVisitante()).isEqualTo(2);
		assertThat(pizarra.equipoSaqueId()).isEqualTo(equipoVisitante.getId());
		assertThat(pizarra.estadoPartido()).isEqualTo("EN_CURSO");
		assertThat(pizarra.estadoSet()).isEqualTo("EN_CURSO");
		assertThat(pizarra.ultimosEventos()).hasSize(10);
		assertThat(pizarra.ultimosEventos().getFirst().jugadorId()).isEqualTo(jugadorLocal2.getId());
		assertThat(pizarra.ultimosEventos().getFirst().jugadorNombre()).isEqualTo("Jugador Local2");
		assertThat(pizarra.ultimosEventos().getFirst().tipoFundamento()).isEqualTo("BLOQUEO");
		assertThat(pizarra.ultimosEventos().getLast().jugadorId()).isEqualTo(jugadorVisitante.getId());
		assertThat(pizarra.ultimosEventos().getLast().jugadorNombre()).isEqualTo("Jugador Visitante");
		assertThat(pizarra.ultimosEventos().getLast().tipoFundamento()).isEqualTo("BLOQUEO");
	}

	@Test
	void obtenerPizarraInexistenteLanzaRecursoNoEncontrado() {
		UUID partidoId = UUID.randomUUID();
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.obtenerPizarra(partidoId))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Partido no encontrado: " + partidoId);
	}

	@Test
	void obtenerPizarraSinSetsDevuelveCamposNulosYEventosVacios() {
		UUID partidoId = UUID.randomUUID();
		Partido partido = new Partido(partidoId, equipoLocal, equipoVisitante, new CantSets(5));
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));

		PizarraEnVivoDTO pizarra = service.obtenerPizarra(partidoId);

		assertThat(pizarra.setActual()).isNull();
		assertThat(pizarra.estadoSet()).isNull();
		assertThat(pizarra.equipoSaqueId()).isNull();
		assertThat(pizarra.ultimosEventos()).isEmpty();
		assertThat(pizarra.estadoPartido()).isEqualTo("PROGRAMADO");
	}

	// ── cargarOpcionesPunto ──

	@Test
	void cargarOpcionesPuntoDevuelveDtoDelGestorConEntidadesCargadas() {
		UUID setId = UUID.randomUUID();
		SetPartido set = setDeEjemplo();
		OpcionesPuntoDTO esperado = new OpcionesPuntoDTO(equipoLocal.getId(), "Club A", List.of());
		when(setRepo.buscarPorId(setId)).thenReturn(Optional.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
		when(gestorPartidoPort.cargarOpcionesPunto(set, equipoLocal)).thenReturn(esperado);

		OpcionesPuntoDTO resultado = service.cargarOpcionesPunto(setId, equipoLocal.getId());

		assertThat(resultado).isEqualTo(esperado);
		verify(gestorPartidoPort).cargarOpcionesPunto(set, equipoLocal);
	}

	@Test
	void cargarOpcionesPuntoConSetDesconocidoLanzaRecursoNoEncontrado() {
		UUID setId = UUID.randomUUID();
		when(setRepo.buscarPorId(setId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.cargarOpcionesPunto(setId, equipoLocal.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Set no encontrado: " + setId);
	}

	@Test
	void cargarOpcionesPuntoConEquipoDesconocidoLanzaRecursoNoEncontrado() {
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();
		when(setRepo.buscarPorId(setId)).thenReturn(Optional.of(setDeEjemplo()));
		when(equipoRepo.buscarPorId(equipoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.cargarOpcionesPunto(setId, equipoId))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Equipo no encontrado: " + equipoId);
	}

	private SetPartido setDeEjemplo() {
		return new SetPartido(
				1,
				false,
				new Lado(TipoLado.LOCAL, equipoLocal),
				new Lado(TipoLado.VISITANTE, equipoVisitante));
	}
}
