import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { rolGuard } from './guards/rol.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'agenda',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/agenda/agenda').then(m => m.Agenda)
  },
  {
    path: 'mascotas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mascotas-listado/mascotas-listado')
        .then(m => m.MascotasListado)
  },
  {
    path: 'mascotas/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mascota-detalle/mascota-detalle')
        .then(m => m.MascotaDetalle)
  },
  {
    path: 'duenos',
    canActivate: [authGuard, rolGuard('ADMIN', 'RECEPCIONISTA')],
    loadComponent: () =>
      import('./pages/duenos-listado/duenos-listado')
        .then(m => m.DuenosListado)
  },
  {
    path: '**',
    redirectTo: ''
  }
];