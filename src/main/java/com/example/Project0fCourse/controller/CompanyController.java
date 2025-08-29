package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.Company;
import com.example.Project0fCourse.model.User;
import com.example.Project0fCourse.service.CompanyService;
import com.example.Project0fCourse.service.UserService;

import java.util.ArrayList;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;
    private final UserService userService;

    public CompanyController(CompanyService companyService, UserService userService) {
        this.companyService = companyService;
        this.userService = userService;
    }

    @GetMapping
    public String listCompanies(Model model) {
        model.addAttribute("companies", companyService.getAllCompanies());
        return "company_list"; // Thymeleaf page
                               //
    }

    @GetMapping("/add")
    public String addCompanyForm(Model model) {
        Company company = new Company();
        company.setEmployees(new ArrayList<>());
        model.addAttribute("company", company);
        return "company_form";
    }

    @GetMapping("/edit/{id}")
    public String editCompany(@PathVariable Long id, Model model) {
        Company company = companyService.findById(id);
        if (company.getEmployees() == null) {
            company.setEmployees(new ArrayList<>());
        }
        model.addAttribute("company", company);
        return "company_form";
    }

    @GetMapping("/{id}/employees")
    public String manageEmployees(@PathVariable Long id, Model model) {
        Company company = companyService.findById(id);
        model.addAttribute("company", company);
        model.addAttribute("employees", company.getEmployees());
        // Always create a fresh new employee object
        model.addAttribute("newEmployee", new User());
        return "manage_employees";
    }

    @PostMapping("/{id}/employees/add")
    public String addEmployee(@PathVariable Long id, 
                             @RequestParam("name") String name,
                             @RequestParam("email") String email) {
        Company company = companyService.findById(id);
        
        // Create a new User object
        User newEmployee = new User();
        newEmployee.setUsername(name);
        newEmployee.setEmail(email);
        newEmployee.setCompany(company);
        
        userService.save(newEmployee);
        return "redirect:/companies/" + id + "/employees";
    }

    @PostMapping("/employees/{employeeId}/delete")
    public String deleteEmployee(@PathVariable Long employeeId, @RequestParam Long companyId) {
        userService.deleteById(employeeId);
        return "redirect:/companies/" + companyId + "/employees";
    }

    @PostMapping("/save")
    public String saveCompany(@ModelAttribute Company company) {
        // ensure relationship is set
        if (company.getEmployees() != null) {
            for (User user : company.getEmployees()) {
                user.setCompany(company);
            }
        }
        companyService.save(company);
        return "redirect:/companies";
    }

    @PostMapping("/delete/{id}")
    public String deleteCompany(@PathVariable Long id) {
        companyService.deleteById(id);
        return "redirect:/companies";
    }
}
