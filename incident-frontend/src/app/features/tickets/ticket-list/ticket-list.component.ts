import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { PagedResponse } from '../../../core/models/paged-response.model';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  visibleTickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];

  isLoading = false;
  errorMessage = '';

  selectedStatus = '';
  selectedPriority = '';
  searchTerm = '';

  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = true;

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

  readonly pageSizes = [5, 10, 20];

  constructor(
    public authService: AuthService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets(this.currentPage, this.pageSize).subscribe({
      next: (response: PagedResponse<Ticket>) => {
        this.tickets = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isFirst = response.first;
        this.isLast = response.last;

        this.applyRoleVisibility();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load tickets.';
        this.isLoading = false;
      }
    });
  }

  applyRoleVisibility(): void {
    const email = this.authService.getUserEmail();
    const role = this.authService.getUserRole();

    if (role === 'ADMIN') {
      this.visibleTickets = [...this.tickets];
      return;
    }

    if (role === 'TECHNICIAN') {
      this.visibleTickets = this.tickets.filter(
        ticket => ticket.assignedTechnicianEmail === email
      );
      return;
    }

    if (role === 'USER') {
      this.visibleTickets = this.tickets.filter(
        ticket => ticket.creatorEmail === email
      );
      return;
    }

    this.visibleTickets = [];
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredTickets = this.visibleTickets.filter((ticket) => {
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

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTickets();
    }
  }

  nextPage(): void {
    if (!this.isLast) {
      this.currentPage++;
      this.loadTickets();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 0;
    this.loadTickets();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCreateTicket(): void {
    this.router.navigate(['/tickets/new']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}