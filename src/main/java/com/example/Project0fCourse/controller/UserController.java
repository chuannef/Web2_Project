package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.User;
import com.example.Project0fCourse.repository.UserRepository;

import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.UUID;

@Controller
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Hiển thị danh sách người dùng (GET /users)
    @GetMapping("/users")
    public String getUsersController(Model model) {
        List<User> users = repository.findAll();
        model.addAttribute("users", users);

        return "index"; // index.html
    }

    // Hiển thị form thêm người dùng (GET /add)
    @GetMapping("/add")
    public String addUser(Model model) {
        model.addAttribute("user", new User());
        return "add_user";
    }

    @PostMapping("/save")
    public String saveUser(@ModelAttribute("user") User user) {
        // ID là kiểu Long nên chỉ cần kiểm tra null
        if (user.getId() == null) {
            // Không set ID, để JPA tự động tạo
            // Database sẽ tự động tạo ID theo chiến lược GenerationType.IDENTITY
        }
        repository.save(user);
        return "redirect:/users";
    }
}

