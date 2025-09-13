package com.example.Project0fCourse.api;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Project0fCourse.model.User;
import com.example.Project0fCourse.model.Role;
import com.example.Project0fCourse.model.AuthRequest;
import com.example.Project0fCourse.model.AuthResponse;
import com.example.Project0fCourse.repository.UserRepository;
import com.example.Project0fCourse.sercurity.JwtService;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api")
public class UserRestPoint {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserModelAssembler assembler;
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;

    UserRestPoint(UserRepository userRepository, PasswordEncoder passwordEncoder, UserModelAssembler assembler) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.assembler = assembler;
    }

    @GetMapping("/users/{id}")
    EntityModel<User> one(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        return assembler.toModel(user);
    }

    @GetMapping("/users")
    CollectionModel<EntityModel<User>> all() { // encapsulate collections of user resources
        List<EntityModel<User>> users = userRepository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(users, linkTo(methodOn(UserRestPoint.class).all()).withSelfRel());
    }

    @PostMapping("/users")
    User newUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(newUser.getEmail());
            user.setUsername(newUser.getUsername());
            user.setRoles(newUser.getRoles());
            user.setCompany(newUser.getCompany());
            user.setPassword(passwordEncoder.encode(newUser.getPassword()));
            return userRepository.save(user);
        }).orElseGet(() -> {
            newUser.setId(id);
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            return userRepository.save(newUser);
        });
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    // Authentication endpoints
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        try {
            // Check if user already exists
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new AuthResponse(null, "Username already exists"));
            }

            // Set default role as USER if no roles are specified
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                user.setRoles(Set.of(Role.USER));
            }

            // Encode password and save user
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new AuthResponse(null, "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/generateToken")
    public ResponseEntity<AuthResponse> generateToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(authRequest.getUsername());
                return ResponseEntity.ok(new AuthResponse(token, "Token generated successfully"));
            } else {
                throw new UsernameNotFoundException("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Authentication failed: " + e.getMessage()));
        }
    }

}
