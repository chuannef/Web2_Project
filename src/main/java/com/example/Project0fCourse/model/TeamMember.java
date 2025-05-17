package com.example.Project0fCourse.model;

public class TeamMember {
    private String id;
    private String name;
    private boolean isLeader;
    private String role;
    private String bio;
    private String skills;
    private String imageUrl;

    public TeamMember(String id, String name, boolean isLeader, String role, String bio, String skills, String imageUrl) {
        this.id = id;
        this.name = name;
        this.isLeader = isLeader;
        this.role = role;
        this.bio = bio;
        this.skills = skills;
        this.imageUrl = imageUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
