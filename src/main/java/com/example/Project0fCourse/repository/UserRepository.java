package com.example.Project0fCourse.repository;
import com.example.Project0fCourse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // @Query("SELECT u FROM User WHERE u.username = :username")
    // Optional<User> loadUserByUsername(@Param("username") String username);
    Optional<User> findByUsername(String username);
}
