// src/app/app.ts
import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <!-- Toast Container -->
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast-{{toast.type}}">
          <span class="toast-icon">{{ toastIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.dismiss(toast.id)">✕</button>
        </div>
      }
    </div>
    <router-outlet />
  `,
  styles: []
})
export class App {
  readonly authService = inject(AuthService);
  readonly toastService = inject(ToastService);

  toastIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '', error: '', warning: '', info: ''
    };
    return icons[type] || '';
  }
}
