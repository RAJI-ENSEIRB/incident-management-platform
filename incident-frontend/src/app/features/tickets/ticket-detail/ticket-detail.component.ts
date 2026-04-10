import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { Comment } from '../../../core/models/comment.model';
import { StatusHistory } from '../../../core/models/status-history.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  comments: Comment[] = [];
  history: StatusHistory[] = [];
  technicians: User[] = [];

  isLoading = false;
  isCommentsLoading = false;
  isHistoryLoading = false;
  isTechniciansLoading = false;

  errorMessage = '';
  commentsErrorMessage = '';
  historyErrorMessage = '';
  techniciansErrorMessage = '';

  newComment = '';
  commentErrorMessage = '';
  isSubmittingComment = false;

  selectedStatus = '';
  statusErrorMessage = '';
  isUpdatingStatus = false;

  selectedTechnicianId: number | null = null;
  assignErrorMessage = '';
  isAssigningTechnician = false;

  private ticketId: number | null = null;

  readonly availableStatuses = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING',
    'RESOLVED',
    'CLOSED'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'Ticket id is missing.';
      return;
    }

    const ticketId = Number(idParam);

    if (isNaN(ticketId)) {
      this.errorMessage = 'Invalid ticket id.';
      return;
    }

    this.ticketId = ticketId;

    this.loadTicket(ticketId);
    this.loadComments(ticketId);
    this.loadHistory(ticketId);
    this.loadTechnicians();
  }

  loadTicket(ticketId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTicketById(ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
        this.selectedStatus = data.status;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Ticket not found.';
        this.isLoading = false;
      }
    });
  }

  loadComments(ticketId: number): void {
    this.isCommentsLoading = true;
    this.commentsErrorMessage = '';

    this.ticketService.getComments(ticketId).subscribe({
      next: (data) => {
        this.comments = data;
        this.isCommentsLoading = false;
      },
      error: () => {
        this.commentsErrorMessage = 'Failed to load comments.';
        this.isCommentsLoading = false;
      }
    });
  }

  loadHistory(ticketId: number): void {
    this.isHistoryLoading = true;
    this.historyErrorMessage = '';

    this.ticketService.getHistory(ticketId).subscribe({
      next: (data) => {
        this.history = data;
        this.isHistoryLoading = false;
      },
      error: () => {
        this.historyErrorMessage = 'Failed to load history.';
        this.isHistoryLoading = false;
      }
    });
  }

  loadTechnicians(): void {
    this.isTechniciansLoading = true;
    this.techniciansErrorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.technicians = users.filter(
          (user) => user.role?.name === 'TECHNICIAN'
        );
        this.isTechniciansLoading = false;
      },
      error: () => {
        this.techniciansErrorMessage = 'Failed to load technicians.';
        this.isTechniciansLoading = false;
      }
    });
  }

  submitComment(): void {
    if (!this.ticketId) {
      return;
    }

    this.commentErrorMessage = '';

    if (!this.newComment.trim()) {
      this.commentErrorMessage = 'Comment content is required.';
      return;
    }

    this.isSubmittingComment = true;

    this.ticketService.addComment(this.ticketId, this.newComment.trim()).subscribe({
      next: () => {
        this.newComment = '';
        this.isSubmittingComment = false;
        this.loadComments(this.ticketId!);
      },
      error: () => {
        this.commentErrorMessage = 'Failed to add comment.';
        this.isSubmittingComment = false;
      }
    });
  }

  submitStatusUpdate(): void {
    if (!this.ticketId || !this.selectedStatus) {
      return;
    }

    this.statusErrorMessage = '';
    this.isUpdatingStatus = true;

    this.ticketService.updateStatus(this.ticketId, this.selectedStatus).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.isUpdatingStatus = false;
        this.loadHistory(this.ticketId!);
      },
      error: () => {
        this.statusErrorMessage = 'Failed to update status.';
        this.isUpdatingStatus = false;
      }
    });
  }

  submitTechnicianAssignment(): void {
    if (!this.ticketId || !this.selectedTechnicianId) {
      this.assignErrorMessage = 'Please select a technician.';
      return;
    }

    this.assignErrorMessage = '';
    this.isAssigningTechnician = true;

    this.ticketService.assignTechnician(this.ticketId, this.selectedTechnicianId).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.isAssigningTechnician = false;
      },
      error: () => {
        this.assignErrorMessage = 'Failed to assign technician.';
        this.isAssigningTechnician = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}