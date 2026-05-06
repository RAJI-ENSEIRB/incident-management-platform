import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { PagedResponse } from '../../../core/models/paged-response.model';

@Component({
  selector: 'app-assigned-tickets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './assigned-tickets.component.html',
  styleUrl: './assigned-tickets.component.css'
})
export class AssignedTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAssignedTickets();
  }

  loadAssignedTickets(): void {
    const email = this.authService.getUserEmail();

    if (!email) {
      this.errorMessage = 'User email not found.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets(0, 1000).subscribe({
      next: (response: PagedResponse<Ticket>) => {
        this.tickets = response.content.filter(
          (ticket: Ticket) => ticket.assignedTechnicianEmail === email
        );
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load assigned tickets.';
        this.isLoading = false;
      }
    });
  }

  goToTickets(): void {
    this.router.navigate(['/tickets']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}