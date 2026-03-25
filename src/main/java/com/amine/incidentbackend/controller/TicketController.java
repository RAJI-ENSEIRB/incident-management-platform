package com.amine.incidentbackend.controller;

import com.amine.incidentbackend.dto.AssignTicketRequest;
import com.amine.incidentbackend.dto.CreateTicketRequest;
import com.amine.incidentbackend.dto.StatusHistoryResponse;
import com.amine.incidentbackend.dto.TicketResponse;
import com.amine.incidentbackend.dto.UpdateTicketStatusRequest;
import com.amine.incidentbackend.service.TicketService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public TicketResponse createTicket(@RequestBody CreateTicketRequest request,
                                       Authentication authentication) {
        return ticketService.createTicket(request, authentication);
    }

    @GetMapping
    public List<TicketResponse> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public TicketResponse getTicketById(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @PatchMapping("/{id}/status")
    public TicketResponse updateTicketStatus(@PathVariable Long id,
                                             @RequestBody UpdateTicketStatusRequest request,
                                             Authentication authentication) {
        return ticketService.updateTicketStatus(id, request, authentication);
    }

    @PatchMapping("/{id}/assign")
    public TicketResponse assignTicket(@PathVariable Long id,
                                       @RequestBody AssignTicketRequest request,
                                       Authentication authentication) {
        return ticketService.assignTicket(id, request, authentication);
    }

    @GetMapping("/{id}/history")
    public List<StatusHistoryResponse> getTicketStatusHistory(@PathVariable Long id) {
        return ticketService.getTicketStatusHistory(id);
    }
}