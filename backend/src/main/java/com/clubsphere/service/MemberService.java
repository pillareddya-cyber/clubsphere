package com.clubsphere.service;

import com.clubsphere.entity.Member;
import com.clubsphere.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    @Autowired
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }

    public List<Member> getMembersByRole(String role) {
        return memberRepository.findByRoleIgnoreCase(role);
    }

    public long getStudentCount() {
        return memberRepository.countByRoleIgnoreCase("STUDENT");
    }

    public List<Member> searchMembers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return memberRepository.findAll();
        }
        return memberRepository.searchMembers(keyword.trim());
    }

    public Member saveMember(Member member) {
        return memberRepository.save(member);
    }

    public Member updateMember(Long id, Member updatedMember) {
        return memberRepository.findById(id).map(existing -> {
            existing.setName(updatedMember.getName());
            existing.setIdentifier(updatedMember.getIdentifier());
            existing.setRole(updatedMember.getRole());
            existing.setBranch(updatedMember.getBranch());
            existing.setMarks(updatedMember.getMarks());
            existing.setClubId(updatedMember.getClubId());
            existing.setClubName(updatedMember.getClubName());
            return memberRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Member not found with id: " + id));
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }
}

