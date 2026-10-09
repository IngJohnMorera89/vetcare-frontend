import { Component, inject } from '@angular/core';
import { NotificacionesService } from '../../services/notificaciones.service';
import { Icono } from '../icono/icono';

@Component({
  selector: 'app-notificaciones',
  imports: [Icono],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css'
})
export class Notificaciones {
  private servicio = inject(NotificacionesService);

  notificaciones = this.servicio.notificaciones;

  cerrar(id: number) {
    this.servicio.cerrar(id);
  }
}
