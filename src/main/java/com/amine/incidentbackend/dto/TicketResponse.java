package com.amine.incidentbackend.dto;

import com.amine.incidentbackend.enums.Priority;
import com.amine.incidentbackend.enums.TicketStatus;

import java.time.LocalDateTime;

public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private TicketStatus status;
    private String creatorEmail;
    private String assignedTechnicianEmail;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TicketResponse() {
    }

    public TicketResponse(Long id,
                          String title,
                          String description,
                          Priority priority,
                          TicketStatus status,
                          String creatorEmail,
                          String assignedTechnicianEmail,
                          String categoryName,
                          LocalDateTime createdAt,
                          LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.creatorEmail = creatorEmail;
        this.assignedTechnicianEmail = assignedTechnicianEmail;
        this.categoryName = categoryName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Priority getPriority() {
        return priority;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public String getAssignedTechnicianEmail() {
        return assignedTechnicianEmail;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public void setAssignedTechnicianEmail(String assignedTechnicianEmail) {
        this.assignedTechnicianEmail = assignedTechnicianEmail;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}