package com.amine.incidentbackend.service;

import com.amine.incidentbackend.dto.CreateTicketRequest;
import com.amine.incidentbackend.dto.TicketResponse;
import com.amine.incidentbackend.entity.Category;
import com.amine.incidentbackend.entity.Ticket;
import com.amine.incidentbackend.entity.User;
import com.amine.incidentbackend.enums.TicketStatus;
import com.amine.incidentbackend.repository.CategoryRepository;
import com.amine.incidentbackend.repository.TicketRepository;
import com.amine.incidentbackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request, Authentication authentication){
        String email = authentication.getName();

        User creator = userRepository.findByEmail(email);
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Category category = CategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> nex RuntimeException("Category not found"));

        
    }

} 