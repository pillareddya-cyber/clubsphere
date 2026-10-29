package com.clubsphere.controller;

import com.clubsphere.entity.Announcement;
import com.clubsphere.service.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements(
            @RequestParam(required = false) String clubName) {
        if (clubName != null && !clubName.trim().isEmpty()) {
            return ResponseEntity.ok(announcementService.getAnnouncementsByClub(clubName));
        }
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestBody Announcement announcement) {
        if (announcement.getTitle() == null || announcement.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Announcement title is required.");
        }
        if (announcement.getContent() == null || announcement.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Announcement content is required.");
        }
        Announcement saved = announcementService.createAnnouncement(announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Announcement deleted successfully.");
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}

