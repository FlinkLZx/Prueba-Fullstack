// src/app/layout/shell.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Logo_de_la_Universidad_Surcolombiana.svg/200px-Logo_de_la_Universidad_Surcolombiana.svg.png"
                 alt="USCO Logo"
                 onerror="this.src=''; this.alt='USCO';">
            <div class="sidebar-logo-text">
              <span class="sidebar-logo-title">USCO</span>
              <span class="sidebar-logo-subtitle">Convocatorias</span>
            </div>
          </div>
        </div>

        <!-- User profile section -->
        <div class="sidebar-user-info" *ngIf="auth.currentUser() as user">
          <div class="sidebar-user-name">{{ user.name }}</div>
          <div class="sidebar-user-role">
            <span class="role-badge {{ user.role.toLowerCase() }}">{{ user.role }}</span>
          </div>
        </div>

        <!-- Navigation items -->
        <nav class="sidebar-nav">
          <div class="nav-section-label">General</div>
          <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
            Dashboard
          </a>
          <a class="nav-item" routerLink="/convocatorias" routerLinkActive="active">
            Convocatorias
          </a>
          <a class="nav-item" routerLink="/categorias" routerLinkActive="active">
            Categorías
          </a>
          
          <ng-container *ngIf="auth.isAdmin()">
            <div class="nav-section-label">Administración</div>
            <a class="nav-item" routerLink="/usuarios" routerLinkActive="active">
              Usuarios
            </a>
          </ng-container>
        </nav>

        <!-- Sidebar footer with logout -->
        <div class="sidebar-footer">
          <button class="btn btn-ghost" style="width:100%; justify-content:flex-start;" (click)="onLogout()">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main content panel -->
      <div class="main-content">
        <!-- Top bar -->
        <header class="topbar">
          <div class="topbar-left">
            <span class="topbar-title">Universidad Surcolombiana</span>
            <span class="topbar-subtitle">Convocatorias USCO</span>
          </div>
          <div class="topbar-right" *ngIf="auth.currentUser() as user">
            <span style="font-size: 0.85rem; color: var(--color-text-secondary);">
              Sesión activa: <strong>{{ user.email }}</strong>
            </span>
          </div>
        </header>

        <!-- Page body -->
        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
