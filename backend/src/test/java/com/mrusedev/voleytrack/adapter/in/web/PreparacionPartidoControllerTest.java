package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorEnPosicion;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PreparacionPartidoController.class)
class PreparacionPartidoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private GestorPartidoPort gestorPartidoPort;

	@Test
	void crearSetDevuelve201ConElSetCreado() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();
		when(gestorPartidoPort.crearSet(partidoId))
				.thenReturn(new InicioSetDTO(setId, 1, false, 25));

		mockMvc.perform(post("/api/partidos/{partidoId}/sets", partidoId))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.setId").value(setId.toString()))
				.andExpect(jsonPath("$.numeroSet").value(1))
				.andExpect(jsonPath("$.limitePuntos").value(25));

		verify(gestorPartidoPort).crearSet(partidoId);
	}

	@Test
	void guardarAlineacionDevuelve200ConElPreview() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();
		UUID jugadorId = UUID.randomUUID();
		AlineacionPreviewDTO preview = new AlineacionPreviewDTO(equipoId, "Club Local", List.of(
				new AlineacionPreviewDTO.JugadorEnPosicionDTO(jugadorId, "Ana", "Uno", 1, 1, true)));
		when(gestorPartidoPort.guardarAlineacion(eq(partidoId), eq(setId), eq(equipoId), anyList()))
				.thenReturn(preview);

		String body = "[{\"jugadorId\":\"" + jugadorId + "\",\"posicion\":1}]";

		mockMvc.perform(put("/api/partidos/{partidoId}/sets/{setId}/alineacion", partidoId, setId)
						.param("equipoId", equipoId.toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.equipoId").value(equipoId.toString()))
				.andExpect(jsonPath("$.equipoNombre").value("Club Local"))
				.andExpect(jsonPath("$.jugadores[0].jugadorId").value(jugadorId.toString()))
				.andExpect(jsonPath("$.jugadores[0].posicion").value(1));

		verify(gestorPartidoPort).guardarAlineacion(
				eq(partidoId), eq(setId), eq(equipoId),
				eq(List.of(new JugadorEnPosicion(jugadorId, 1))));
	}

	@Test
	void seleccionarSaqueInicialDevuelve204YDelegaEnElPuerto() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();

		mockMvc.perform(post("/api/partidos/{partidoId}/sets/{setId}/saque-inicial", partidoId, setId)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"equipoId\":\"" + equipoId + "\"}"))
				.andExpect(status().isNoContent());

		verify(gestorPartidoPort).seleccionarEquipoSaqueInicial(setId, equipoId);
	}

	@Test
	void confirmarInicioDevuelve204() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();

		mockMvc.perform(post("/api/partidos/{partidoId}/inicio", partidoId)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"setId\":\"" + setId + "\"}"))
				.andExpect(status().isNoContent());

		verify(gestorPartidoPort).confirmarInicioPartido(partidoId, setId);
	}

	@Test
	void confirmarInicioConReglaDeNegocioDevuelve409() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();
		doThrow(new ReglaDeNegocioException("Error al iniciar el partido: x"))
				.when(gestorPartidoPort).confirmarInicioPartido(partidoId, setId);

		mockMvc.perform(post("/api/partidos/{partidoId}/inicio", partidoId)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"setId\":\"" + setId + "\"}"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.error").value("Conflict"))
				.andExpect(jsonPath("$.mensaje").value("Error al iniciar el partido: x"));
	}

	@Test
	void crearSetConPartidoInexistenteDevuelve404ConMensaje() throws Exception {
		UUID partidoId = UUID.randomUUID();
		when(gestorPartidoPort.crearSet(partidoId))
				.thenThrow(new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));

		mockMvc.perform(post("/api/partidos/{partidoId}/sets", partidoId))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.error").value("Not Found"))
				.andExpect(jsonPath("$.mensaje").value("Partido no encontrado: " + partidoId));
	}

	@Test
	void guardarAlineacionConRecursoInexistenteDevuelve404ConMensaje() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();
		when(gestorPartidoPort.guardarAlineacion(eq(partidoId), eq(setId), eq(equipoId), anyList()))
				.thenThrow(new RecursoNoEncontradoException("Set no encontrado: " + setId));

		mockMvc.perform(put("/api/partidos/{partidoId}/sets/{setId}/alineacion", partidoId, setId)
						.param("equipoId", equipoId.toString())
						.contentType(MediaType.APPLICATION_JSON)
						.content("[]"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.mensaje").value("Set no encontrado: " + setId));
	}
}
