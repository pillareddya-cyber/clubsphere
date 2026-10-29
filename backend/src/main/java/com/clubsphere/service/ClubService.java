package com.clubsphere.service;

import com.clubsphere.entity.Club;
import com.clubsphere.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubService {

    private final ClubRepository clubRepository;

    @Autowired
    public ClubService(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public Optional<Club> getClubById(Long id) {
        return clubRepository.findById(id);
    }

    public Club saveClub(Club club) {
        return clubRepository.save(club);
    }

    public Club updateClub(Long id, Club updatedClub) {
        return clubRepository.findById(id).map(existing -> {
            existing.setName(updatedClub.getName());
            existing.setCategory(updatedClub.getCategory());
            existing.setDescription(updatedClub.getDescription());
            existing.setFacultyName(updatedClub.getFacultyName());
            existing.setFacultyEmpId(updatedClub.getFacultyEmpId());
            existing.setFacultyBranch(updatedClub.getFacultyBranch());
            existing.setCoordinatorName(updatedClub.getCoordinatorName());
            existing.setCoordinatorRollNo(updatedClub.getCoordinatorRollNo());
            existing.setCoordinatorBranch(updatedClub.getCoordinatorBranch());
            return clubRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Club not found with id: " + id));
    }

    public void deleteClub(Long id) {
        clubRepository.deleteById(id);
    }
}

