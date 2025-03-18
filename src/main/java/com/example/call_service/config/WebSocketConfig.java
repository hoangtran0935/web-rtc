package com.example.call_service.config;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketConfig {

    private final int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

    @Bean
    public SocketIOServer socketIOServer() throws Exception {
        com.corundumstudio.socketio.Configuration config =
                new com.corundumstudio.socketio.Configuration();

        config.setHostname("0.0.0.0"); // Lắng nghe trên tất cả các IP
        config.setPort(port);
        config.setTransports(Transport.WEBSOCKET, Transport.POLLING); // Hỗ trợ WebSocket & Polling

        return new SocketIOServer(config);
    }
}
