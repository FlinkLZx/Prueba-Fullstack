// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  User,
  Category,
  Convocation,
  Postulation,
  ChangeStatusPostulation
} from '../models/models';

const API_BASE = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private auth: AuthService) { }

  private getHeaders(includeContent = false): HeadersInit {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.auth.getToken()}`
    };

    if (includeContent) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(
        err.message ||
        err.error ||
        `Error ${res.status}: ${res.statusText}`
      );
    }

    return await res.json() as T;
  }

  private async handleVoidResponse(res: Response): Promise<void> {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(
        err.message ||
        err.error ||
        `Error ${res.status}: ${res.statusText}`
      );
    }
  }

  async getUser(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<User[]>(res);
  }

  async createUser(u: User): Promise<User> {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(u)
    });

    return this.handleResponse<User>(res);
  }

  async updateUser(id: number, u: User): Promise<User> {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(u)
    });

    return this.handleResponse<User>(res);
  }

  async deleteUser(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  async getCategory(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/api/categorias`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Category[]>(res);
  }

  async getCategoryById(id: number): Promise<Category> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Category>(res);
  }

  async createCategory(c: Category): Promise<Category> {
    const res = await fetch(`${API_BASE}/api/categorias`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Category>(res);
  }

  async updateCategory(id: number, c: Category): Promise<Category> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Category>(res);
  }

  async deleteCategory(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  async getConvocations(): Promise<Convocation[]> {
    const res = await fetch(`${API_BASE}/api/convocatorias`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Convocation[]>(res);
  }

  async getConvocationById(id: number): Promise<Convocation> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Convocation>(res);
  }

  async createConvocation(c: Convocation): Promise<Convocation> {
    const res = await fetch(`${API_BASE}/api/convocatorias`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Convocation>(res);
  }

  async updateConvocation(id: number, c: Convocation): Promise<Convocation> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Convocation>(res);
  }

  async deleteConvocation(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  async getPostulation(): Promise<Postulation[]> {
    const res = await fetch(`${API_BASE}/api/postulaciones`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Postulation[]>(res);
  }

  async createPostulation(
    p: { estudianteId: number; ConvocationId: number }
  ): Promise<Postulation> {

    const res = await fetch(`${API_BASE}/api/postulaciones`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(p)
    });

    return this.handleResponse<Postulation>(res);
  }

  async changeStatusPostulation(
    id: number,
    dto: ChangeStatusPostulation
  ): Promise<Postulation> {

    const res = await fetch(
      `${API_BASE}/api/postulaciones/${id}/estado`,
      {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(dto)
      }
    );

    return this.handleResponse<Postulation>(res);
  }
}

