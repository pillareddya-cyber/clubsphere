package com.clubsphere.controller;

import com.clubsphere.entity.Member;
import com.clubsphere.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // Get all members or filter by search keyword or role
    @GetMapping
    public ResponseEntity<List<Member>> getMembers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {

        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(memberService.searchMembers(search));
        }

        if (role != null && !role.trim().isEmpty() && !role.equalsIgnoreCase("ALL")) {
            return ResponseEntity.ok(memberService.getMembersByRole(role));
        }

        return ResponseEntity.ok(memberService.getAllMembers());
    }

    // Get member by ID
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        return memberService.getMemberById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get total student count
    @GetMapping("/count/students")
    public ResponseEntity<Map<String, Object>> getStudentCount() {
        long count = memberService.getStudentCount();
        Map<String, Object> response = new HashMap<>();
        response.put("totalStudents", count);
        return ResponseEntity.ok(response);
    }

    // Add new member (student, faculty, coordinator)
    @PostMapping
    public ResponseEntity<?> addMember(@RequestBody Member member) {
        if (member.getName() == null || member.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Member name is required.");
        }
        if (member.getIdentifier() == null || member.getIdentifier().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Roll Number or Employee ID is required.");
        }
        if (member.getRole() == null || member.getRole().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role (STUDENT, FACULTY, COORDINATOR) is required.");
        }
        Member saved = memberService.saveMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Update existing member
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable Long id, @RequestBody Member member) {
        try {
            Member updated = memberService.updateMember(id, member);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Delete member
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Member deleted successfully.");
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

