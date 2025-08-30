package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.User;
import com.example.Project0fCourse.repository.UserRepository;
import com.example.Project0fCourse.service.UserService;

import org.springframework.stereotype.Controller;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class UserController {
    private final UserRepository repository;
    private final UserService userService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserController(UserRepository repository, UserService userService, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // Hiển thị danh sách người dùng (GET /users)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public String getUsersController(Model model) {
        List<User> users = repository.findAll();
        model.addAttribute("users", users);

        return "index"; // index.html
    }

    // Hiển thị form thêm người dùng (GET /add)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/add")
    public String addUser(Model model) {
        model.addAttribute("user", new User());
        return "add_user";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/edit/{id}")
    public String editUser(@PathVariable Long id, Model model) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
        model.addAttribute(user);
        return "edit_user";
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update/{id}")
    public String updateUser(@PathVariable Long id, @ModelAttribute User user) {
        userService.update(id, user);
        return "redirect:/users";
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public String removeUser(@PathVariable Long id) {
        userService.deleteById(id);
        return "redirect:/users";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/save")
public String saveUser(@ModelAttribute("user") User user) {
    if (user.getId() == null) {
        // JPA sẽ tự tạo ID
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            java.util.HashSet<com.example.Project0fCourse.model.Role> defaultRoles = new java.util.HashSet<>();
            defaultRoles.add(com.example.Project0fCourse.model.Role.USER);
            user.setRoles(defaultRoles);
        }
        repository.save(user);
        org.springframework.ui.ModelMap model = new org.springframework.ui.ModelMap();
        model.addAttribute("success", "Đăng ký thành công!");
        model.addAttribute("user", new com.example.Project0fCourse.model.User());
        return "add_user";
    } else {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repository.save(user);
        return "redirect:/users";
    }
}


    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }
}
