package com.clubsphere.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "clubs")
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;

    @Column(length = 1000)
    private String description;

    // Faculty Coordinator Details
    private String facultyName;
    private String facultyEmpId;
    private String facultyBranch;

    // Student Coordinator Details
    private String coordinatorName;
    private String coordinatorRollNo;
    private String coordinatorBranch;

    public Club() {
    }

    public Club(String name, String category, String description,
                String facultyName, String facultyEmpId, String facultyBranch,
                String coordinatorName, String coordinatorRollNo, String coordinatorBranch) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.facultyName = facultyName;
        this.facultyEmpId = facultyEmpId;
        this.facultyBranch = facultyBranch;
        this.coordinatorName = coordinatorName;
        this.coordinatorRollNo = coordinatorRollNo;
        this.coordinatorBranch = coordinatorBranch;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }

    public String getFacultyEmpId() {
        return facultyEmpId;
    }

    public void setFacultyEmpId(String facultyEmpId) {
        this.facultyEmpId = facultyEmpId;
    }

    public String getFacultyBranch() {
        return facultyBranch;
    }

    public void setFacultyBranch(String facultyBranch) {
        this.facultyBranch = facultyBranch;
    }

    public String getCoordinatorName() {
        return coordinatorName;
    }

    public void setCoordinatorName(String coordinatorName) {
        this.coordinatorName = coordinatorName;
    }

    public String getCoordinatorRollNo() {
        return coordinatorRollNo;
    }

    public void setCoordinatorRollNo(String coordinatorRollNo) {
        this.coordinatorRollNo = coordinatorRollNo;
    }

    public String getCoordinatorBranch() {
        return coordinatorBranch;
    }

    public void setCoordinatorBranch(String coordinatorBranch) {
        this.coordinatorBranch = coordinatorBranch;
    }
}

