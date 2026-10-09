package com.mrusedev.voleytrack.application.service;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
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
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PrepararPartidoServiceTest {

	@Mock private PartidoRepositoryPort partidoRepo;
	@Mock private SetRepositoryPort setRepo;
	@Mock private EquipoRepositoryPort equipoRepo;
	@Mock private JugadorRepositoryPort jugadorRepo;
	@Mock private GestorPartidoPort gestorPartidoPort;

	@InjectMocks private PrepararPartidoService service;

	private Equipo equipoLocal;
	private Equipo equipoVisitante;
	private Jugador jugador1;
	private Jugador jugador2;
	private Partido partido;
	private SetPartido set;

	private UUID partidoId;

	@BeforeEach
	void setUp() {
		equipoLocal = new Equipo(UUID.randomUUID(), "Club Local", "Entrenador L");
		equipoVisitante = new Equipo(UUID.randomUUID(), "Club Visitante", "Entrenador V");
		jugador1 = new Jugador(UUID.randomUUID(), "Ana", "Uno", LocalDate.of(2000, 1, 1), 1, Posicion.ARMADOR);
		jugador2 = new Jugador(UUID.randomUUID(), "Bea", "Dos", LocalDate.of(1999, 5, 5), 2, Posicion.CENTRAL);
		equipoLocal.agregarJugador(jugador1);
		equipoLocal.agregarJugador(jugador2);

		partido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
		set = partido.iniciarSet();
		partidoId = partido.getId();
	}

	// ── crearSet ──

	@Test
	void crearSetDevuelveElDtoDelGestorYPersisteElSetCreado() {
		InicioSetDTO esperado = new InicioSetDTO(set.getId(), 1, false, 25);
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(gestorPartidoPort.crearSet(partido)).thenReturn(esperado);

		InicioSetDTO resultado = service.crearSet(partidoId);

		assertThat(resultado).isEqualTo(esperado);
		verify(gestorPartidoPort).crearSet(partido);
		verify(setRepo).guardar(set, partidoId);
	}

	@Test
	void crearSetConPartidoInexistenteLanzaRecursoNoEncontradoYNoTocaAlGestor() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.crearSet(partidoId))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Partido no encontrado: " + partidoId);

		verifyNoInteractions(gestorPartidoPort);
		verifyNoInteractions(setRepo);
	}

	// ── cargarJugadoresDisponibles ──

	@Test
	void cargarJugadoresDisponiblesMapeaTodosLosCamposDelJugador() {
		jugador2.desactivar();
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
		when(gestorPartidoPort.cargarJugadoresDisponibles(equipoLocal))
				.thenReturn(List.of(jugador1, jugador2));

		List<JugadorDTO> resultado = service.cargarJugadoresDisponibles(equipoLocal.getId());

		assertThat(resultado).hasSize(2);
		JugadorDTO primero = resultado.getFirst();
		assertThat(primero.id()).isEqualTo(jugador1.getId());
		assertThat(primero.nombre()).isEqualTo("Ana");
		assertThat(primero.apellido()).isEqualTo("Uno");
		assertThat(primero.dorsal()).isEqualTo(1);
		assertThat(primero.posicion()).isEqualTo(Posicion.ARMADOR);
		assertThat(primero.activo()).isTrue();

		JugadorDTO segundo = resultado.get(1);
		assertThat(segundo.id()).isEqualTo(jugador2.getId());
		assertThat(segundo.nombre()).isEqualTo("Bea");
		assertThat(segundo.apellido()).isEqualTo("Dos");
		assertThat(segundo.dorsal()).isEqualTo(2);
		assertThat(segundo.posicion()).isEqualTo(Posicion.CENTRAL);
		assertThat(segundo.activo()).isFalse();

		verify(gestorPartidoPort).cargarJugadoresDisponibles(equipoLocal);
	}

	@Test
	void cargarJugadoresDisponiblesConEquipoInexistenteLanzaRecursoNoEncontrado() {
		UUID equipoId = equipoLocal.getId();
		when(equipoRepo.buscarPorId(equipoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.cargarJugadoresDisponibles(equipoId))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Equipo no encontrado: " + equipoId);

		verifyNoInteractions(gestorPartidoPort);
	}

	// ── guardarAlineacion ──

	@Test
	void guardarAlineacionAgregaCadaTitularYDevuelveElUltimoPreview() {
		AlineacionPreviewDTO primerPreview = new AlineacionPreviewDTO(equipoLocal.getId(), "Club Local",
				List.of(new AlineacionPreviewDTO.JugadorEnPosicionDTO(
						jugador1.getId(), "Ana", "Uno", 1, 1, true)));
		AlineacionPreviewDTO ultimoPreview = new AlineacionPreviewDTO(equipoLocal.getId(), "Club Local",
				List.of(new AlineacionPreviewDTO.JugadorEnPosicionDTO(
								jugador1.getId(), "Ana", "Uno", 1, 1, true),
						new AlineacionPreviewDTO.JugadorEnPosicionDTO(
								jugador2.getId(), "Bea", "Dos", 2, 2, true)));

		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
		when(jugadorRepo.buscarPorId(jugador1.getId())).thenReturn(Optional.of(jugador1));
		when(jugadorRepo.buscarPorId(jugador2.getId())).thenReturn(Optional.of(jugador2));
		when(gestorPartidoPort.agregarJugadorAAlineacion(any(), anyInt(), any()))
				.thenReturn(primerPreview, ultimoPreview);

		AlineacionPreviewDTO resultado = service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1),
						new JugadorEnPosicion(jugador2.getId(), 2)));

		assertThat(resultado).isEqualTo(ultimoPreview);

		ArgumentCaptor<Alineacion> captor = ArgumentCaptor.forClass(Alineacion.class);
		verify(gestorPartidoPort).agregarJugadorAAlineacion(eq(jugador1), eq(1), captor.capture());
		verify(gestorPartidoPort).agregarJugadorAAlineacion(eq(jugador2), eq(2), captor.capture());

		assertThat(set.getAlineacion(equipoLocal)).isNotNull();
		assertThat(captor.getAllValues().get(0)).isSameAs(set.getAlineacion(equipoLocal));
		assertThat(captor.getAllValues().get(1)).isSameAs(set.getAlineacion(equipoLocal));

		verify(setRepo).guardar(set, partidoId);
	}

	@Test
	void guardarAlineacionSinTitularesDevuelvePreviewVacioSinBuscarJugadores() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

		AlineacionPreviewDTO resultado = service.guardarAlineacion(partidoId, set.getId(),
				equipoLocal.getId(), List.of());

		assertThat(resultado.equipoId()).isEqualTo(equipoLocal.getId());
		assertThat(resultado.equipoNombre()).isEqualTo("Club Local");
		assertThat(resultado.jugadores()).isEmpty();

		verifyNoInteractions(jugadorRepo);
		verifyNoInteractions(gestorPartidoPort);
		verify(setRepo).guardar(set, partidoId);
	}

	@Test
	void guardarAlineacionConPartidoInexistenteLanzaRecursoNoEncontrado() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1))))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Partido no encontrado: " + partidoId);

		verifyNoInteractions(gestorPartidoPort);
	}

	@Test
	void guardarAlineacionConSetInexistenteLanzaRecursoNoEncontrado() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of());

		assertThatThrownBy(() -> service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1))))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Set no encontrado: " + set.getId());

		verifyNoInteractions(equipoRepo);
		verifyNoInteractions(gestorPartidoPort);
	}

	@Test
	void guardarAlineacionConSetDeOtroPartidoLanzaRecursoNoEncontrado() {
		Partido otroPartido = new Partido(UUID.randomUUID(), equipoLocal, equipoVisitante, new CantSets(5));
		SetPartido setDeOtroPartido = otroPartido.iniciarSet();
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(setDeOtroPartido));

		assertThatThrownBy(() -> service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1))))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Set no encontrado: " + set.getId());

		verifyNoInteractions(equipoRepo);
		verifyNoInteractions(gestorPartidoPort);
	}

	@Test
	void guardarAlineacionConEquipoInexistenteLanzaRecursoNoEncontrado() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1))))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Equipo no encontrado: " + equipoLocal.getId());

		verifyNoInteractions(jugadorRepo);
		verifyNoInteractions(gestorPartidoPort);
	}

	@Test
	void guardarAlineacionConJugadorInexistenteLanzaRecursoNoEncontrado() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));
		when(jugadorRepo.buscarPorId(jugador1.getId())).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.guardarAlineacion(partidoId, set.getId(), equipoLocal.getId(),
				List.of(new JugadorEnPosicion(jugador1.getId(), 1))))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Jugador no encontrado: " + jugador1.getId());

		verifyNoInteractions(gestorPartidoPort);
		verify(setRepo, never()).guardar(any(), any());
	}

	// ── seleccionarSaqueInicial ──

	@Test
	void seleccionarSaqueInicialDelegaEnElGestorYPersisteElSet() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(equipoRepo.buscarPorId(equipoLocal.getId())).thenReturn(Optional.of(equipoLocal));

		service.seleccionarSaqueInicial(partidoId, set.getId(), equipoLocal.getId());

		verify(gestorPartidoPort).seleccionarEquipoSaqueInicial(equipoLocal, set);
		verify(setRepo).guardar(set, partidoId);
	}

	@Test
	void seleccionarSaqueInicialConSetInexistenteLanzaRecursoNoEncontrado() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of());

		assertThatThrownBy(() -> service.seleccionarSaqueInicial(partidoId, set.getId(), equipoLocal.getId()))
				.isInstanceOf(RecursoNoEncontradoException.class)
				.hasMessage("Set no encontrado: " + set.getId());

		verifyNoInteractions(gestorPartidoPort);
	}

	// ── confirmarInicio ──

	@Test
	void confirmarInicioExitosoNoLanzaYDelegaUnaVezEnElGestor() {
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(gestorPartidoPort.confirmarInicioPartido(partido, set))
				.thenReturn(ConfirmacionDTO.ok("Partido iniciado correctamente"));

		assertThatCode(() -> service.confirmarInicio(partidoId, set.getId()))
				.doesNotThrowAnyException();

		verify(gestorPartidoPort, times(1)).confirmarInicioPartido(partido, set);
	}

	@Test
	void confirmarInicioConErrorDelGestorLanzaReglaDeNegocioConElMismoMensaje() {
		String mensaje = "Error al iniciar el partido: ya iniciado";
		when(partidoRepo.buscarPorId(partidoId)).thenReturn(Optional.of(partido));
		when(setRepo.buscarPorPartido(partidoId)).thenReturn(List.of(set));
		when(gestorPartidoPort.confirmarInicioPartido(partido, set))
				.thenReturn(ConfirmacionDTO.error(mensaje));

		assertThatThrownBy(() -> service.confirmarInicio(partidoId, set.getId()))
				.isInstanceOf(ReglaDeNegocioException.class)
				.hasMessage(mensaje);

		verify(partidoRepo, never()).guardar(any());
	}
}
