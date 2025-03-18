package com.example.call_service.controllers;


import com.example.call_service.model.Room;
import com.example.call_service.services.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestParam String name) {
        return ResponseEntity.ok(roomService.createRoom(name));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }
}
