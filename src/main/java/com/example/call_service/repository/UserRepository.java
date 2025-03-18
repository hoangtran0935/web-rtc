package com.example.call_service.repository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.call_service.model.User;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {}