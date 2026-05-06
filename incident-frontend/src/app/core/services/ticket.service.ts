import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket } from '../models/ticket.model';
import { Comment } from '../models/comment.model';
import { StatusHistory } from '../models/status-history.model';
import { Attachment } from '../models/attachment.model';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = `${environment.apiUrl}/api/tickets`;
  private readonly attachmentBaseUrl = `${environment.apiUrl}/api/attachments`;

  constructor(private http: HttpClient) {}

  getAllTickets(page: number = 0, size: number = 5) {
    return this.http.get<PagedResponse<Ticket>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${ticketId}/comments`);
  }

  getHistory(ticketId: number): Observable<StatusHistory[]> {
    return this.http.get<StatusHistory[]>(`${this.apiUrl}/${ticketId}/history`);
  }

  getAttachments(ticketId: number): Observable<Attachment[]> {
    return this.http.get<Attachment[]>(`${this.apiUrl}/${ticketId}/attachments`);
  }

  uploadAttachment(ticketId: number, file: File): Observable<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Attachment>(`${this.apiUrl}/${ticketId}/attachments`, formData);
  }


  downloadAttachment(attachmentId: number) {
    return this.http.get(`${this.attachmentBaseUrl}/${attachmentId}/download`, {
      responseType: 'blob'
    });
  }

  getAttachmentDownloadUrl(attachmentId: number): string {
    return `${this.attachmentBaseUrl}/${attachmentId}/download`;
  }

  addComment(ticketId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${ticketId}/comments`, { content });
  }

  updateStatus(ticketId: number, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}/status`, { status });
  }

  assignTechnician(ticketId: number, technicianId: number): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${ticketId}/assign`, { technicianId });
  }

  createTicket(payload: {
    title: string;
    description: string;
    priority: string;
    categoryId: number;
  }): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, payload);
  }
}