package com.example.call_service.services;

import com.example.call_service.model.Room;
import com.example.call_service.model.User;
import com.example.call_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.example.call_service.repository.RoomRepository;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public UserService(UserRepository userRepository, RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    public User joinRoom(UUID roomId, String username) {
        Optional<Room> room = roomRepository.findById(roomId);
        if (room.isEmpty()) {
            throw new RuntimeException("Room not found");
        }
        User user = new User();
        user.setUsername(username);
        user.setRoom(room.get());
        return userRepository.save(user);
    }

    public void leaveRoom(UUID userId) {
        userRepository.deleteById(userId);
    }
}
