package com.mrusedev.voleytrack.adapter.out.websocket;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import com.mrusedev.voleytrack.application.dto.out.PizarraEnVivoDTO;
import com.mrusedev.voleytrack.application.dto.out.PuntoRegistradoDTO;
import com.mrusedev.voleytrack.application.port.out.NotificadorPizarraPort;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.support.TransactionTemplate;

@SpringBootTest
@ActiveProfiles("test")
class NotificadorPizarraPortImplTransaccionalTest {

    @Autowired private TransactionTemplate transactionTemplate;
    @Autowired private NotificadorPizarraPort notificador;
    @MockitoBean private PartidoSessionRegistry registry;

    private static CambioPizarraDTO unCambio() {
        UUID local = UUID.randomUUID();
        UUID jugador = UUID.randomUUID();
        PizarraEnVivoDTO pizarra =
                new PizarraEnVivoDTO(
                        new PizarraEnVivoDTO.EquipoPizarraDTO(local, "Local FC"),
                        new PizarraEnVivoDTO.EquipoPizarraDTO(UUID.randomUUID(), "Visitante FC"),
                        0,
                        0,
                        new PizarraEnVivoDTO.SetActualDTO(1, false, 25, 1, 0),
                        local,
                        "EN_JUEGO",
                        "EN_JUEGO",
                        List.of(new PizarraEnVivoDTO.EventoPizarraDTO(jugador, "Perez", "ATAQUE")));
        return new CambioPizarraDTO(
                "PUNTO_REGISTRADO",
                new PuntoRegistradoDTO(local, jugador, "Perez", "Juan", "ATAQUE", 1),
                pizarra);
    }

    @Test
    void noPublicaDentroDeLaTransaccionSinoDespuesDelCommit() {
        UUID partidoId = UUID.randomUUID();

        transactionTemplate.executeWithoutResult(
                estado -> {
                    notificador.notificarCambioPizarra(partidoId, unCambio());
                    verifyNoInteractions(registry);
                });

        verify(registry).enviar(eq(partidoId), anyString());
    }

    @Test
    void siLaTransaccionHaceRollbackNoPublicaNada() {
        UUID partidoId = UUID.randomUUID();

        assertThatThrownBy(
                        () ->
                                transactionTemplate.executeWithoutResult(
                                        estado -> {
                                            notificador.notificarCambioPizarra(
                                                    partidoId, unCambio());
                                            throw new IllegalStateException(
                                                    "falla simulada antes del commit");
                                        }))
                .isInstanceOf(IllegalStateException.class);

        verifyNoInteractions(registry);
    }
}
