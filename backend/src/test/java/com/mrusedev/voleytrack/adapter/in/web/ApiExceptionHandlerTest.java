package com.mrusedev.voleytrack.adapter.in.web;

import static org.assertj.core.api.Assertions.assertThat;

import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

class ApiExceptionHandlerTest {

	private final ApiExceptionHandler handler = new ApiExceptionHandler();

	@Test
	void recursoNoEncontradoDevuelveNotFoundConMensaje() {
		ResponseEntity<ApiError> response = handler.handleRecursoNoEncontrado(
				new RecursoNoEncontradoException("Partido no encontrado: 1"));

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
		assertThat(response.getBody()).isEqualTo(new ApiError(404, "Not Found", "Partido no encontrado: 1"));
	}

	@Test
	void reglaDeNegocioDevuelveConflictConMensaje() {
		ResponseEntity<ApiError> response = handler.handleReglaDeNegocio(
				new ReglaDeNegocioException("Regla de negocio violada"));

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
		assertThat(response.getBody()).isEqualTo(new ApiError(409, "Conflict", "Regla de negocio violada"));
	}

	@Test
	void argumentoInvalidoDevuelveBadRequestConMensaje() {
		ResponseEntity<ApiError> response = handler.handleIllegalArgument(
				new IllegalArgumentException("dato inválido"));

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).isEqualTo(new ApiError(400, "Bad Request", "dato inválido"));
	}

	@Test
	void cuerpoInvalidoDevuelveBadRequest() throws NoSuchMethodException {
		MethodArgumentNotValidException ex = new MethodArgumentNotValidException(
				new MethodParameter(String.class.getDeclaredMethod("substring", int.class), 0),
				new BeanPropertyBindingResult(new Object(), "objeto"));

		ResponseEntity<ApiError> response = handler.handleMethodArgumentNotValid(ex);

		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
		assertThat(response.getBody()).isNotNull();
		assertThat(response.getBody().status()).isEqualTo(400);
		assertThat(response.getBody().error()).isEqualTo("Bad Request");
		assertThat(response.getBody().mensaje()).isNotNull();
	}
}
