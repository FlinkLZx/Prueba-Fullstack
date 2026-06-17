// src/app/models/models.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  name: string;
  role: 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE';
}

export interface Usuario {
  id?: number;
  identification: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE';
  status: 'ACTIVO' | 'INACTIVO';
}

export interface Categoria {
  id?: number;
  nombre: string;
}

export interface Convocatoria {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cuposDisponibles: number;
  estado: 'BORRADOR' | 'PUBLICADA' | 'CERRADA';
  categoriaIds?: number[];
  categorias?: Categoria[];
}

export interface Postulacion {
  id?: number;
  estudianteId: number;
  convocatoriaId: number;
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  fechaPostulacion?: string;
  estudiante?: Usuario;
  convocatoria?: Convocatoria;
}

export interface CambioEstadoPostulacion {
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
