package com.clubsphere.service;

import com.clubsphere.entity.MembershipRequest;
import com.clubsphere.repository.MembershipRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MembershipRequestService {

    private final MembershipRequestRepository requestRepository;

    @Autowired
    public MembershipRequestService(MembershipRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public List<MembershipRequest> getAllRequests() {
        return requestRepository.findAllByOrderByIdDesc();
    }

    public List<MembershipRequest> getRequestsByRollNumber(String rollNumber) {
        return requestRepository.findByStudentRollNumberIgnoreCase(rollNumber);
    }

    public MembershipRequest submitRequest(MembershipRequest request) {
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            request.setStatus("PENDING");
        }
        if (request.getRequestDate() == null || request.getRequestDate().trim().isEmpty()) {
            request.setRequestDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        }
        return requestRepository.save(request);
    }

    public MembershipRequest updateStatus(Long id, String status, String remarks) {
        return requestRepository.findById(id).map(existing -> {
            existing.setStatus(status.toUpperCase());
            if (remarks != null) {
                existing.setRemarks(remarks);
            }
            return requestRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Membership request not found with id: " + id));
    }

    public void deleteRequest(Long id) {
        requestRepository.deleteById(id);
    }
}

