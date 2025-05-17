package com.example.Project0fCourse.controller;

import com.example.Project0fCourse.model.TeamMember;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Controller
public class HomeController {

    private final List<TeamMember> teamMembers = Arrays.asList(
        new TeamMember(
            "vo-duc-chinh", 
            "Võ Đức Chính - 99562", 
            false, 
            "Developer", 
            "Chuyên gia front-end với niềm đam mê thiết kế UI/UX trực quan và thân thiện với người dùng.",
            "HTML, CSS, JavaScript, React", 
            "/images/9.jpg"
        ),
        new TeamMember(
            "hoang-van-chuan", 
            "Hoàng Văn Chuẩn -100618", 
            true, 
            "Nhóm trưởng", 
            "Nhóm trưởng với kinh nghiệm quản lý dự án và phối hợp làm việc nhóm hiệu quả.",
            "Java, Spring Boot, SQL, System Architecture", 
            "/images/x.jpg"
        ),
        new TeamMember(
            "tran-le-huu-quoc", 
            "Trần Lê Hữu Quốc -100672", 
            false, 
            "Backend Developer", 
            "Chuyên gia backend với khả năng xây dựng API và tối ưu hóa cơ sở dữ liệu.",
            "Java, Spring Boot, MySQL, MongoDB", 
            "/images/member3.jpg"
        ),
        new TeamMember(
            "nguyen-duc-vu", 
            "Nguyễn Đức Vũ -99550", 
            false, 
            "Full-stack Developer", 
            "Developer đa năng với kinh nghiệm trên nhiều công nghệ khác nhau.",
            "Java, JavaScript, React, Spring Boot", 
            "/images/member4.jpg"
        )
    );

    private final Map<String, TeamMember> teamMemberMap;

    public HomeController() {
        this.teamMemberMap = teamMembers.stream()
            .collect(Collectors.toMap(TeamMember::getId, Function.identity()));
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("teamMembers", teamMembers);
        model.addAttribute("teamName", "404 Brain Not Found");
        model.addAttribute("currentYear", java.time.Year.now().getValue());
        
        return "index";
    }

    @GetMapping("/member/{id}")
    public String memberDetail(@PathVariable String id, Model model) {
        TeamMember member = teamMemberMap.get(id);
        
        if (member == null) {
            return "redirect:/";
        }
        
        model.addAttribute("member", member);
        model.addAttribute("teamName", "404 Brain Not Found");
        model.addAttribute("currentYear", java.time.Year.now().getValue());
        
        return "member-detail";
    }
}
