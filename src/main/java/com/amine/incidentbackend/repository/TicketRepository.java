package com.amine.incidentbackend.repository;

import com.amine.incidentbackend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long>{
    
} 