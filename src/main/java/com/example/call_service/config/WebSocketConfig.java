package com.example.call_service.config;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketConfig {

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config =
                new com.corundumstudio.socketio.Configuration();

        // Lấy cổng từ biến môi trường (mặc định 8080)
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        config.setHostname("0.0.0.0");
        config.setPort(port);
        config.setTransports(Transport.WEBSOCKET, Transport.POLLING);

        // ✅ Hỗ trợ CORS khi dùng Nginx làm proxy
        config.setOrigin("*"); // Hoặc chỉ định domain cụ thể
        config.setAllowHeaders("*");
        config.setAuthorizationListener(data -> true); // Tùy chỉnh nếu có token

        return new SocketIOServer(config);
    }
}
