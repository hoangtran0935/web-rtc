package com.example.call_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.call_service.model.Room;

import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    void deleteById(UUID id);
}