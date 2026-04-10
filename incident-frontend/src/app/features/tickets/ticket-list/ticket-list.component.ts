import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  isLoading = false;
  errorMessage = '';

  selectedStatus = '';
  selectedPriority = '';
  searchTerm = '';

  readonly availableStatuses = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING',
    'RESOLVED',
    'CLOSED'
  ];

  readonly availablePriorities = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'CRITICAL'
  ];

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredTickets = this.tickets.filter((ticket) => {
      const matchesStatus =
        !this.selectedStatus || ticket.status === this.selectedStatus;

      const matchesPriority =
        !this.selectedPriority || ticket.priority === this.selectedPriority;

      const matchesSearch =
        !term ||
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term) ||
        ticket.categoryName.toLowerCase().includes(term) ||
        ticket.creatorEmail.toLowerCase().includes(term) ||
        (ticket.assignedTechnicianEmail ?? '').toLowerCase().includes(term);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}