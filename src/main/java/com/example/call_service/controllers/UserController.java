package com.example.call_service.controllers;

import com.example.call_service.model.User;
import com.example.call_service.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/join")
    public ResponseEntity<User> joinRoom(@RequestParam UUID roomId, @RequestParam String username) {
        return ResponseEntity.ok(userService.joinRoom(roomId, username));
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leaveRoom(@PathVariable UUID id) {
        userService.leaveRoom(id);
        return ResponseEntity.ok().build();
    }
}
