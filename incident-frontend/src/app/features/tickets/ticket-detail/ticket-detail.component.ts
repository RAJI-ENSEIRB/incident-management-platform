import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Ticket } from '../../../core/models/ticket.model';
import { Comment } from '../../../core/models/comment.model';
import { StatusHistory } from '../../../core/models/status-history.model';
import { User } from '../../../core/models/user.model';
import { Attachment } from '../../../core/models/attachment.model';

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
  attachments: Attachment[] = [];

  isLoading = false;
  isCommentsLoading = false;
  isHistoryLoading = false;
  isTechniciansLoading = false;
  isAttachmentsLoading = false;
  isUploadingAttachment = false;

  errorMessage = '';
  commentsErrorMessage = '';
  historyErrorMessage = '';
  techniciansErrorMessage = '';
  attachmentsErrorMessage = '';
  attachmentUploadErrorMessage = '';

  newComment = '';
  commentErrorMessage = '';
  isSubmittingComment = false;

  selectedStatus = '';
  statusErrorMessage = '';
  isUpdatingStatus = false;

  selectedTechnicianId: number | null = null;
  assignErrorMessage = '';
  isAssigningTechnician = false;

  selectedFile: File | null = null;

  private ticketId: number | null = null;

  readonly availableStatuses = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING',
    'RESOLVED',
    'CLOSED'
  ];

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private userService: UserService,
    private notificationService: NotificationService
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
    this.loadAttachments(ticketId);

    if (this.authService.canAssignTechnician()) {
      this.loadTechnicians();
    }
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
        this.notificationService.error('Ticket not found.');
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
        this.notificationService.error('Failed to load technicians.');
        this.isTechniciansLoading = false;
      }
    });
  }

  loadAttachments(ticketId: number): void {
    this.isAttachmentsLoading = true;
    this.attachmentsErrorMessage = '';

    this.ticketService.getAttachments(ticketId).subscribe({
      next: (data) => {
        this.attachments = data;
        this.isAttachmentsLoading = false;
      },
      error: () => {
        this.attachmentsErrorMessage = 'Failed to load attachments.';
        this.isAttachmentsLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.attachmentUploadErrorMessage = '';
    }
  }

  uploadAttachment(): void {
    if (!this.ticketId) {
      return;
    }

    if (!this.selectedFile) {
      this.attachmentUploadErrorMessage = 'Please select a file.';
      this.notificationService.error('Please select a file.');
      return;
    }

    this.isUploadingAttachment = true;
    this.attachmentUploadErrorMessage = '';

    this.ticketService.uploadAttachment(this.ticketId, this.selectedFile).subscribe({
      next: () => {
        this.selectedFile = null;
        this.isUploadingAttachment = false;
        this.loadAttachments(this.ticketId!);
        this.notificationService.success('Attachment uploaded successfully.');
      },
      error: (error) => {
        this.attachmentUploadErrorMessage =
          error?.error?.message || 'Failed to upload attachment.';
        this.notificationService.error(
          error?.error?.message || 'Failed to upload attachment.'
        );
        this.isUploadingAttachment = false;
      }
    });
  }

  getDownloadUrl(attachmentId: number): string {
    return this.ticketService.getAttachmentDownloadUrl(attachmentId);
  }

  submitComment(): void {
    if (!this.ticketId || !this.authService.canComment()) {
      return;
    }

    this.commentErrorMessage = '';

    if (!this.newComment.trim()) {
      this.commentErrorMessage = 'Comment content is required.';
      this.notificationService.error('Comment content is required.');
      return;
    }

    this.isSubmittingComment = true;

    this.ticketService.addComment(this.ticketId, this.newComment.trim()).subscribe({
      next: () => {
        this.newComment = '';
        this.isSubmittingComment = false;
        this.loadComments(this.ticketId!);
        this.notificationService.success('Comment added successfully.');
      },
      error: () => {
        this.commentErrorMessage = 'Failed to add comment.';
        this.notificationService.error('Failed to add comment.');
        this.isSubmittingComment = false;
      }
    });
  }

  submitStatusUpdate(): void {
    if (!this.ticketId || !this.selectedStatus || !this.authService.canUpdateStatus()) {
      return;
    }

    this.statusErrorMessage = '';
    this.isUpdatingStatus = true;

    this.ticketService.updateStatus(this.ticketId, this.selectedStatus).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.isUpdatingStatus = false;
        this.loadHistory(this.ticketId!);
        this.notificationService.success('Status updated successfully.');
      },
      error: (error) => {
        this.statusErrorMessage =
          error?.error?.message || 'Failed to update status.';
        this.notificationService.error(
          error?.error?.message || 'Failed to update status.'
        );
        this.isUpdatingStatus = false;
      }
    });
  }

  submitTechnicianAssignment(): void {
    if (!this.ticketId || !this.selectedTechnicianId || !this.authService.canAssignTechnician()) {
      this.assignErrorMessage = 'Please select a technician.';
      this.notificationService.error('Please select a technician.');
      return;
    }

    this.assignErrorMessage = '';
    this.isAssigningTechnician = true;

    this.ticketService.assignTechnician(this.ticketId, this.selectedTechnicianId).subscribe({
      next: (updatedTicket) => {
        this.ticket = updatedTicket;
        this.isAssigningTechnician = false;
        this.notificationService.success('Technician assigned successfully.');
      },
      error: () => {
        this.assignErrorMessage = 'Failed to assign technician.';
        this.notificationService.error('Failed to assign technician.');
        this.isAssigningTechnician = false;
      }
    });
  }





  downloadAttachment(attachment: Attachment): void {
    this.ticketService.downloadAttachment(attachment.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = attachment.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.notificationService.error('Failed to download attachment.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}