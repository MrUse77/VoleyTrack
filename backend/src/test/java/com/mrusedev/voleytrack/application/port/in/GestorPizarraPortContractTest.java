package com.mrusedev.voleytrack.application.port.in;

import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.gestor.GestorPizarra;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GestorPizarraPortContractTest {

    @Test
    void obtenerPizarraUsaContratoDeAplicacion() throws Exception {
        Method method = GestorPizarraPort.class.getMethod("obtenerPizarra", UUID.class);

        assertThat(method.getReturnType()).isEqualTo(PizarraEnVivoDTO.class);
        assertThat(method.getGenericParameterTypes()[0].getTypeName()).isEqualTo("java.util.UUID");
    }

    @Test
    void niElPuertoNiSuImplementacionExponenTiposDeDominio() {
        Arrays.stream(GestorPizarraPort.class.getDeclaredMethods())
                .flatMap(method -> Arrays.stream(method.getGenericParameterTypes()))
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPizarraPort.class.getDeclaredMethods())
                .map(Method::getGenericReturnType)
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPizarra.class.getDeclaredMethods())
                .filter(method -> Modifier.isPublic(method.getModifiers()))
                .flatMap(method -> Arrays.stream(method.getGenericParameterTypes()))
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
        Arrays.stream(GestorPizarra.class.getDeclaredMethods())
                .filter(method -> Modifier.isPublic(method.getModifiers()))
                .map(Method::getGenericReturnType)
                .map(type -> type.getTypeName())
                .forEach(type -> assertThat(type).doesNotContain("com.mrusedev.voleytrack.domain"));
    }
}
