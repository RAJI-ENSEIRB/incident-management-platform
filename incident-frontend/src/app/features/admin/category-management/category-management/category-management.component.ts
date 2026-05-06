import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService, CategoryRequest } from '../../../../core/services/category.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.css'
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  errorMessage = '';

  showForm = false;
  isEditMode = false;
  selectedId: number | null = null;

  formData: CategoryRequest = { name: '', description: '' };

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/tickets']);
      return;
    }
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => { this.categories = categories; this.isLoading = false; },
      error: () => { this.errorMessage = 'Failed to load categories.'; this.isLoading = false; }
    });
  }

  openCreateForm(): void {
    this.formData = { name: '', description: '' };
    this.isEditMode = false;
    this.selectedId = null;
    this.showForm = true;
  }

  openEditForm(category: Category): void {
    this.formData = { name: category.name, description: category.description ?? '' };
    this.isEditMode = true;
    this.selectedId = category.id;
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedId = null;
  }

  submitForm(): void {
    if (this.isEditMode && this.selectedId !== null) {
      this.categoryService.updateCategory(this.selectedId, this.formData).subscribe({
        next: () => {
          this.notificationService.success('Category updated');
          this.closeForm();
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => this.notificationService.error(err?.error?.message || 'Failed to update')
      });
    } else {
      this.categoryService.createCategory(this.formData).subscribe({
        next: () => {
          this.notificationService.success('Category created');
          this.closeForm();
          this.loadCategories();
        },
        error: (err: { error?: { message?: string } }) => this.notificationService.error(err?.error?.message || 'Failed to create')
      });
    }
  }

  deleteCategory(category: Category): void {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.notificationService.success('Category deleted');
        this.loadCategories();
      },
      error: (err: { error?: { message?: string } }) => this.notificationService.error(err?.error?.message || 'Failed to delete')
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
