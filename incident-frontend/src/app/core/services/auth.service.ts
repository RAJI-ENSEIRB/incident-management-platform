import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  private readonly tokenKey = 'auth_token';
  private readonly emailKey = 'auth_email';
  private readonly roleKey = 'auth_role';

  private readonly isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        this.saveSession(response.token, response.email, response.role);
      })
    );
  }

  saveSession(token: string, email: string, role: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.emailKey, email);
    localStorage.setItem(this.roleKey, role);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  getUserEmail(): string | null {
    return this.isBrowser ? localStorage.getItem(this.emailKey) : null;
  }

  getUserRole(): string | null {
    return this.isBrowser ? localStorage.getItem(this.roleKey) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isTechnician(): boolean {
    return this.getUserRole() === 'TECHNICIAN';
  }

  isUser(): boolean {
    return this.getUserRole() === 'USER';
  }

  canAssignTechnician(): boolean {
    return this.isAdmin();
  }

  canUpdateStatus(): boolean {
    return this.isAdmin() || this.isTechnician();
  }

  canCreateTicket(): boolean {
    return this.isAdmin() || this.isUser();
  }

  canComment(): boolean {
    return this.isAdmin() || this.isTechnician() || this.isUser();
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.roleKey);
  }
}