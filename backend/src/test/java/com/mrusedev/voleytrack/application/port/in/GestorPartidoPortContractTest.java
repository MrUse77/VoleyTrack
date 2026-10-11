package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.AlineacionPreviewDTO;
import com.mrusedev.voleytrack.application.dto.ConfirmacionDTO;
import com.mrusedev.voleytrack.application.dto.EquiposDTO;
import com.mrusedev.voleytrack.application.dto.InicioSetDTO;
import com.mrusedev.voleytrack.application.dto.JugadorDTO;
import com.mrusedev.voleytrack.application.dto.OpcionesPuntoDTO;
import com.mrusedev.voleytrack.application.dto.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.gestor.GestorPartidoImpl;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class GestorPartidoPortContractTest {

    @Test
    void publicMethodsUseApplicationContractTypesOnly() {
        assertSignature("cargarDatosInicio", com.mrusedev.voleytrack.application.dto.DatosInicioPartidoDTO.class,
                UUID.class);
        assertSignature("obtenerPizarra", PizarraEnVivoDTO.class, UUID.class);
        assertSignature("crearSet", InicioSetDTO.class, UUID.class);
        assertSignature("crearAlineacion", AlineacionPreviewDTO.class, UUID.class, UUID.class);
        Method guardarAlineacion = method("guardarAlineacion",
                UUID.class, UUID.class, UUID.class, List.class);
        assertThat(guardarAlineacion.getReturnType()).isEqualTo(AlineacionPreviewDTO.class);
        assertThat(guardarAlineacion.getGenericParameterTypes()[3].getTypeName())
                .isEqualTo("java.util.List<com.mrusedev.voleytrack.application.dto.JugadorEnPosicion>");
        Method jugadoresDisponibles = method("cargarJugadoresDisponibles", UUID.class);
        assertThat(jugadoresDisponibles.getReturnType()).isEqualTo(List.class);
        assertThat(jugadoresDisponibles.getGenericReturnType().getTypeName())
                .isEqualTo("java.util.List<com.mrusedev.voleytrack.application.dto.JugadorDTO>");
        assertSignature("agregarJugadorAAlineacion", AlineacionPreviewDTO.class,
                UUID.class, UUID.class, UUID.class, int.class);
        assertSignature("seleccionarEquipoSaqueInicial", void.class, UUID.class, UUID.class);
        assertSignature("confirmarInicioPartido", ConfirmacionDTO.class, UUID.class, UUID.class);
        assertSignature("iniciarAnotacion", EquiposDTO.class, UUID.class);
        assertSignature("cargarOpcionesPunto", OpcionesPuntoDTO.class, UUID.class, UUID.class);
        assertSignature("confirmarPunto", ConfirmacionDTO.class,
                UUID.class, UUID.class, UUID.class, String.class);

        Arrays.stream(GestorPartidoPort.class.getDeclaredMethods())
                .flatMap(method -> Arrays.stream(method.getGenericParameterTypes()))
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPartidoPort.class.getDeclaredMethods())
                .map(Method::getGenericReturnType)
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPartidoImpl.class.getDeclaredMethods())
                .filter(method -> Modifier.isPublic(method.getModifiers()))
                .flatMap(method -> Arrays.stream(method.getGenericParameterTypes()))
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPartidoImpl.class.getDeclaredMethods())
                .filter(method -> Modifier.isPublic(method.getModifiers()))
                .map(Method::getGenericReturnType)
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
    }

    private static void assertSignature(String name, Class<?> returnType, Class<?>... parameterTypes) {
        Method method = method(name, parameterTypes);
        assertThat(method.getReturnType()).isEqualTo(returnType);
    }

    private static Method method(String name, Class<?>... parameterTypes) {
        try {
            return GestorPartidoPort.class.getMethod(name, parameterTypes);
        } catch (NoSuchMethodException e) {
            throw new AssertionError("Missing method: " + name, e);
        }
    }
}
