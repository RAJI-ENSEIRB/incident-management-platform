package com.amine.incidentbackend.entity;

import com.amine.incidentbackend.enums.TicketStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "status_history")
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus newStatus;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(optional = false)
    @JoinColumn(name = "changed_by_id", nullable = false)
    private User changedBy;

    public StatusHistory() {
    }

    @PrePersist
    public void prePersist() {
        this.changedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public TicketStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(TicketStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public TicketStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(TicketStatus newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(User changedBy) {
        this.changedBy = changedBy;
    }
}