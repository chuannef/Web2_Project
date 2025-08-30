package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.service.CompanyService;
import com.example.Project0fCourse.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final CompanyService companyService;

    public AdminController(UserService userService, CompanyService companyService) {
        this.userService = userService;
        this.companyService = companyService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public String adminDashboard() {
        // model.addAttribute("totalUsers", userService.getAllUsers().size());
        // model.addAttribute("totalCompanies", companyService.getAllCompanies().size());
        // model.addAttribute("users", userService.getAllUsers());
        // model.addAttribute("companies", companyService.getAllCompanies());
        return "admin";
    }
}
