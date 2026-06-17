// src/app/pages/dashboard/dashboard.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Convocatoria, Postulacion } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-left">
          <h1>Dashboard</h1>
          <p>Resumen general del sistema de convocatorias USCO</p>
        </div>
        @if (auth.isAdmin()) {
          <div class="page-header-actions">
            <a routerLink="/convocatorias" class="btn btn-primary">
              ➕ Nueva Convocatoria
            </a>
          </div>
        }
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-card-icon">📋</div>
          <div class="stat-card-value">{{ convocatorias().length }}</div>
          <div class="stat-card-label">Convocatorias totales</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">🟢</div>
          <div class="stat-card-value" style="color:var(--color-success);">{{ publicadas() }}</div>
          <div class="stat-card-label">Publicadas</div>
        </div>
        @if (auth.isAdmin()) {
          <div class="stat-card">
            <div class="stat-card-icon">📝</div>
            <div class="stat-card-value">{{ postulaciones().length }}</div>
            <div class="stat-card-label">Postulaciones recibidas</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon">✅</div>
            <div class="stat-card-value" style="color:var(--color-success);">{{ aprobadas() }}</div>
            <div class="stat-card-label">Postulaciones aprobadas</div>
          </div>
        }
        @if (auth.isEstudiante()) {
          <div class="stat-card">
            <div class="stat-card-icon">📬</div>
            <div class="stat-card-value">{{ postulaciones().length }}</div>
            <div class="stat-card-label">Mis postulaciones</div>
          </div>
        }
      </div>

      <!-- Convocatorias recientes -->
      <div class="card" style="margin-bottom: var(--spacing-xl);">
        <div class="card-header">
          <div class="card-title">
            <span>📋</span>
            Convocatorias activas
          </div>
          <a routerLink="/convocatorias" class="btn btn-secondary btn-sm">Ver todas</a>
        </div>
        <div class="card-body-compact">
          @if (loading()) {
            <div class="loading-spinner"><div class="spinner"></div></div>
          } @else if (convPublicadas().length === 0) {
            <div class="empty-state">
              <div class="empty-state-icon">📭</div>
              <h3>Sin convocatorias activas</h3>
              <p>No hay convocatorias publicadas en este momento.</p>
            </div>
          } @else {
            <div class="conv-grid" style="padding-top:0.5rem;">
              @for (conv of convPublicadas().slice(0, 6); track conv.id) {
                <div class="conv-card">
                  <div class="conv-card-header">
                    <div class="conv-card-title">{{ conv.nombre }}</div>
                    <div style="margin-top:8px;">
                      <span class="status-chip chip-success">PUBLICADA</span>
                    </div>
                  </div>
                  <div class="conv-card-body">
                    <p style="font-size:0.82rem; color:var(--color-text-secondary); line-height:1.5; flex:1;">
                      {{ conv.descripcion | slice:0:100 }}{{ conv.descripcion.length > 100 ? '...' : '' }}
                    </p>
                    <div class="conv-meta">
                      <span>📅</span>
                      <span>{{ conv.fechaInicio }} → {{ conv.fechaFin }}</span>
                    </div>
                    <div class="conv-meta">
                      <span>🪑</span>
                      <span>{{ conv.cuposDisponibles }} cupos disponibles</span>
                    </div>
                  </div>
                  <div class="conv-card-footer">
                    @if (auth.isEstudiante()) {
                      <span class="text-xs text-muted">ID: {{ conv.id }}</span>
                      <a routerLink="/postulaciones" class="btn btn-primary btn-sm">Postularse</a>
                    } @else {
                      <span class="text-xs text-muted">ID: {{ conv.id }}</span>
                      <a routerLink="/convocatorias" class="btn btn-secondary btn-sm">Ver detalles</a>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Postulaciones recientes (solo admin) -->
      @if (auth.isAdmin() && postulaciones().length > 0) {
        <div class="card">
          <div class="card-header">
            <div class="card-title">
              <span>📝</span>
              Postulaciones recientes
            </div>
            <a routerLink="/postulaciones" class="btn btn-secondary btn-sm">Ver todas</a>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Convocatoria</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                @for (p of postulaciones().slice(0, 5); track p.id) {
                  <tr>
                    <td class="td-mono">{{ p.id }}</td>
                    <td>{{ p.estudiante?.name || 'ID: ' + p.estudianteId }}</td>
                    <td>{{ p.convocatoria?.nombre || 'ID: ' + p.convocatoriaId }}</td>
                    <td><span class="status-chip {{ estadoChip(p.estado!) }}">{{ p.estado }}</span></td>
                    <td class="text-muted text-sm">{{ p.fechaPostulacion || '-' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  readonly auth = inject(AuthService);
  private api = inject(ApiService);

  convocatorias = signal<Convocatoria[]>([]);
  postulaciones = signal<Postulacion[]>([]);
  loading = signal(true);

  get publicadas() { return () => this.convocatorias().filter(c => c.estado === 'PUBLICADA').length; }
  get aprobadas() { return () => this.postulaciones().filter(p => p.estado === 'APROBADA').length; }
  get convPublicadas() { return () => this.convocatorias().filter(c => c.estado === 'PUBLICADA'); }

  estadoChip(estado: string): string {
    const map: Record<string, string> = {
      PUBLICADA: 'chip-success', BORRADOR: 'chip-warning', CERRADA: 'chip-default',
      APROBADA: 'chip-success', PENDIENTE: 'chip-warning', RECHAZADA: 'chip-error',
    };
    return map[estado] || 'chip-default';
  }

  async ngOnInit() {
    try {
      const [convs, posts] = await Promise.all([
        this.api.getConvocatorias(),
        this.auth.isAdmin() ? this.api.getPostulaciones() : Promise.resolve([]),
      ]);
      this.convocatorias.set(convs);
      this.postulaciones.set(posts);
    } catch {
      // silently ignore
    } finally {
      this.loading.set(false);
    }
  }
}
