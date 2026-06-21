import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/models';

const EMPTY_USER = (): User => ({
  identification: '', name: '', email: '',
  password: '', role: 'ESTUDIANTE', status: 'ACTIVO'
});

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="page-header">
        <div class="page-header-left">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema. Solo accesible para administradores.</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" (click)="openCreate()">Nuevo Usuario</button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="search-input-wrapper">
          <span class="search-icon"></span>
          <input class="form-control search-input" type="text"
                 placeholder="Buscar por nombre, email o identificación..."
                 [(ngModel)]="search" (ngModelChange)="onSearch()">
        </div>
        <select class="form-control" style="width:auto;" [(ngModel)]="filterRole" (ngModelChange)="onSearch()">
          <option value="">Todos los roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="DOCENTE">Docente</option>
          <option value="ESTUDIANTE">Estudiante</option>
        </select>
        <select class="form-control" style="width:auto;" [(ngModel)]="filterStatus" (ngModelChange)="onSearch()">
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      <!-- Table Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            Usuarios registrados
          </div>
          <span class="text-sm text-muted">{{ filtered().length }} usuarios</span>
        </div>
        @if (loading()) {
          <div class="loading-spinner"><div class="spinner"></div></div>
        } @else if (filtered().length === 0) {
          <div class="empty-state">
            <div class="empty-state-icon"></div>
            <h3>Sin usuarios</h3>
            <p>No se encontraron usuarios con los filtros actuales.</p>
          </div>
        } @else {
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Identificación</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (u of filtered(); track u.id) {
                  <tr>
                    <td class="td-mono">{{ u.id }}</td>
                    <td style="font-weight:500;">{{ u.name }}</td>
                    <td class="td-mono">{{ u.identification }}</td>
                    <td class="text-secondary text-sm">{{ u.email }}</td>
                    <td><span class="role-badge {{ u.role.toLowerCase() }}">{{ u.role }}</span></td>
                    <td>
                      <span class="status-chip {{ u.status === 'ACTIVO' ? 'chip-success' : 'chip-default' }}">
                        {{ u.status }}
                      </span>
                    </td>
                    <td>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-ghost btn-sm" (click)="openEdit(u)">Editar</button>
                        <button class="btn btn-ghost btn-sm" (click)="toggleStatus(u)">
                          {{ u.status === 'ACTIVO' ? 'Desactivar' : 'Activar' }}
                        </button>
                        <button class="btn btn-ghost btn-sm" (click)="confirmDelete(u)">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Create/Edit Modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <span class="modal-title">{{ editingId() ? 'Editar Usuario' : 'Crear Usuario' }}</span>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveUsuario()" #uForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="uName">Nombre completo</label>
                  <input id="uName" name="name" type="text" class="form-control"
                         [(ngModel)]="form.name" placeholder="Ej: María López" required>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="uId">Identificación</label>
                  <input id="uId" name="identification" type="text" class="form-control"
                         [(ngModel)]="form.identification" placeholder="Ej: 1234567890" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label required" for="uEmail">Correo electrónico</label>
                <input id="uEmail" name="email" type="email" class="form-control"
                       [(ngModel)]="form.email" placeholder="usuario@usco.edu.co" required>
              </div>
              <div class="form-group">
                <label class="form-label" [class.required]="!editingId()" for="uPass">Contraseña</label>
                <input id="uPass" name="password" type="password" class="form-control"
                       [(ngModel)]="form.password"
                       [placeholder]="editingId() ? 'Dejar vacío para no cambiar' : 'Contraseña'"
                       [required]="!editingId()">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required" for="uRole">Rol</label>
                  <select id="uRole" name="role" class="form-control" [(ngModel)]="form.role" required>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="DOCENTE">Docente</option>
                    <option value="ESTUDIANTE">Estudiante</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label required" for="uStatus">Estado</label>
                  <select id="uStatus" name="status" class="form-control" [(ngModel)]="form.status" required>
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>
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
              <div class="confirm-title">¿Eliminar usuario?</div>
              <div class="confirm-message">
                Se eliminará a <strong>{{ deleteTarget()?.name }}</strong>. Esta acción no se puede deshacer.
              </div>
              <div class="confirm-actions">
                <button class="btn btn-ghost" (click)="showConfirm.set(false)">Cancelar</button>
                <button class="btn btn-danger" (click)="deleteUsuario()" [disabled]="saving()">
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
export class UserComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  usuarios = signal<User[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  showConfirm = signal(false);
  editingId = signal<number | null>(null);
  deleteTarget = signal<User | null>(null);
  search = '';
  filterRole = '';
  filterStatus = '';
  form: User = EMPTY_USER();
  private _filtered = signal<User[]>([]);
  readonly filtered = this._filtered.asReadonly();

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading.set(true);
    try {
      const data = await this.api.getUser();
      this.usuarios.set(data);
      this.onSearch();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.loading.set(false);
    }
  }

  onSearch() {
    const q = this.search.toLowerCase();
    this._filtered.set(this.usuarios().filter(u =>
      (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.identification.includes(q)) &&
      (!this.filterRole || u.role === this.filterRole) &&
      (!this.filterStatus || u.status === this.filterStatus)
    ));
  }

  openCreate() {
    this.form = EMPTY_USER();
    this.editingId.set(null);
    this.showModal.set(true);
  }

  openEdit(u: User) {
    this.form = { ...u, password: '' };
    this.editingId.set(u.id!);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  async saveUsuario() {
    this.saving.set(true);
    try {
      const payload = { ...this.form };
      if (this.editingId() && !payload.password) delete payload.password;
      if (this.editingId()) {
        await this.api.updateUser(this.editingId()!, payload);
        this.toast.success('Usuario actualizado correctamente');
      } else {
        await this.api.createUser(payload);
        this.toast.success('Usuario creado correctamente');
      }
      this.closeModal();
      await this.load();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.saving.set(false);
    }
  }

  async toggleStatus(u: User) {
    try {
      const updated: User = { ...u, status: u.status === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' };
      await this.api.updateUser(u.id!, updated);
      this.toast.success(`Usuario ${updated.status === 'ACTIVO' ? 'activado' : 'desactivado'}`);
      await this.load();
    } catch (e: any) {
      this.toast.error(e.message);
    }
  }

  confirmDelete(u: User) {
    this.deleteTarget.set(u);
    this.showConfirm.set(true);
  }

  async deleteUsuario() {
    if (!this.deleteTarget()) return;
    this.saving.set(true);
    try {
      await this.api.deleteUser(this.deleteTarget()!.id!);
      this.toast.success('Usuario eliminado');
      this.showConfirm.set(false);
      await this.load();
    } catch (e: any) {
      this.toast.error(e.message);
    } finally {
      this.saving.set(false);
    }
  }
}
