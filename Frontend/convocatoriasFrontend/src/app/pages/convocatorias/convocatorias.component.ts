// src/app/pages/convocatorias/convocatorias.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Convocatoria, Categoria } from '../../models/models';

const EMPTY_CONV = (): Convocatoria => ({
  nombre: '', descripcion: '', fechaInicio: '', fechaFin: '',
  cuposDisponibles: 10, estado: 'BORRADOR', categoriaIds: []
});

@Component({
  selector: 'app-convocatorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="page-header">
        <div class="page-header-left">
          <h1>Convocatorias</h1>
          <p>Gestiona las convocatorias académicas de la Universidad Surcolombiana.</p>
        </div>
        @if (auth.isAdmin()) {
          <div class="page-header-actions">
            <button class="btn btn-secondary" (click)="toggleView()">
              {{ viewMode() === 'cards' ? '📋 Vista tabla' : '🃏 Vista tarjetas' }}
            </button>
            <button class="btn btn-primary" (click)="openCreate()">➕ Nueva Convocatoria</button>
          </div>
        }
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input class="form-control search-input" type="text"
                 placeholder="Buscar convocatorias..."
                 [(ngModel)]="search" (ngModelChange)="onSearch()">
        </div>
        <select class="form-control" style="width:auto;" [(ngModel)]="filterEstado" (ngModelChange)="onSearch()">
          <option value="">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="PUBLICADA">Publicada</option>
          <option value="CERRADA">Cerrada</option>
        </select>
      </div>

      <!-- Stats row -->
      <div class="stats-grid" style="margin-bottom:1.5rem;">
        <div class="stat-card">
          <div class="stat-card-value">{{ convocatorias().length }}</div>
          <div class="stat-card-label">Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color:var(--color-warning);">
            {{ count('BORRADOR') }}
          </div>
          <div class="stat-card-label">Borrador</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color:var(--color-success);">
            {{ count('PUBLICADA') }}
          </div>
          <div class="stat-card-label">Publicadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value" style="color:var(--color-text-muted);">
            {{ count('CERRADA') }}
          </div>
          <div class="stat-card-label">Cerradas</div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-spinner"><div class="spinner"></div></div>
      } @else if (filtered().length === 0) {
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h3>Sin convocatorias</h3>
            <p>No hay convocatorias que coincidan con los filtros.</p>
          </div>
        </div>
      } @else if (viewMode() === 'cards') {
        <!-- Cards view -->
        <div class="conv-grid">
          @for (conv of filtered(); track conv.id) {
            <div class="conv-card">
              <div class="conv-card-header" [style.background]="convHeaderColor(conv.estado)">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                  <div class="conv-card-title">{{ conv.nombre }}</div>
                  <span class="status-chip {{ estadoChip(conv.estado) }}" style="flex-shrink:0;">{{ conv.estado }}</span>
                </div>
              </div>
              <div class="conv-card-body">
                <p style="font-size:0.82rem; color:var(--color-text-secondary); line-height:1.5; flex:1;">
                  {{ conv.descripcion | slice:0:120 }}{{ conv.descripcion.length > 120 ? '...' : '' }}
                </p>
                <div class="conv-meta">
                  <span>📅</span>
                  <span>{{ conv.fechaInicio }} → {{ conv.fechaFin }}</span>
                </div>
                <div class="conv-meta">
                  <span>🪑</span>
                  <span><strong>{{ conv.cuposDisponibles }}</strong> cupos disponibles</span>
                </div>
                @if (conv.categorias && conv.categorias.length > 0) {
                  <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                    @for (cat of conv.categorias; track cat.id) {
                      <span style="background:var(--color-primary-tint); color:var(--color-primary); padding:2px 8px; border-radius:var(--radius-full); font-size:0.7rem; font-weight:500;">
                        {{ cat.nombre }}
                      </span>
                    }
                  </div>
                }
              </div>
              <div class="conv-card-footer">
                <span class="td-mono" style="font-size:0.7rem;">ID: {{ conv.id }}</span>
                @if (auth.isAdmin()) {
                  <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary btn-sm" (click)="openEdit(conv)">✏️ Editar</button>
                    <button class="btn btn-ghost btn-sm btn-icon" (click)="confirmDelete(conv)">🗑️</button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Table view -->
        <div class="card">
          <div class="card-header">
            <div class="card-title"><span>📋</span> Lista de convocatorias</div>
            <span class="text-sm text-muted">{{ filtered().length }} convocatorias</span>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Cupos</th>
                  <th>Categorías</th>
                  @if (auth.isAdmin()) { <th>Acciones</th> }
                </tr>
              </thead>
              <tbody>
                @for (conv of filtered(); track conv.id) {
                  <tr>
                    <td class="td-mono">{{ conv.id }}</td>
                    <td style="font-weight:500; max-width:220px;">
                      <span style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ conv.nombre }}</span>
                    </td>
                    <td><span class="status-chip {{ estadoChip(conv.estado) }}">{{ conv.estado }}</span></td>
                    <td class="text-sm text-secondary">{{ conv.fechaInicio }}</td>
                    <td class="text-sm text-secondary">{{ conv.fechaFin }}</td>
                    <td style="font-weight:600; color:var(--color-primary);">{{ conv.cuposDisponibles }}</td>
                    <td>
                      @if (conv.categorias?.length) {
                        <div style="display:flex; flex-wrap:wrap; gap:3px;">
                          @for (cat of conv.categorias!.slice(0,2); track cat.id) {
                            <span style="background:var(--color-primary-tint); color:var(--color-primary); padding:1px 6px; border-radius:var(--radius-full); font-size:0.65rem; font-weight:500;">
                              {{ cat.nombre }}
                            </span>
                          }
                        </div>
                      } @else { <span class="text-muted text-xs">—</span> }
                    </td>
                    @if (auth.isAdmin()) {
                      <td>
                        <div style="display:flex; gap:4px;">
                          <button class="btn btn-ghost btn-sm btn-icon" (click)="openEdit(conv)">✏️</button>
                          <button class="btn btn-ghost btn-sm btn-icon" (click)="confirmDelete(conv)">🗑️</button>
                        </div>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>

    <!-- Create/Edit Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">{{ editingId() ? '✏️ Editar Convocatoria' : '➕ Nueva Convocatoria' }}</span>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label class="form-label required" for="cNombre">Nombre</label>
                <input id="cNombre" name="nombre" type="text" class="form-control"
                       [(ngModel)]="form.nombre" placeholder="Ej: Convocatoria Investigación 2025-I" required>
              </div>
              <div class="form-group">
                <label class="form-label required" for="cDesc">Descripción</label>
                <textarea id="cDesc" name="descripcion" class="form-control"
                          [(ngModel)]="form.descripcion"
                          placeholder="Describe los objetivos, requisitos y beneficios de la convocatoria..."
                          rows="3" required style="resize:vertical;"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="cFI">Fecha de inicio</label>
                  <input id="cFI" name="fechaInicio" type="date" class="form-control"
                         [(ngModel)]="form.fechaInicio" required>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="cFF">Fecha de fin</label>
                  <input id="cFF" name="fechaFin" type="date" class="form-control"
                         [(ngModel)]="form.fechaFin" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="cCupos">Cupos disponibles</label>
                  <input id="cCupos" name="cuposDisponibles" type="number" class="form-control"
                         [(ngModel)]="form.cuposDisponibles" min="1" required>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="cEstado">Estado</label>
                  <select id="cEstado" name="estado" class="form-control" [(ngModel)]="form.estado" required>
                    <option value="BORRADOR">Borrador</option>
                    <option value="PUBLICADA">Publicada</option>
                    <option value="CERRADA">Cerrada</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="cCats">Categorías</label>
                <div style="display:flex; flex-wrap:wrap; gap:8px; padding:12px; border:1px solid var(--color-border); border-radius:var(--radius-sm); min-height:44px;">
                  @for (cat of categorias(); track cat.id) {
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 10px; border-radius:var(--radius-full); border:1px solid var(--color-border); transition:all 0.15s;"
                           [style.background]="form.categoriaIds!.includes(cat.id!) ? 'var(--color-primary)' : 'transparent'"
                           [style.color]="form.categoriaIds!.includes(cat.id!) ? 'white' : 'var(--color-text-primary)'"
                           [style.border-color]="form.categoriaIds!.includes(cat.id!) ? 'var(--color-primary)' : 'var(--color-border)'">
                      <input type="checkbox" style="display:none;"
                             [checked]="form.categoriaIds!.includes(cat.id!)"
                             (change)="toggleCategoria(cat.id!)">
                      <span style="font-size:0.8rem; font-weight:500;">{{ cat.nombre }}</span>
                    </label>
                  }
                  @if (categorias().length === 0) {
                    <span class="text-muted text-sm">No hay categorías disponibles. Crea una primero.</span>
                  }
                </div>
                <div class="form-hint">Haz clic para seleccionar/deseleccionar categorías (opcional)</div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) { Guardando... } @else { 💾 Guardar }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }

    <!-- Confirm Delete Modal -->
    @if (showConfirm()) {
      <div class="modal-overlay" (click)="showConfirm.set(false)">
        <div class="modal" style="max-width:420px;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">⚠️ Confirmar eliminación</span>
            <button class="modal-close" (click)="showConfirm.set(false)">✕</button>
          </div>
          <div class="modal-body">
            <div class="confirm-dialog">
              <div class="confirm-icon">🗑️</div>
              <div class="confirm-title">¿Eliminar convocatoria?</div>
              <div class="confirm-message">Se eliminará <strong>"{{ deleteTarget()?.nombre }}"</strong> y todas sus postulaciones asociadas.</div>
              <div class="confirm-actions">
                <button class="btn btn-ghost" (click)="showConfirm.set(false)">Cancelar</button>
                <button class="btn btn-danger" (click)="deleteConvocatoria()" [disabled]="saving()">
                  @if (saving()) { Eliminando... } @else { 🗑️ Eliminar }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConvocatoriasComponent implements OnInit {
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  convocatorias = signal<Convocatoria[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showConfirm = signal(false);
  editingId = signal<number | null>(null);
  deleteTarget = signal<Convocatoria | null>(null);
  viewMode = signal<'cards' | 'table'>('cards');
  search = '';
  filterEstado = '';
  form: Convocatoria = EMPTY_CONV();
  private _filtered = signal<Convocatoria[]>([]);
  readonly filtered = this._filtered.asReadonly();

  count(estado: string) { return this.convocatorias().filter(c => c.estado === estado).length; }

  estadoChip(estado: string): string {
    const map: Record<string, string> = { PUBLICADA: 'chip-success', BORRADOR: 'chip-warning', CERRADA: 'chip-default' };
    return map[estado] || 'chip-default';
  }

  convHeaderColor(estado: string): string {
    const map: Record<string, string> = {
      PUBLICADA: 'var(--color-primary)',
      BORRADOR: '#b8860b',
      CERRADA: 'var(--color-secondary)',
    };
    return map[estado] || 'var(--color-primary)';
  }

  toggleView() { this.viewMode.update(v => v === 'cards' ? 'table' : 'cards'); }

  async ngOnInit() {
    await Promise.all([this.load(), this.loadCategorias()]);
  }

  async load() {
    this.loading.set(true);
    try {
      const data = await this.api.getConvocatorias();
      this.convocatorias.set(data);
      this.onSearch();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.loading.set(false); }
  }

  async loadCategorias() {
    try { this.categorias.set(await this.api.getCategorias()); } catch {}
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this._filtered.set(this.convocatorias().filter(c =>
      (!q || c.nombre.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q)) &&
      (!this.filterEstado || c.estado === this.filterEstado)
    ));
  }

  openCreate() { this.form = EMPTY_CONV(); this.editingId.set(null); this.showModal.set(true); }
  openEdit(c: Convocatoria) {
    this.form = {
      ...c,
      categoriaIds: c.categorias?.map(cat => cat.id!) ?? c.categoriaIds ?? []
    };
    this.editingId.set(c.id!);
    this.showModal.set(true);
  }
  closeModal() { this.showModal.set(false); }

  toggleCategoria(id: number) {
    const ids = this.form.categoriaIds!;
    const idx = ids.indexOf(id);
    if (idx >= 0) ids.splice(idx, 1);
    else ids.push(id);
  }

  async save() {
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      if (!payload.categoriaIds?.length) delete payload.categoriaIds;
      if (this.editingId()) {
        await this.api.updateConvocatoria(this.editingId()!, payload);
        this.toast.success('Convocatoria actualizada');
      } else {
        await this.api.createConvocatoria(payload);
        this.toast.success('Convocatoria creada');
      }
      this.closeModal();
      await this.load();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.saving.set(false); }
  }

  confirmDelete(c: Convocatoria) { this.deleteTarget.set(c); this.showConfirm.set(true); }

  async deleteConvocatoria() {
    if (!this.deleteTarget()) return;
    this.saving.set(true);
    try {
      await this.api.deleteConvocatoria(this.deleteTarget()!.id!);
      this.toast.success('Convocatoria eliminada');
      this.showConfirm.set(false);
      await this.load();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.saving.set(false); }
  }
}
