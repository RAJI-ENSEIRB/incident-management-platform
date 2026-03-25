package com.amine.incidentbackend.dto;

import com.amine.incidentbackend.enums.TicketStatus;

import java.time.LocalDateTime;

public class StatusHistoryResponse {

    private Long id;
    private TicketStatus oldStatus;
    private TicketStatus newStatus;
    private LocalDateTime changedAt;
    private String changedByEmail;

    public StatusHistoryResponse() {
    }

    public StatusHistoryResponse(Long id,
                                 TicketStatus oldStatus,
                                 TicketStatus newStatus,
                                 LocalDateTime changedAt,
                                 String changedByEmail) {
        this.id = id;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
        this.changedByEmail = changedByEmail;
    }

    public Long getId() {
        return id;
    }

    public TicketStatus getOldStatus() {
        return oldStatus;
    }

    public TicketStatus getNewStatus() {
        return newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public String getChangedByEmail() {
        return changedByEmail;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setOldStatus(TicketStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public void setNewStatus(TicketStatus newStatus) {
        this.newStatus = newStatus;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public void setChangedByEmail(String changedByEmail) {
        this.changedByEmail = changedByEmail;
    }
}