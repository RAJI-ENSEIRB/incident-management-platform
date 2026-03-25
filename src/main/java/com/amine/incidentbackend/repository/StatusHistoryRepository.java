package com.amine.incidentbackend.repository;

import com.amine.incidentbackend.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByTicketIdOrderByChangedAtDesc(Long ticketId);
}