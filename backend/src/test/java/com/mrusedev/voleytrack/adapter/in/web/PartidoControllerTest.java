package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
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

@WebMvcTest(PartidoController.class)
class PartidoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private GestorPartidoPort gestorPartidoPort;

	@Test
	void inicioDevuelveDatosDelPartido() throws Exception {
		UUID partidoId = UUID.randomUUID();
		when(gestorPartidoPort.cargarDatosInicio(partidoId))
				.thenReturn(new DatosInicioPartidoDTO(partidoId, "Club A", "Club B", 5, 3, "PROGRAMADO"));

		mockMvc.perform(get("/api/partidos/{partidoId}/inicio", partidoId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.partidoId").value(partidoId.toString()));
	}

	@Test
	void inicioInexistenteDevuelve404ConMensaje() throws Exception {
		UUID partidoId = UUID.randomUUID();
		when(gestorPartidoPort.cargarDatosInicio(partidoId))
				.thenThrow(new RecursoNoEncontradoException("Partido no encontrado: " + partidoId));

		mockMvc.perform(get("/api/partidos/{partidoId}/inicio", partidoId))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.error").value("Not Found"))
				.andExpect(jsonPath("$.mensaje").value("Partido no encontrado: " + partidoId));
	}

	@Test
	void pizarraDevuelveEstadoEnVivo() throws Exception {
		UUID partidoId = UUID.randomUUID();
		UUID localId = UUID.randomUUID();
		UUID visitanteId = UUID.randomUUID();
		PizarraEnVivoDTO pizarra = new PizarraEnVivoDTO(
				new PizarraEnVivoDTO.EquipoPizarraDTO(localId, "Club A"),
				new PizarraEnVivoDTO.EquipoPizarraDTO(visitanteId, "Club B"),
				1,
				0,
				new PizarraEnVivoDTO.SetActualDTO(2, false, 25, 2, 2),
				visitanteId,
				"EN_CURSO",
				"EN_CURSO",
				List.of(new PizarraEnVivoDTO.EventoPizarraDTO(
						UUID.randomUUID(), "Jugador Local", "ATAQUE")));
		when(gestorPartidoPort.obtenerPizarra(partidoId)).thenReturn(pizarra);

		mockMvc.perform(get("/api/partidos/{partidoId}/pizarra", partidoId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.equipoLocal.nombre").value("Club A"))
				.andExpect(jsonPath("$.setsLocal").value(1))
				.andExpect(jsonPath("$.setActual.numeroSet").value(2))
				.andExpect(jsonPath("$.setActual.limitePuntos").value(25))
				.andExpect(jsonPath("$.equipoSaqueId").value(visitanteId.toString()))
				.andExpect(jsonPath("$.estadoPartido").value("EN_CURSO"))
				.andExpect(jsonPath("$.ultimosEventos[0].tipoFundamento").value("ATAQUE"));
	}

	@Test
	void pizarraConReglaDeNegocioDevuelve409() throws Exception {
		UUID partidoId = UUID.randomUUID();
		when(gestorPartidoPort.obtenerPizarra(partidoId))
				.thenThrow(new ReglaDeNegocioException("Regla de negocio violada"));

		mockMvc.perform(get("/api/partidos/{partidoId}/pizarra", partidoId))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.error").value("Conflict"));
	}
}
