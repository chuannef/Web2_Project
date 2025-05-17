package com.example.Project0fCourse.model;

public class TeamMember {
    private String name;
    private boolean isLeader;
    private String role;

    public TeamMember(String name, boolean isLeader, String role) {
        this.name = name;
        this.isLeader = isLeader;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isLeader() {
        return isLeader;
    }

    public void setLeader(boolean leader) {
        isLeader = leader;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
