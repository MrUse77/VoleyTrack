package com.mrusedev.voleytrack.adapter.in.web;

import com.mrusedev.voleytrack.application.exception.RecursoNoEncontradoException;
import com.mrusedev.voleytrack.application.exception.ReglaDeNegocioException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(RecursoNoEncontradoException.class)
  public ResponseEntity<ApiError> handleRecursoNoEncontrado(RecursoNoEncontradoException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(new ApiError(404, "Not Found", ex.getMessage()));
  }

  @ExceptionHandler(ReglaDeNegocioException.class)
  public ResponseEntity<ApiError> handleReglaDeNegocio(ReglaDeNegocioException ex) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
        .body(new ApiError(409, "Conflict", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiError> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiError(400, "Bad Request", ex.getMessage()));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ApiError(400, "Bad Request", ex.getMessage()));
  }
}
