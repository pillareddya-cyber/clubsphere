package com.clubsphere.repository;

import com.clubsphere.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByRoleIgnoreCase(String role);

    long countByRoleIgnoreCase(String role);

    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.identifier) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.branch) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Member> searchMembers(@Param("keyword") String keyword);

    List<Member> findByClubId(Long clubId);
}

