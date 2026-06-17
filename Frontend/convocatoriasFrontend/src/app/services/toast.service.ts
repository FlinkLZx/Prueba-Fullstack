// src/app/services/toast.service.ts
import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(type: Toast['type'], message: string, duration = 4000): void {
    const id = Math.random().toString(36).slice(2);
    this.toasts.update(t => [...t, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: string): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }

  success(msg: string) { this.show('success', msg); }
  error(msg: string) { this.show('error', msg, 6000); }
  warning(msg: string) { this.show('warning', msg); }
  info(msg: string) { this.show('info', msg); }
}
