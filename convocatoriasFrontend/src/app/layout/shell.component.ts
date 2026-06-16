// src/app/layout/shell.component.ts
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Logo_de_la_Universidad_Surcolombiana.svg/200px-Logo_de_la_Universidad_Surcolombiana.svg.png"
                 alt="Logo USCO"
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
            <div style="display:none; width:44px; height:44px; background:rgba(255,255,255,0.2); border-radius:6px; align-items:center; justify-content:center; color:white; font-weight:700; font-size:1rem;">U</div>
            <div class="sidebar-logo-text">
              <span class="sidebar-logo-title">Convocatorias</span>
              <span class="sidebar-logo-subtitle">Universidad Surcolombiana</span>
            </div>
          </div>
        </div>

        @if (authService.currentUser()) {
          <div class="sidebar-user-info">
            <div class="sidebar-user-name">{{ authService.currentUser()!.name }}</div>
            <div class="sidebar-user-role">{{ authService.currentUser()!.email }}</div>
            <span class="role-badge {{ authService.currentUser()!.role.toLowerCase() }}">
              {{ authService.currentUser()!.role }}
            </span>
          </div>
        }

        <nav class="sidebar-nav">
          <div class="nav-section-label">Principal</div>
          @for (item of visibleNavItems(); track item.route) {
            <a class="nav-item"
               [routerLink]="item.route"
               routerLinkActive="active"
               (click)="closeSidebar()">
              <span style="font-size:1rem;">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button class="btn btn-ghost" style="width:100%; justify-content:flex-start;"
                  (click)="logout()">
            <span>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Topbar -->
        <header class="topbar">
          <div class="topbar-left">
            <button class="btn btn-ghost btn-icon" (click)="toggleSidebar()"
                    style="display:none;" id="sidebar-toggle">
              ☰
            </button>
            <div>
              <div class="topbar-title">Sistema de Convocatorias USCO</div>
              <div class="topbar-subtitle">Universidad Surcolombiana</div>
            </div>
          </div>
          <div class="topbar-right">
            @if (authService.currentUser()) {
              <span class="text-sm text-secondary">
                Bienvenido, <strong>{{ authService.currentUser()!.name }}</strong>
              </span>
            }
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet />
        </div>
      </div>
    </div>

    <!-- Mobile overlay -->
    @if (sidebarOpen()) {
      <div style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;"
           (click)="closeSidebar()"></div>
    }
  `,
})
export class ShellComponent {
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly sidebarOpen = signal(false);

  readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: '🏠', route: '/dashboard' },
    { label: 'Convocatorias', icon: '📋', route: '/convocatorias' },
    { label: 'Postulaciones', icon: '📝', route: '/postulaciones' },
    { label: 'Categorías', icon: '🏷️', route: '/categorias' },
    { label: 'Usuarios', icon: '👥', route: '/usuarios', roles: ['ADMINISTRADOR'] },
  ];

  readonly visibleNavItems = () => {
    const role = this.authService.currentUser()?.role;
    return this.allNavItems.filter(item => !item.roles || item.roles.includes(role ?? ''));
  };

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
