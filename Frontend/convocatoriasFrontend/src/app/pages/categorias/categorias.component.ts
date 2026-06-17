// src/app/pages/categorias/categorias.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Categoria } from '../../models/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="page-header">
        <div class="page-header-left">
          <h1>Categorías</h1>
          <p>Clasifica las convocatorias por tipo: Investigación, Extensión, Bienestar, etc.</p>
        </div>
        @if (auth.isAdmin()) {
          <div class="page-header-actions">
            <button class="btn btn-primary" (click)="openCreate()">➕ Nueva Categoría</button>
          </div>
        }
      </div>

      <!-- Search -->
      <div class="toolbar">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input class="form-control search-input" type="text"
                 placeholder="Buscar categorías..."
                 [(ngModel)]="search" (ngModelChange)="onSearch()">
        </div>
      </div>

      <!-- Grid de categorías -->
      @if (loading()) {
        <div class="loading-spinner"><div class="spinner"></div></div>
      } @else if (filtered().length === 0) {
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">🏷️</div>
            <h3>Sin categorías</h3>
            <p>Crea la primera categoría para organizar las convocatorias.</p>
          </div>
        </div>
      } @else {
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          @for (cat of filtered(); track cat.id) {
            <div class="card" style="transition:all 0.2s;">
              <div class="card-body" style="display:flex; align-items:center; justify-content:space-between; padding:1.25rem 1.5rem;">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <div style="width:40px; height:40px; background:var(--color-primary-tint); border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0;">
                    🏷️
                  </div>
                  <div>
                    <div style="font-family:var(--font-display); font-weight:600; color:var(--color-on-surface);">{{ cat.nombre }}</div>
                    <div class="td-mono" style="font-size:0.7rem; color:var(--color-primary); margin-top:2px;">ID: {{ cat.id }}</div>
                  </div>
                </div>
                @if (auth.isAdmin()) {
                  <div style="display:flex; gap:4px;">
                    <button class="btn btn-ghost btn-sm btn-icon" title="Editar" (click)="openEdit(cat)">✏️</button>
                    <button class="btn btn-ghost btn-sm btn-icon" title="Eliminar" (click)="confirmDelete(cat)">🗑️</button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Stats card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title"><span>📊</span> Resumen</div>
        </div>
        <div class="card-body" style="display:flex; gap:2rem;">
          <div>
            <div style="font-size:2rem; font-weight:700; color:var(--color-primary); font-family:var(--font-display);">{{ categorias().length }}</div>
            <div class="text-sm text-secondary">Categorías creadas</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" style="max-width:440px;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">{{ editingId() ? '✏️ Editar Categoría' : '➕ Nueva Categoría' }}</span>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label class="form-label required" for="cNombre">Nombre de la categoría</label>
                <input id="cNombre" name="nombre" type="text" class="form-control"
                       [(ngModel)]="formNombre"
                       placeholder="Ej: Investigación Científica"
                       required autofocus>
                <div class="form-hint">Sé descriptivo: Investigación, Extensión, Bienestar, etc.</div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving() || !formNombre.trim()">
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
        <div class="modal" style="max-width:400px;" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">⚠️ Confirmar eliminación</span>
            <button class="modal-close" (click)="showConfirm.set(false)">✕</button>
          </div>
          <div class="modal-body">
            <div class="confirm-dialog">
              <div class="confirm-icon">🗑️</div>
              <div class="confirm-title">¿Eliminar categoría?</div>
              <div class="confirm-message">
                Se eliminará <strong>"{{ deleteTarget()?.nombre }}"</strong>. Esta acción podría afectar convocatorias asociadas.
              </div>
              <div class="confirm-actions">
                <button class="btn btn-ghost" (click)="showConfirm.set(false)">Cancelar</button>
                <button class="btn btn-danger" (click)="deleteCategoria()" [disabled]="saving()">
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
export class CategoriasComponent implements OnInit {
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showConfirm = signal(false);
  editingId = signal<number | null>(null);
  deleteTarget = signal<Categoria | null>(null);
  search = '';
  formNombre = '';
  private _filtered = signal<Categoria[]>([]);
  readonly filtered = this._filtered.asReadonly();

  async ngOnInit() { await this.load(); }

  async load() {
    this.loading.set(true);
    try {
      const data = await this.api.getCategorias();
      this.categorias.set(data);
      this.onSearch();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.loading.set(false); }
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this._filtered.set(q ? this.categorias().filter(c => c.nombre.toLowerCase().includes(q)) : [...this.categorias()]);
  }

  openCreate() { this.formNombre = ''; this.editingId.set(null); this.showModal.set(true); }
  openEdit(c: Categoria) { this.formNombre = c.nombre; this.editingId.set(c.id!); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  async save() {
    if (!this.formNombre.trim()) return;
    this.saving.set(true);
    try {
      const dto: Categoria = { nombre: this.formNombre.trim() };
      if (this.editingId()) {
        await this.api.updateCategoria(this.editingId()!, dto);
        this.toast.success('Categoría actualizada');
      } else {
        await this.api.createCategoria(dto);
        this.toast.success('Categoría creada');
      }
      this.closeModal();
      await this.load();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.saving.set(false); }
  }

  confirmDelete(c: Categoria) { this.deleteTarget.set(c); this.showConfirm.set(true); }

  async deleteCategoria() {
    if (!this.deleteTarget()) return;
    this.saving.set(true);
    try {
      await this.api.deleteCategoria(this.deleteTarget()!.id!);
      this.toast.success('Categoría eliminada');
      this.showConfirm.set(false);
      await this.load();
    } catch (e: any) { this.toast.error(e.message); }
    finally { this.saving.set(false); }
  }
}
