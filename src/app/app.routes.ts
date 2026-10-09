import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { rolGuard } from './guards/rol.guard';
import { invitadoGuard } from './guards/invitado.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'VetCare · Software para clínicas veterinarias',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'login',
    title: 'Iniciar sesión · VetCare',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'panel',
    title: 'Panel · VetCare',
    canActivate: [authGuard, rolGuard('ADMIN')],
    loadComponent: () => import('./pages/panel/panel').then(m => m.Panel)
  },
  {
    path: 'agenda',
    title: 'Agenda · VetCare',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/agenda/agenda').then(m => m.Agenda)
  },
  {
    path: 'mascotas',
    title: 'Pacientes · VetCare',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mascotas-listado/mascotas-listado').then(m => m.MascotasListado)
  },
  {
    path: 'mascotas/:id',
    title: 'Ficha del paciente · VetCare',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mascota-detalle/mascota-detalle').then(m => m.MascotaDetalle)
  },
  {
    path: 'duenos',
    title: 'Dueños · VetCare',
    canActivate: [authGuard, rolGuard('ADMIN', 'RECEPCIONISTA')],
    loadComponent: () =>
      import('./pages/duenos-listado/duenos-listado').then(m => m.DuenosListado)
  },
  {
    path: 'personal',
    title: 'Personal · VetCare',
    canActivate: [authGuard, rolGuard('ADMIN')],
    loadComponent: () => import('./pages/personal/personal').then(m => m.Personal)
  },
  {
    path: '**',
    title: 'Página no encontrada · VetCare',
    loadComponent: () =>
      import('./pages/no-econtrada/no-encontrada').then(m => m.NoEncontrada)
  }
];