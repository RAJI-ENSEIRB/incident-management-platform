package com.amine.incidentbackend.dto;

public class AssignTicketRequest {

    private Long technicianId;

    public AssignTicketRequest() {
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }
}