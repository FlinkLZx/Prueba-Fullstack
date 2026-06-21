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

export interface User {
  id?: number;
  identification: string;
  name: string;
  email: string;
  password?: string;
  role: 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE';
  status: 'ACTIVO' | 'INACTIVO';
}

export interface Category {
  id?: number;
  name: string;
}

export interface Convocation {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  spotsAvailable: number;
  status: 'BORRADOR' | 'PUBLICADA' | 'CERRADA';
  categoryIds?: number[];
  categories?: Category[];
}

export interface Postulation {
  id?: number;
  studentId: number;
  convocationId: number;
  status?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  postulationDate?: string;
  student?: User;
  convocation?: Convocation;
}

export interface ChangeStatusPostulation {
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
