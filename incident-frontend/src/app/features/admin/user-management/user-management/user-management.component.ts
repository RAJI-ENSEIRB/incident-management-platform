import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, CreateUserRequest, UpdateUserRequest } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  showCreateForm = false;
  showEditForm = false;
  showPasswordForm = false;
  selectedUser: User | null = null;

  createForm: CreateUserRequest = {
    firstName: '', lastName: '', email: '', password: '', role: 'USER'
  };
  editForm: UpdateUserRequest = {};
  newPassword = '';

  readonly availableRoles = ['USER', 'TECHNICIAN', 'MANAGER', 'ADMIN'];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/tickets']);
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => { this.users = users; this.isLoading = false; },
      error: () => { this.errorMessage = 'Failed to load users.'; this.isLoading = false; }
    });
  }

  openCreateForm(): void {
    this.createForm = { firstName: '', lastName: '', email: '', password: '', role: 'USER' };
    this.showCreateForm = true;
    this.showEditForm = false;
    this.showPasswordForm = false;
  }

  openEditForm(user: User): void {
    this.selectedUser = user;
    this.editForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role?.name ?? 'USER',
      active: user.active
    };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showPasswordForm = false;
  }

  openPasswordForm(user: User): void {
    this.selectedUser = user;
    this.newPassword = '';
    this.showPasswordForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  closeAllForms(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.showPasswordForm = false;
    this.selectedUser = null;
  }

  submitCreate(): void {
    this.userService.createUser(this.createForm).subscribe({
      next: () => {
        this.notificationService.success('User created successfully');
        this.closeAllForms();
        this.loadUsers();
      },
      error: (err: any) => this.notificationService.error(err?.error?.message || 'Failed to create user')
    });
  }

  submitEdit(): void {
    if (!this.selectedUser) return;
    this.userService.updateUser(this.selectedUser.id, this.editForm).subscribe({
      next: () => {
        this.notificationService.success('User updated successfully');
        this.closeAllForms();
        this.loadUsers();
      },
      error: (err: any) => this.notificationService.error(err?.error?.message || 'Failed to update user')
    });
  }

  submitPasswordChange(): void {
    if (!this.selectedUser) return;
    this.userService.changePassword(this.selectedUser.id, this.newPassword).subscribe({
      next: () => {
        this.notificationService.success('Password changed successfully');
        this.closeAllForms();
      },
      error: (err: any) => this.notificationService.error(err?.error?.message || 'Failed to change password')
    });
  }

  toggleActive(user: User): void {
    this.userService.toggleActive(user.id).subscribe({
      next: (updated: User) => {
        const idx = this.users.findIndex(u => u.id === user.id);
        if (idx !== -1) this.users[idx] = updated;
        this.notificationService.success(updated.active ? 'User activated' : 'User deactivated');
      },
      error: () => this.notificationService.error('Failed to update user status')
    });
  }

  goBack(): void {
    this.router.navigate(['/tickets']);
  }
}
