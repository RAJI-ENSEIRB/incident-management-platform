package com.amine.incidentbackend.dto;

import com.amine.incidentbackend.enums.TicketStatus;

public class UpdateTicketStatusRequest {

    private TicketStatus status;

    public UpdateTicketStatusRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }
}