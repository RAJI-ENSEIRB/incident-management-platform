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

    public TicketService(TicketRepository ticketRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public TicketResponse createTicket(CreateTicketRequest request, Authentication authentication) {
        String email = authentication.getName();

        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreator(creator);
        ticket.setCategory(category);

        Ticket savedTicket = ticketRepository.save(ticket);
        return mapToResponse(savedTicket);
    }

    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return mapToResponse(ticket);
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreator() != null ? ticket.getCreator().getEmail() : null,
                ticket.getAssignedTechnician() != null ? ticket.getAssignedTechnician().getEmail() : null,
                ticket.getCategory() != null ? ticket.getCategory().getName() : null,
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }
}