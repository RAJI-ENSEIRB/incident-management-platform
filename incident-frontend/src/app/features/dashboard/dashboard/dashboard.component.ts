import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Ticket } from '../../../core/models/ticket.model';
import { PagedResponse } from '../../../core/models/paged-response.model';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
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
  mediumCount = 0;
  lowCount = 0;

  unassignedCount = 0;

  private statusChart: Chart | null = null;
  private priorityChart: Chart | null = null;
  private viewInitialized = false;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.tryRenderCharts();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets(0, 1000).subscribe({
      next: (response: PagedResponse<Ticket>) => {
        this.tickets = response.content;
        this.computeStats();
        this.isLoading = false;
        this.tryRenderCharts();
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

    this.lowCount = this.tickets.filter(ticket => ticket.priority === 'LOW').length;
    this.mediumCount = this.tickets.filter(ticket => ticket.priority === 'MEDIUM').length;
    this.highCount = this.tickets.filter(ticket => ticket.priority === 'HIGH').length;
    this.criticalCount = this.tickets.filter(ticket => ticket.priority === 'CRITICAL').length;

    this.unassignedCount = this.tickets.filter(ticket => !ticket.assignedTechnicianEmail).length;
  }

  tryRenderCharts(): void {
    if (!this.viewInitialized || this.isLoading || this.errorMessage) {
      return;
    }

    this.renderStatusChart();
    this.renderPriorityChart();
  }

  renderStatusChart(): void {
    const canvas = document.getElementById('statusChart') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    this.statusChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['OPEN', 'IN_PROGRESS', 'WAITING', 'RESOLVED', 'CLOSED'],
        datasets: [
          {
            label: 'Tickets by status',
            data: [
              this.openCount,
              this.inProgressCount,
              this.waitingCount,
              this.resolvedCount,
              this.closedCount
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderPriorityChart(): void {
    const canvas = document.getElementById('priorityChart') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }

    if (this.priorityChart) {
      this.priorityChart.destroy();
    }

    this.priorityChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        datasets: [
          {
            label: 'Tickets by priority',
            data: [
              this.lowCount,
              this.mediumCount,
              this.highCount,
              this.criticalCount
            ]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  destroyCharts(): void {
    if (this.statusChart) {
      this.statusChart.destroy();
      this.statusChart = null;
    }

    if (this.priorityChart) {
      this.priorityChart.destroy();
      this.priorityChart = null;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTickets(): void {
    this.router.navigate(['/tickets']);
  }
}