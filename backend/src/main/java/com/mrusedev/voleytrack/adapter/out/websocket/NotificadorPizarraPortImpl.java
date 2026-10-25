package com.mrusedev.voleytrack.adapter.out.websocket;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import com.mrusedev.voleytrack.adapter.websocket.PizarraJson;
import com.mrusedev.voleytrack.application.dto.out.CambioPizarraDTO;
import com.mrusedev.voleytrack.application.port.out.NotificadorPizarraPort;
import java.util.UUID;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Component
public class NotificadorPizarraPortImpl implements NotificadorPizarraPort {

    private final PartidoSessionRegistry registry;
    private final PizarraJson pizarraJson;

    public NotificadorPizarraPortImpl(PartidoSessionRegistry registry, PizarraJson pizarraJson) {
        this.registry = registry;
        this.pizarraJson = pizarraJson;
    }

    @Override
    public void notificarCambioPizarra(UUID partidoId, CambioPizarraDTO cambio) {
        pizarraJson.aJson(cambio).ifPresent(payload -> publicarDespuesDelCommit(partidoId, payload));
    }

    private void publicarDespuesDelCommit(UUID partidoId, String payload) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            registry.enviar(partidoId, payload);
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        registry.enviar(partidoId, payload);
                    }
                });
    }
}
