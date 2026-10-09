import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'exito' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

const DURACION_MS = 4500;

// Avisos cortos que aparecen en una esquina y se van solos ("toasts").
// Cualquier servicio los puede disparar; un solo componente los dibuja.
@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  private lista = signal<Notificacion[]>([]);
  private siguienteId = 1;

  notificaciones = this.lista.asReadonly();

  exito(mensaje: string) {
    this.mostrar('exito', mensaje);
  }

  error(mensaje: string) {
    this.mostrar('error', mensaje);
  }

  info(mensaje: string) {
    this.mostrar('info', mensaje);
  }

  cerrar(id: number) {
    this.lista.update(actuales => actuales.filter(n => n.id !== id));
  }

  private mostrar(tipo: TipoNotificacion, mensaje: string) {
    const id = this.siguienteId++;
    this.lista.update(actuales => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), DURACION_MS);
  }
}