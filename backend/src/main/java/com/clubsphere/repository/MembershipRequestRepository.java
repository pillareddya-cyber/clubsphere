package com.clubsphere.repository;

import com.clubsphere.entity.MembershipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, Long> {

    List<MembershipRequest> findAllByOrderByIdDesc();

    List<MembershipRequest> findByStudentRollNumberIgnoreCase(String studentRollNumber);

    List<MembershipRequest> findByClubId(Long clubId);
}

