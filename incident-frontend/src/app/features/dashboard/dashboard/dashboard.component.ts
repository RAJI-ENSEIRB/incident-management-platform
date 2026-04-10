import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  tickets: Ticket[] = [];

  isLoading = false;
  errorMessage = '';

  totalTickets = 0;

  openCount = 0;
  inProgressCount = 0;
  waitingCount = 0;
  resolvedCount = 0;
  closedCount = 0;

  highCount = 0;
  criticalCount = 0;

  unassignedCount = 0;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.computeStats();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  computeStats(): void {
    this.totalTickets = this.tickets.length;

    this.openCount = this.tickets.filter(ticket => ticket.status === 'OPEN').length;
    this.inProgressCount = this.tickets.filter(ticket => ticket.status === 'IN_PROGRESS').length;
    this.waitingCount = this.tickets.filter(ticket => ticket.status === 'WAITING').length;
    this.resolvedCount = this.tickets.filter(ticket => ticket.status === 'RESOLVED').length;
    this.closedCount = this.tickets.filter(ticket => ticket.status === 'CLOSED').length;

    this.highCount = this.tickets.filter(ticket => ticket.priority === 'HIGH').length;
    this.criticalCount = this.tickets.filter(ticket => ticket.priority === 'CRITICAL').length;

    this.unassignedCount = this.tickets.filter(ticket => !ticket.assignedTechnicianEmail).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTickets(): void {
    this.router.navigate(['/tickets']);
  }
}