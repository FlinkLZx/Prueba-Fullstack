import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Convocation, Category } from '../../models/models';

const EMPTY_CONV = (): Convocation => ({
  name: '', description: '', startDate: '', finishDate: '',
  spotsAvailable: 10, status: 'BORRADOR', categoryIds: []
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
              {{ viewMode() === 'cards' ? 'Vista tabla' : 'Vista tarjetas' }}
            </button>
            <button class="btn btn-primary" (click)="openCreate()">Nueva Convocation</button>
          </div>
        }
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-input-wrapper">
          <span class="search-icon"></span>
          <input class="form-control search-input" type="text"
                 placeholder="Buscar convocatorias..."
                 [(ngModel)]="search" (ngModelChange)="onSearch()">
        </div>
        <select class="form-control" style="width:auto;" [(ngModel)]="filterstatus" (ngModelChange)="onSearch()">
          <option value="">Todos los statuss</option>
          <option value="BORRADOR">Borrador</option>
          <option value="PUBLICADA">Publicada</option>
          <option value="CERRADA">Cerrada</option>
        </select>
      </div>

      <!-- Stats row -->
      <div class="stats-grid" style="margin-bottom:1.5rem;">
        <div class="stat-card">
          <div class="stat-card-value">{{ convocation().length }}</div>
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
            <div class="empty-state-icon"></div>
            <h3>Sin convocatorias</h3>
            <p>No hay convocatorias que coincidan con los filtros.</p>
          </div>
        </div>
      } @else if (viewMode() === 'cards') {
        <!-- Cards view -->
        <div class="conv-grid">
          @for (conv of filtered(); track conv.id) {
            <div class="conv-card">
              <div class="conv-card-header" [style.background]="convHeaderColor(conv.status)">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                  <div class="conv-card-title">{{ conv.name }}</div>
                  <span class="status-chip {{ statusChip(conv.status) }}" style="flex-shrink:0;">{{ conv.status }}</span>
                </div>
              </div>
              <div class="conv-card-body">
                <p style="font-size:0.82rem; color:var(--color-text-secondary); line-height:1.5; flex:1;">
                  {{ conv.description | slice:0:120 }}{{ conv.description.length > 120 ? '...' : '' }}
                </p>
                <div class="conv-meta">
                  <span>{{ conv.startDate }} → {{ conv.finishDate }}</span>
                </div>
                <div class="conv-meta">
                  <span><strong>{{ conv.slotsAvailable }}</strong> cupos disponibles</span>
                </div>
                @if (conv.categories && conv.categories.length > 0) {
                  <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                    @for (cat of conv.categories; track cat.id) {
                      <span style="background:var(--color-primary-tint); color:var(--color-primary); padding:2px 8px; border-radius:var(--radius-full); font-size:0.7rem; font-weight:500;">
                        {{ cat.name }}
                      </span>
                    }
                  </div>
                }
              </div>
              <div class="conv-card-footer">
                <span class="td-mono" style="font-size:0.7rem;">ID: {{ conv.id }}</span>
                @if (auth.isAdmin()) {
                  <div style="display:flex; gap:6px;">
                    <button class="btn btn-secondary btn-sm" (click)="openEdit(conv)">Editar</button>
                    <button class="btn btn-ghost btn-sm" (click)="confirmDelete(conv)">Eliminar</button>
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
            <div class="card-title">Lista de convocatorias</div>
            <span class="text-sm text-muted">{{ filtered().length }} convocatorias</span>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>name</th>
                  <th>status</th>
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
                      <span style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ conv.name }}</span>
                    </td>
                    <td><span class="status-chip {{ statusChip(conv.status) }}">{{ conv.status }}</span></td>
                    <td class="text-sm text-secondary">{{ conv.startDate }}</td>
                    <td class="text-sm text-secondary">{{ conv.finishDate }}</td>
                    <td style="font-weight:600; color:var(--color-primary);">{{ conv.slotsAvailable }}</td>
                    <td>
                      @if (conv.categories?.length) {
                        <div style="display:flex; flex-wrap:wrap; gap:3px;">
                          @for (cat of conv.categories!.slice(0,2); track cat.id) {
                            <span style="background:var(--color-primary-tint); color:var(--color-primary); padding:1px 6px; border-radius:var(--radius-full); font-size:0.65rem; font-weight:500;">
                              {{ cat.name }}
                            </span>
                          }
                        </div>
                      } @else { <span class="text-muted text-xs">—</span> }
                    </td>
                    @if (auth.isAdmin()) {
                      <td>
                        <div style="display:flex; gap:4px;">
                          <button class="btn btn-ghost btn-sm" (click)="openEdit(conv)">Editar</button>
                          <button class="btn btn-ghost btn-sm" (click)="confirmDelete(conv)">Eliminar</button>
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
            <span class="modal-title">{{ editingId() ? 'Editar Convocation' : 'Nueva Convocation' }}</span>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="save()">
              <div class="form-group">
                <label class="form-label required" for="cname">name</label>
                <input id="cname" name="name" type="text" class="form-control"
                       [(ngModel)]="form.name" placeholder="Ej: Convocation Investigación 2025-I" required>
              </div>
              <div class="form-group">
                <label class="form-label required" for="cDesc">Descripción</label>
                <textarea id="cDesc" name="tdescription" class="form-control"
                          [(ngModel)]="form.description"
                          placeholder="Describe los objetivos, requisitos y beneficios de la convocatoria..."
                          rows="3" required style="resize:vertical;">
                </textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="cFI">Fecha de inicio</label>
                  <input id="cFI" name="startDate" type="date" class="form-control"
                         [(ngModel)]="form.startDate" required>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="cFF">Fecha de fin</label>
                  <input id="cFF" name="finishDate" type="date" class="form-control"
                         [(ngModel)]="form.finishDate" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="cCupos">Cupos disponibles</label>
                  <input id="cCupos" name="slotsAvailable" type="number" class="form-control"
                         [(ngModel)]="form.slotsAvailable" min="1" required>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="cstatus">status</label>
                  <select id="cstatus" name="status" class="form-control" [(ngModel)]="form.status" required>
                    <option value="BORRADOR">Borrador</option>
                    <option value="PUBLICADA">Publicada</option>
                    <option value="CERRADA">Cerrada</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="cCats">Categorías</label>
                <div style="display:flex; flex-wrap:wrap; gap:8px; padding:12px; border:1px solid var(--color-border); border-radius:var(--radius-sm); min-height:44px;">
                  @for (cat of categories(); track cat.id) {
                    <label style="display:flex; align-items:center; gap:6px; cursor:pointer; padding:4px 10px; border-radius:var(--radius-full); border:1px solid var(--color-border); transition:all 0.15s;"
                           [style.background]="form!.categoryIds?.includes(cat.id!) ? 'var(--color-primary)' : 'transparent'"
                           [style.color]="form!.categoryIds?.includes(cat.id!) ? 'white' : 'var(--color-text-primary)'"
                           [style.border-color]="form!.categoryIds?.includes(cat.id!) ? 'var(--color-primary)' : 'var(--color-border)'">
                      <input type="checkbox" style="display:none;"
                             [checked]="form!.categoryIds?.includes(cat.id!)"
                             (change)="toggleCategory(cat.id!)">
                      <span style="font-size:0.8rem; font-weight:500;">{{ cat.name }}</span>
                    </label>
                  }
                  @if (categories().length === 0) {
                    <span class="text-muted text-sm">No hay categorías disponibles. Crea una primero.</span>
                  }
                </div>
                <div class="form-hint">Haz clic para seleccionar/deseleccionar categorías (opcional)</div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-ghost" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) { Guardando... } @else { Guardar }
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
            <span class="modal-title">Confirmar eliminación</span>
            <button class="modal-close" (click)="showConfirm.set(false)">✕</button>
          </div>
          <div class="modal-body">
            <div class="confirm-dialog">
              <div class="confirm-icon"></div>
              <div class="confirm-title">¿Eliminar convocatoria?</div>
              <div class="confirm-message">Se eliminará <strong>"{{ deleteTarget()?.name }}"</strong> y todas sus postulaciones asociadas.</div>
              <div class="confirm-actions">
                <button class="btn btn-ghost" (click)="showConfirm.set(false)">Cancelar</button>
                <button class="btn btn-danger" (click)="deleteConvocatoria()" [disabled]="saving()">
                  @if (saving()) { Eliminando... } @else { Eliminar }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConvocationsComponent implements OnInit {
  readonly auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

  convocation = signal<Convocation[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showConfirm = signal(false);
  editingId = signal<number | null>(null);
  deleteTarget = signal<Convocation | null>(null);
  viewMode = signal<'cards' | 'table'>('cards');
  search = '';
  filterstatus = '';

  form: Convocation = EMPTY_CONV();

  private _filtered = signal<Convocation[]>([]);
  readonly filtered = this._filtered.asReadonly();

  count(status: string) {
    return this.convocation().filter(c => c.status === status).length;
  }

  statusChip(status: string): string {
    const map: Record<string, string> = {
      PUBLICADA: 'chip-success',
      BORRADOR: 'chip-warning',
      CERRADA: 'chip-default'
    };
    return map[status] || 'chip-default';
  }

  convHeaderColor(status: string): string {
    const map: Record<string, string> = {
      PUBLICADA: 'var(--color-primary)',
      BORRADOR: '#b8860b',
      CERRADA: 'var(--color-secondary)',
    };
    return map[status] || 'var(--color-primary)';
  }

  toggleView() {
    this.viewMode.update(v => v === 'cards' ? 'table' : 'cards');
  }

  async ngOnInit() {
    await Promise.all([this.load(), this.loadCategories()]);
  }

  async load() {
    this.loading.set(true);
    try {
      const data = await this.api.getConvocations();
      this.convocation.set(data);
      this.onSearch();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCategories() {
    try {
      this.categories.set(await this.api.getCategory());
    } catch { }
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this._filtered.set(this.convocation().filter(c =>
      (!q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) &&
      (!this.filterstatus || c.status === this.filterstatus)
    ));
  }

  openCreate() {
    this.form = EMPTY_CONV();
    this.editingId.set(null);
    this.showModal.set(true);
  }

  openEdit(c: Convocation) {
    this.form = {
      ...c,
      categoryIds: c.categoryIds ? [...c.categoryIds] : []
    };
    this.editingId.set(c.id!);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  toggleCategory(id: number) {
    if (!this.form.categoryIds) {
      this.form.categoryIds = [];
    }

    const idx = this.form.categoryIds.indexOf(id);
    if (idx >= 0) {
      this.form.categoryIds.splice(idx, 1);
    } else {
      this.form.categoryIds.push(id);
    }
  }

  async save() {
    this.saving.set(true);
    try {
      const payload = { ...this.form };

      if (payload.categories) {
        delete payload.categories;
      }

      if (this.editingId()) {
        await this.api.updateConvocation(this.editingId()!, payload);
        this.toast.success('Convocatoria actualizada con éxito');
      } else {
        await this.api.createConvocation(payload);
        this.toast.success('Convocatoria creada con éxito');
      }
      this.closeModal();
      await this.load();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(c: Convocation) {
    this.deleteTarget.set(c);
    this.showConfirm.set(true);
  }

  async deleteConvocatoria() {
    if (!this.deleteTarget()) return;
    this.saving.set(true);
    try {
      await this.api.deleteConvocation(this.deleteTarget()!.id!);
      this.toast.success('Convocatoria eliminada');
      this.showConfirm.set(false);
      await this.load();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.saving.set(false);
    }
  }
}