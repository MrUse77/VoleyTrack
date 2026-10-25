package com.mrusedev.voleytrack.adapter.in.websocket;

import com.mrusedev.voleytrack.adapter.websocket.PartidoSessionRegistry;
import com.mrusedev.voleytrack.adapter.websocket.PizarraBienvenida;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.Optional;
import java.util.UUID;


@Component
public class PartidoWebSocketHandler extends TextWebSocketHandler {
	private static final Logger log = LoggerFactory.getLogger(PartidoWebSocketHandler.class);
	private final  PartidoSessionRegistry registry;
	private final PizarraBienvenida bienvenida;

	public PartidoWebSocketHandler(PartidoSessionRegistry registry, PizarraBienvenida bienvenida) {
		this.registry = registry;
		this.bienvenida = bienvenida;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession sesion) throws Exception {
		Optional<UUID> partidoId = partidoIdDe(sesion);
		if (partidoId.isEmpty()) {
			sesion.close(CloseStatus.BAD_DATA);
			return;
		}
		if(!bienvenida.enviarEstadoInicial(partidoId.get(), sesion)) {
			sesion.close(CloseStatus.BAD_DATA);
			return;
		}
		registry.registrar(partidoId.get(), sesion);
	}

	@Override
	public void handleTransportError(WebSocketSession sesion, Throwable error) throws Exception {
		log.warn("Error de transporte en la pizarra, sesión {}: {}", sesion.getId(), error.getMessage());
		partidoIdDe(sesion).ifPresent(id -> registry.desregistrar(id, sesion));
		if (sesion.isOpen()) {
			sesion.close(CloseStatus.SERVER_ERROR);
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession sesion, CloseStatus status) throws Exception {
		partidoIdDe(sesion).ifPresent(id -> registry.desregistrar(id, sesion));
	}
	private Optional<UUID> partidoIdDe(WebSocketSession session){
		URI uri = session.getUri();
		if(uri == null || uri.getPath().isEmpty() ) return Optional.empty();
		String path = uri.getPath();
		String ult = path.substring(path.lastIndexOf('/')+1);
		try{
			return Optional.of(UUID.fromString(ult));
		}catch (IllegalArgumentException e) {
			return Optional.empty();
		}
	}
}
