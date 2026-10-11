package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.port.in.GestorPartidoPort;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EquipoController.class)
class EquipoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private GestorPartidoPort gestorPartidoPort;

	@Test
	void jugadoresDisponiblesDevuelve200ConLaLista() throws Exception {
		UUID equipoId = UUID.randomUUID();
		UUID jugadorId = UUID.randomUUID();
		when(gestorPartidoPort.cargarJugadoresDisponibles(equipoId))
				.thenReturn(List.of(new JugadorDTO(jugadorId, "Ana", "Uno", "2000-01-01", 7, "LIBERO", true)));

		mockMvc.perform(get("/api/equipos/{equipoId}/jugadores", equipoId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(jugadorId.toString()))
				.andExpect(jsonPath("$[0].nombre").value("Ana"))
				.andExpect(jsonPath("$[0].apellido").value("Uno"))
				.andExpect(jsonPath("$[0].fechaNacimiento").value("2000-01-01"))
				.andExpect(jsonPath("$[0].dorsal").value(7))
				.andExpect(jsonPath("$[0].posicion").value("LIBERO"))
				.andExpect(jsonPath("$[0].activo").value(true));

		verify(gestorPartidoPort).cargarJugadoresDisponibles(equipoId);
	}

	@Test
	void jugadoresDeEquipoInexistenteDevuelve404ConMensaje() throws Exception {
		UUID equipoId = UUID.randomUUID();
		when(gestorPartidoPort.cargarJugadoresDisponibles(equipoId))
				.thenThrow(new RecursoNoEncontradoException("Equipo no encontrado: " + equipoId));

		mockMvc.perform(get("/api/equipos/{equipoId}/jugadores", equipoId))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.error").value("Not Found"))
				.andExpect(jsonPath("$.mensaje").value("Equipo no encontrado: " + equipoId));
	}
}
