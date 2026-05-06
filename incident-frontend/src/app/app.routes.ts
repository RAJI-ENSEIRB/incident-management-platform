import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TicketListComponent } from './features/tickets/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './features/tickets/ticket-detail/ticket-detail.component';
import { TicketCreateComponent } from './features/tickets/ticket-create/ticket-create.component';
import { MyTicketsComponent } from './features/tickets/my-tickets/my-tickets.component';
import { AssignedTicketsComponent } from './features/tickets/assigned-tickets/assigned-tickets.component';
import { CategoryManagementComponent } from './features/admin/category-management/category-management/category-management.component';
import { UserManagementComponent } from './features/admin/user-management/user-management/user-management.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'tickets', component: TicketListComponent, canActivate: [authGuard] },
  { path: 'tickets/new', component: TicketCreateComponent, canActivate: [authGuard] },
  { path: 'my-tickets', component: MyTicketsComponent, canActivate: [authGuard] },
  { path: 'assigned-tickets', component: AssignedTicketsComponent, canActivate: [authGuard] },
  { path: 'tickets/:id', component: TicketDetailComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'admin/categories', component: CategoryManagementComponent, canActivate: [authGuard] },
  { path: 'admin/users', component: UserManagementComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];