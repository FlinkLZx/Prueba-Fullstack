// src/app/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { LoginRequest, LoginResponse } from '../models/models';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<LoginResponse | null>(this.loadUser());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => !!this._currentUser());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMINISTRADOR');
  readonly isEstudiante = computed(() => this._currentUser()?.role === 'ESTUDIANTE');
  readonly isDocente = computed(() => this._currentUser()?.role === 'DOCENTE');

  private loadUser(): LoginResponse | null {
    try {
      const stored = localStorage.getItem('usco_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  async login(req: LoginRequest): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciales incorrectas');
    }
    const data: LoginResponse = await res.json();
    localStorage.setItem('usco_user', JSON.stringify(data));
    localStorage.setItem('usco_token', data.token);
    this._currentUser.set(data);
    return data;
  }

  logout(): void {
    localStorage.removeItem('usco_user');
    localStorage.removeItem('usco_token');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('usco_token');
  }
}
