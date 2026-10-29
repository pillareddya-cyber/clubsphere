package com.clubsphere.service;

import com.clubsphere.entity.Announcement;
import com.clubsphere.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    @Autowired
    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByIdDesc();
    }

    public List<Announcement> getAnnouncementsByClub(String clubName) {
        return announcementRepository.findByClubNameIgnoreCase(clubName);
    }

    public Announcement createAnnouncement(Announcement announcement) {
        if (announcement.getPostedDate() == null || announcement.getPostedDate().trim().isEmpty()) {
            announcement.setPostedDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        if (announcement.getCategory() == null || announcement.getCategory().trim().isEmpty()) {
            announcement.setCategory("ANNOUNCEMENT");
        }
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}

