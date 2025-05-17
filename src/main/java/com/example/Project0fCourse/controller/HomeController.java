package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.TeamMember;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Arrays;
import java.util.List;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index(Model model) {
        List<TeamMember> teamMembers = Arrays.asList(
            new TeamMember("Võ Đức Chính - 99562", false, ""),
            new TeamMember("Hoàng Văn Chuẩn -100618", true, "Nhóm trưởng"),
            new TeamMember("Trần Lê Hữu Quốc -100672", false, ""),
            new TeamMember("Nguyễn Đức Vũ -99550", false, "")
        );
        
        model.addAttribute("teamMembers", teamMembers);
        model.addAttribute("teamName", "404 Brain Not Found");
        model.addAttribute("currentYear", java.time.Year.now().getValue());
        
        return "index";
    }
}
