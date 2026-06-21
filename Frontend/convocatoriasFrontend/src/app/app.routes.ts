// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAdmin()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

const loginGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [loginGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./pages/user/user.component').then(m => m.UserComponent), canActivate: [adminGuard] },
      { path: 'categorias', loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent) },
      { path: 'convocatorias', loadComponent: () => import('./pages/convocation/convocation.component').then(m => m.ConvocationsComponent) },
      //{ path: 'postulaciones', loadComponent: () => import('./pages/postulaciones/postulaciones.component').then(m => m.PostulacionesComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
