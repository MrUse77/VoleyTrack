package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SetController.class)
class SetControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private GestorPartidoPort gestorPartidoPort;

	@Test
	void opcionesPuntoDevuelveEquipoYJugadores() throws Exception {
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();
		UUID jugadorId = UUID.randomUUID();
		OpcionesPuntoDTO dto = new OpcionesPuntoDTO(
				equipoId,
				"Club A",
				List.of(new OpcionesPuntoDTO.JugadorOpcionDTO(jugadorId, "Jugador", "Uno", 1, true)));
		when(gestorPartidoPort.cargarOpcionesPunto(setId, equipoId)).thenReturn(dto);

		mockMvc.perform(get("/api/sets/{setId}/equipos/{equipoId}/opciones-punto", setId, equipoId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.equipoId").value(equipoId.toString()))
				.andExpect(jsonPath("$.jugadores[0].id").value(jugadorId.toString()))
				.andExpect(jsonPath("$.jugadores[0].nombre").value("Jugador"));
	}

	@Test
	void opcionesPuntoConRecursoInexistenteDevuelve404() throws Exception {
		UUID setId = UUID.randomUUID();
		UUID equipoId = UUID.randomUUID();
		when(gestorPartidoPort.cargarOpcionesPunto(setId, equipoId))
				.thenThrow(new RecursoNoEncontradoException("Set no encontrado: " + setId));

		mockMvc.perform(get("/api/sets/{setId}/equipos/{equipoId}/opciones-punto", setId, equipoId))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.mensaje").value("Set no encontrado: " + setId));
	}
}
