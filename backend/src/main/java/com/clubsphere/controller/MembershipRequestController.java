package com.clubsphere.controller;

import com.clubsphere.entity.MembershipRequest;
import com.clubsphere.service.MembershipRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class MembershipRequestController {

    private final MembershipRequestService requestService;

    @Autowired
    public MembershipRequestController(MembershipRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping
    public ResponseEntity<List<MembershipRequest>> getAllRequests() {
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/student/{rollNumber}")
    public ResponseEntity<List<MembershipRequest>> getRequestsByStudent(@PathVariable String rollNumber) {
        return ResponseEntity.ok(requestService.getRequestsByRollNumber(rollNumber));
    }

    @PostMapping
    public ResponseEntity<?> submitRequest(@RequestBody MembershipRequest request) {
        if (request.getStudentName() == null || request.getStudentName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Student name is required.");
        }
        if (request.getStudentRollNumber() == null || request.getStudentRollNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Roll number is required.");
        }
        if (request.getClubName() == null || request.getClubName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Club name is required.");
        }
        MembershipRequest saved = requestService.submitRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String remarks = payload.get("remarks");

        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required (ACCEPTED or REJECTED).");
        }

        try {
            MembershipRequest updated = requestService.updateStatus(id, status, remarks);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            requestService.deleteRequest(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Request deleted successfully.");
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

