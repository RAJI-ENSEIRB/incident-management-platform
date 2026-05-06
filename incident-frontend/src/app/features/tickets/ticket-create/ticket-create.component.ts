import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css'
})
export class TicketCreateComponent implements OnInit {
  categories: Category[] = [];

  form = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    categoryId: null as number | null
  };

  isLoadingCategories = false;
  isSubmitting = false;

  errorMessage = '';
  categoriesErrorMessage = '';

  readonly priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  constructor(
    public authService: AuthService,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.canCreateTicket()) {
      this.router.navigate(['/tickets']);
      return;
    }

    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoriesErrorMessage = '';

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (data.length > 0 && this.form.categoryId === null) {
          this.form.categoryId = data[0].id;
        }
        this.isLoadingCategories = false;
      },
      error: () => {
        this.categoriesErrorMessage = 'Failed to load categories.';
        this.notificationService.error('Failed to load categories.');
        this.isLoadingCategories = false;
      }
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (!this.form.title.trim()) {
      this.errorMessage = 'Title is required.';
      this.notificationService.error('Title is required.');
      return;
    }

    if (!this.form.description.trim()) {
      this.errorMessage = 'Description is required.';
      this.notificationService.error('Description is required.');
      return;
    }

    if (!this.form.categoryId) {
      this.errorMessage = 'Category is required.';
      this.notificationService.error('Category is required.');
      return;
    }

    this.isSubmitting = true;

    this.ticketService.createTicket({
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      priority: this.form.priority,
      categoryId: this.form.categoryId
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.success('Ticket created successfully.');
        this.router.navigate(['/tickets']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Failed to create ticket.';
        this.notificationService.error(
          error?.error?.message || 'Failed to create ticket.'
        );
        this.isSubmitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tickets']);
  }
}