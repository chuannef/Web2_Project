package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.User;
import com.example.Project0fCourse.repository.UserRepository;

import org.springframework.stereotype.Controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
public class UserController {
    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Hiển thị danh sách người dùng (GET /)
    @GetMapping("/")
    public String getUsersController(Model model) {
        List<User> users = repository.findAll();
        model.addAttribute("users", users);

        return "user"; // user.html
    }

    // Hiển thị form thêm người dùng (GET /add)
    @GetMapping("/add")
    public String addUser(Model model) {
        model.addAttribute("user", new User());
        /* Example form.html
         *<form th:action="@{/save}" th:object="${user}" method="post">
         *    <div>
         *        <label for="id">ID:</label>
         *        <input type="text" id="id" th:field="*{id}" />
         *    </div>
         *    <div>
         *        <label for="name">Name:</label>
         *        <input type="text" id="name" th:field="*{name}" />
         *    </div>
         *    <div>
         *        <label for="email">Email:</label>
         *        <input type="email" id="email" th:field="*{email}" />
         *    </div>
         *    <div>
         *        <button type="submit">Save User</button>
         *    </div>
         *</form>
         */
        return "form";
    }

    @PostMapping("/save")
    public String saveUser(@ModelAttribute("user") User user) {
        if (user.getId() == null || user.getId().isEmpty()) {
            user.setId(UUID.randomUUID().toString());
        }
        repository.save(user);
        return "redirect:/";
    }
}

