package com.clubsphere.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // Roll Number for students; Employee ID for Faculty and Coordinators
    private String identifier;

    // STUDENT, FACULTY, COORDINATOR
    private String role;

    private String branch;

    // Academic marks or performance score
    private Double marks;

    // Associated club if any
    private Long clubId;
    private String clubName;

    public Member() {
    }

    public Member(String name, String identifier, String role, String branch, Double marks, Long clubId, String clubName) {
        this.name = name;
        this.identifier = identifier;
        this.role = role;
        this.branch = branch;
        this.marks = marks;
        this.clubId = clubId;
        this.clubName = clubName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    @Override
    public String toString() {
        return "Member{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", identifier='" + identifier + '\'' +
                ", role='" + role + '\'' +
                ", branch='" + branch + '\'' +
                ", marks=" + marks +
                ", clubName='" + clubName + '\'' +
                '}';
    }
}

