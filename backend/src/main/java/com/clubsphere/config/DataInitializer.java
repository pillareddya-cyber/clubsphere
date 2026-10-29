package com.clubsphere.config;

import com.clubsphere.entity.Announcement;
import com.clubsphere.entity.Club;
import com.clubsphere.entity.Member;
import com.clubsphere.entity.MembershipRequest;
import com.clubsphere.repository.AnnouncementRepository;
import com.clubsphere.repository.ClubRepository;
import com.clubsphere.repository.MemberRepository;
import com.clubsphere.repository.MembershipRequestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;
    private final MembershipRequestRepository requestRepository;
    private final AnnouncementRepository announcementRepository;

    public DataInitializer(ClubRepository clubRepository,
                           MemberRepository memberRepository,
                           MembershipRequestRepository requestRepository,
                           AnnouncementRepository announcementRepository) {
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
        this.requestRepository = requestRepository;
        this.announcementRepository = announcementRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (clubRepository.count() > 0) {
            return;
        }

        String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        // 1. Initial Clubs with Faculty and Student Coordinators
        Club codingClub = clubRepository.save(new Club(
                "CodeCrafters Club",
                "Technical",
                "Fostering coding excellence, competitive programming, and algorithm problem-solving.",
                "Dr. Ramesh Sharma", "FAC-CSE-101", "Computer Science & Engineering",
                "Aditi Roy", "21CS042", "Computer Science & Engineering"
        ));

        Club roboticsClub = clubRepository.save(new Club(
                "RoboTech & IoT Club",
                "Technical",
                "Hands-on robotics, microcontrollers, IoT development, and automated hardware projects.",
                "Prof. Vikram Joshi", "FAC-ECE-204", "Electronics & Communication",
                "Rahul Deshmukh", "21EC019", "Electronics & Communication"
        ));

        Club culturalClub = clubRepository.save(new Club(
                "Sanskriti Cultural Club",
                "Cultural",
                "Celebrating arts, music, dance, theatrical expressions, and annual college fests.",
                "Dr. Meenakshi Iyer", "FAC-HUM-305", "Humanities & Arts",
                "Sneha Kapoor", "22BT008", "Biotechnology"
        ));

        Club sportsClub = clubRepository.save(new Club(
                "Olympian Sports Arena",
                "Sports",
                "Promoting physical fitness, inter-college sports tournaments, and athletic training.",
                "Coach Rajesh Pillai", "FAC-PED-412", "Physical Education",
                "Karan Varma", "22ME077", "Mechanical Engineering"
        ));

        // 2. Initial Members: Students, Faculty, and Coordinators
        // Faculty
        memberRepository.save(new Member("Dr. Ramesh Sharma", "FAC-CSE-101", "FACULTY", "Computer Science & Engineering", 92.0, codingClub.getId(), codingClub.getName()));
        memberRepository.save(new Member("Prof. Vikram Joshi", "FAC-ECE-204", "FACULTY", "Electronics & Communication", 89.5, roboticsClub.getId(), roboticsClub.getName()));
        memberRepository.save(new Member("Dr. Meenakshi Iyer", "FAC-HUM-305", "FACULTY", "Humanities & Arts", 94.0, culturalClub.getId(), culturalClub.getName()));

        // Coordinators
        memberRepository.save(new Member("Aditi Roy", "21CS042", "COORDINATOR", "Computer Science & Engineering", 88.0, codingClub.getId(), codingClub.getName()));
        memberRepository.save(new Member("Rahul Deshmukh", "21EC019", "COORDINATOR", "Electronics & Communication", 85.5, roboticsClub.getId(), roboticsClub.getName()));
        memberRepository.save(new Member("Sneha Kapoor", "22BT008", "COORDINATOR", "Biotechnology", 86.0, culturalClub.getId(), culturalClub.getName()));

        // Students
        memberRepository.save(new Member("Aarav Patel", "23CS101", "STUDENT", "Computer Science & Engineering", 87.5, null, null));
        memberRepository.save(new Member("Ananya Verma", "23CS105", "STUDENT", "Computer Science & Engineering", 91.0, null, null));
        memberRepository.save(new Member("Devendra Rao", "23EC041", "STUDENT", "Electronics & Communication", 78.5, null, null));
        memberRepository.save(new Member("Kavya Nambiar", "23IT023", "STUDENT", "Information Technology", 84.0, null, null));
        memberRepository.save(new Member("Manish Gupta", "23ME055", "STUDENT", "Mechanical Engineering", 80.0, null, null));

        // 3. Initial Membership Requests
        requestRepository.save(new MembershipRequest(
                "Aarav Patel", "23CS101", "Computer Science & Engineering",
                codingClub.getId(), codingClub.getName(),
                "PENDING", now, "Excited to collaborate on Hackathons!"
        ));
        requestRepository.save(new MembershipRequest(
                "Ananya Verma", "23CS105", "Computer Science & Engineering",
                codingClub.getId(), codingClub.getName(),
                "ACCEPTED", now, "High aptitude in Java & Spring."
        ));
        requestRepository.save(new MembershipRequest(
                "Devendra Rao", "23EC041", "Electronics & Communication",
                roboticsClub.getId(), roboticsClub.getName(),
                "PENDING", now, "Experience with Arduino and Raspberry Pi."
        ));

        // 4. Initial Announcements and Alerts
        announcementRepository.save(new Announcement(
                "Annual HackSphere 2026 Registration Open!",
                "CodeCrafters is hosting a 24-hour hackathon next weekend in Lab 3. Attractive prizes and certificates for all participants.",
                "EVENT",
                codingClub.getName(),
                "Aditi Roy (Coordinator)",
                now
        ));

        announcementRepository.save(new Announcement(
                "Mandatory Orientation for New Recruits",
                "All accepted students for the 2026-27 term must assemble in the Central Seminar Hall on Friday at 3:00 PM.",
                "ANNOUNCEMENT",
                "All Clubs",
                "Dr. Ramesh Sharma (Faculty)",
                now
        ));

        announcementRepository.save(new Announcement(
                "Urgent Alert: Robotech Workshop Venue Change",
                "Due to lab maintenance, the Arduino & Sensor integration hands-on session is shifted to ECE Block Room 204.",
                "ALERT",
                roboticsClub.getName(),
                "Prof. Vikram Joshi (Faculty)",
                now
        ));
    }
}

