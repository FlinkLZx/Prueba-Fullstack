// src/app/pages/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <!-- Left Brand Panel -->
      <div class="login-left">
        <div class="login-left-content">
          <div class="login-logo-wrapper">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Logo_de_la_Universidad_Surcolombiana.svg/200px-Logo_de_la_Universidad_Surcolombiana.svg.png"
                 alt="Logo Universidad Surcolombiana"
                 onerror="this.src=''; this.alt='USCO';">
          </div>
          <h1>Universidad Surcolombiana</h1>
          <p>Sistema de gestión de convocatorias institucionales. Plataforma oficial para el proceso de postulaciones académicas.</p>
          <div style="margin-top: 2rem; display:flex; flex-direction:column; gap:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.9); font-size:0.85rem;">
              Gestión de convocatorias
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.9); font-size:0.85rem;">
              Postulaciones en línea
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem; color:rgba(255,255,255,0.9); font-size:0.85rem;">
              Acceso seguro con JWT
            </div>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="login-right">
        <div class="login-form-container">
          <div style="margin-bottom:2rem;">
            <h2>Iniciar Sesión</h2>
            <p class="subtitle">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          @if (errorMsg()) {
            <div style="background:var(--color-error-bg); border:1px solid var(--color-error-light); border-radius:var(--radius-sm); padding:0.75rem 1rem; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:0.875rem; color:var(--color-error);">{{ errorMsg() }}</span>
            </div>
          }

          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="form-group">
              <label class="form-label required" for="email">Correo electrónico</label>
              <input id="email" name="email" type="email"
                     class="form-control"
                     [(ngModel)]="credentials.email"
                     placeholder="usuario@usco.edu.co"
                     required
                     [class.error]="loginForm.submitted && !credentials.email">
            </div>

            <div class="form-group">
              <label class="form-label required" for="password">Contraseña</label>
              <div style="position:relative;">
                <input id="password" name="password"
                       [type]="showPassword() ? 'text' : 'password'"
                       class="form-control"
                       [(ngModel)]="credentials.password"
                       placeholder="••••••••"
                       required
                       [class.error]="loginForm.submitted && !credentials.password"
                       style="padding-right:44px;">
                <button type="button"
                        (click)="showPassword.update(v => !v)"
                        style="position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--color-text-muted); font-size:0.75rem; padding:0; font-weight:600; text-transform:uppercase;">
                  {{ showPassword() ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg"
                    style="width:100%; justify-content:center; margin-top:0.5rem;"
                    [disabled]="loading()">
              @if (loading()) {
                <span style="width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;"></span>
                Iniciando sesión...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <div class="divider" style="margin:2rem 0;"></div>

          <div style="background:var(--color-surface-low); border:1px solid var(--color-border); border-radius:var(--radius-lg); padding:1rem;">
            <p style="font-size:0.75rem; font-weight:600; color:var(--color-text-secondary); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem;">
              Credenciales de prueba
            </p>
            @for (cred of testCredentials; track cred.email) {
              <button type="button" class="btn btn-ghost btn-sm"
                      style="width:100%; justify-content:flex-start; margin-bottom:4px; font-family:var(--font-mono); font-size:0.75rem;"
                      (click)="fillCredentials(cred.email, cred.password)">
                <span class="role-badge {{ cred.role.toLowerCase() }}" style="margin-right:6px;">{{ cred.role }}</span>
                {{ cred.email }}
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  credentials = { email: '', password: '' };
  loading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  testCredentials = [
    { email: 'admin@usco.edu.co', password: 'admin123', role: 'ADMINISTRADOR' },
    { email: 'docente@usco.edu.co', password: 'docente123', role: 'DOCENTE' },
    { email: 'estudiante@usco.edu.co', password: 'estudiante123', role: 'ESTUDIANTE' },
  ];

  fillCredentials(email: string, password: string): void {
    this.credentials = { email, password };
  }

  async onLogin(): Promise<void> {
    if (!this.credentials.email || !this.credentials.password) return;
    this.loading.set(true);
    this.errorMsg.set('');
    try {
      await this.auth.login(this.credentials);
      this.toast.success('Bienvenido al sistema USCO');
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.errorMsg.set(e.message || 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
