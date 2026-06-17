// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import {
  Usuario,
  Categoria,
  Convocatoria,
  Postulacion,
  CambioEstadoPostulacion
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

  // ===================== USUARIOS =====================

  async getUsuarios(): Promise<Usuario[]> {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Usuario[]>(res);
  }

  async createUsuario(u: Usuario): Promise<Usuario> {
    const res = await fetch(`${API_BASE}/api/usuarios`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(u)
    });

    return this.handleResponse<Usuario>(res);
  }

  async updateUsuario(id: number, u: Usuario): Promise<Usuario> {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(u)
    });

    return this.handleResponse<Usuario>(res);
  }

  async deleteUsuario(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/usuarios/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  // ===================== CATEGORIAS =====================

  async getCategorias(): Promise<Categoria[]> {
    const res = await fetch(`${API_BASE}/api/categorias`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Categoria[]>(res);
  }

  async getCategoriaById(id: number): Promise<Categoria> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Categoria>(res);
  }

  async createCategoria(c: Categoria): Promise<Categoria> {
    const res = await fetch(`${API_BASE}/api/categorias`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Categoria>(res);
  }

  async updateCategoria(id: number, c: Categoria): Promise<Categoria> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Categoria>(res);
  }

  async deleteCategoria(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/categorias/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  // ===================== CONVOCATORIAS =====================

  async getConvocatorias(): Promise<Convocatoria[]> {
    const res = await fetch(`${API_BASE}/api/convocatorias`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Convocatoria[]>(res);
  }

  async getConvocatoriaById(id: number): Promise<Convocatoria> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Convocatoria>(res);
  }

  async createConvocatoria(c: Convocatoria): Promise<Convocatoria> {
    const res = await fetch(`${API_BASE}/api/convocatorias`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Convocatoria>(res);
  }

  async updateConvocatoria(id: number, c: Convocatoria): Promise<Convocatoria> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(c)
    });

    return this.handleResponse<Convocatoria>(res);
  }

  async deleteConvocatoria(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/convocatorias/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleVoidResponse(res);
  }

  // ===================== POSTULACIONES =====================

  async getPostulaciones(): Promise<Postulacion[]> {
    const res = await fetch(`${API_BASE}/api/postulaciones`, {
      headers: this.getHeaders()
    });

    return this.handleResponse<Postulacion[]>(res);
  }

  async createPostulacion(
    p: { estudianteId: number; convocatoriaId: number }
  ): Promise<Postulacion> {

    const res = await fetch(`${API_BASE}/api/postulaciones`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(p)
    });

    return this.handleResponse<Postulacion>(res);
  }

  async cambiarEstadoPostulacion(
    id: number,
    dto: CambioEstadoPostulacion
  ): Promise<Postulacion> {

    const res = await fetch(
      `${API_BASE}/api/postulaciones/${id}/estado`,
      {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(dto)
      }
    );

    return this.handleResponse<Postulacion>(res);
  }
}

