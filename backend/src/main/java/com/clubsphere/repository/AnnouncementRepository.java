package com.clubsphere.repository;

import com.clubsphere.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    List<Announcement> findAllByOrderByIdDesc();

    List<Announcement> findByClubNameIgnoreCase(String clubName);
}

