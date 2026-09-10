import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'mascotas',
    loadComponent: () =>
      import('./pages/mascotas-listado/mascotas-listado').then((m) => m.MascotasListado),
  },
  {
    path: 'mascotas/:id',
    loadComponent: () =>
      import('./pages/mascota-detalle/mascota-detalle').then((m) => m.MascotaDetalle),
  },
  {
    path: 'duenos',
    loadComponent: () =>
      import('./pages/duenos-listado/duenos-listado').then((m) => m.DuenosListado),
  },
];
