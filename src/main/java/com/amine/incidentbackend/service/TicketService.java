package com.amine.incidentbackend.service;

import com.amine.incidentbackend.dto.AssignTicketRequest;
import com.amine.incidentbackend.dto.CreateTicketRequest;
import com.amine.incidentbackend.dto.StatusHistoryResponse;
import com.amine.incidentbackend.dto.TicketResponse;
import com.amine.incidentbackend.dto.UpdateTicketStatusRequest;
import com.amine.incidentbackend.entity.Category;
import com.amine.incidentbackend.entity.StatusHistory;
import com.amine.incidentbackend.entity.Ticket;
import com.amine.incidentbackend.entity.User;
import com.amine.incidentbackend.enums.RoleName;
import com.amine.incidentbackend.enums.TicketStatus;
import com.amine.incidentbackend.repository.CategoryRepository;
import com.amine.incidentbackend.repository.StatusHistoryRepository;
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
    private final StatusHistoryRepository statusHistoryRepository;

    public TicketService(TicketRepository ticketRepository,
                         CategoryRepository categoryRepository,
                         UserRepository userRepository,
                         StatusHistoryRepository statusHistoryRepository) {
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.statusHistoryRepository = statusHistoryRepository;
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

    public TicketResponse updateTicketStatus(Long ticketId,
                                         UpdateTicketStatusRequest request,
                                         Authentication authentication) {
        String email = authentication.getName();

        User changedBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        TicketStatus oldStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();

        if (newStatus == null) {
            throw new RuntimeException("New status is required");
        }

        if (oldStatus == newStatus) {
            return mapToResponse(ticket);
        }

        ticket.setStatus(newStatus);
        Ticket updatedTicket = ticketRepository.save(ticket);

        StatusHistory history = new StatusHistory();
        history.setTicket(updatedTicket);
        history.setChangedBy(changedBy);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);

        statusHistoryRepository.save(history);

        return mapToResponse(updatedTicket);
    }

    public TicketResponse assignTicket(Long ticketId,
                                       AssignTicketRequest request,
                                       Authentication authentication) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User technician = userRepository.findById(request.getTechnicianId())
                .orElseThrow(() -> new RuntimeException("Technician not found"));

        if (technician.getRole() == null || technician.getRole().getName() != RoleName.TECHNICIAN) {
            throw new RuntimeException("Selected user is not a technician");
        }

        ticket.setAssignedTechnician(technician);
        Ticket updatedTicket = ticketRepository.save(ticket);

        return mapToResponse(updatedTicket);
    }

    public List<StatusHistoryResponse> getTicketStatusHistory(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new RuntimeException("Ticket not found");
        }

        return statusHistoryRepository.findByTicketIdOrderByChangedAtDesc(ticketId)
                .stream()
                .map(history -> new StatusHistoryResponse(
                        history.getId(),
                        history.getOldStatus(),
                        history.getNewStatus(),
                        history.getChangedAt(),
                        history.getChangedBy() != null ? history.getChangedBy().getEmail() : null
                ))
                .toList();
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