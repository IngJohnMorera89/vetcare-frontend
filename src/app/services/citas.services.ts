import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';
import { AuthService } from './auth.service';

export type EstadoCita = 'PROGRAMADA' | 'ATENDIDA' | 'CANCELADA';

export interface Cita {
  id: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
  costo: number | null;
  notas: string | null;
  mascotaId: number;
  mascotaNombre: string;
  mascotaEspecie: string;
  duenoNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
}

export interface NuevaCita {
  fecha: string;
  hora: string;
  motivo: string;
  mascotaId: number;
  veterinarioId: number;
}

export interface Atencion {
  notas: string;
  costo: number;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/citas`;

  private listaCitas = signal<Cita[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  citas = this.listaCitas.asReadonly();
  cargando = this.cargandoSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    effect(() => {
      if (this.authService.usuario()) {
        this.cargarCitas();
      } else {
        this.listaCitas.set([]);
        this.errorSignal.set(null);
      }
    });
  }

  // El veterinario pide SOLO sus citas; recepción y admin piden la agenda completa
  cargarCitas() {
    const url = this.authService.tieneRol('VETERINARIO')
      ? `${this.apiUrl}/mias`
      : this.apiUrl;

    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Cita[]>(url).subscribe({
      next: (datos) => {
        this.listaCitas.set(datos);
        this.cargandoSignal.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorSignal.set(mensajeDeError(error));
        this.cargandoSignal.set(false);
      }
    });
  }

  // POST /api/citas (recepción y admin)
  agendar(nueva: NuevaCita) {
    this.errorSignal.set(null);
    this.http.post<Cita>(this.apiUrl, nueva).subscribe({
      next: (creada) => this.listaCitas.update(actuales => [...actuales, creada]),
      error: (error: HttpErrorResponse) => this.errorSignal.set(mensajeDeError(error))
    });
  }

  // PATCH /api/citas/{id}/atender (solo el veterinario de esa cita)
  atender(id: number, atencion: Atencion) {
    this.errorSignal.set(null);
    this.http.patch<Cita>(`${this.apiUrl}/${id}/atender`, atencion).subscribe({
      next: (actualizada) => this.reemplazar(actualizada),
      error: (error: HttpErrorResponse) => this.errorSignal.set(mensajeDeError(error))
    });
  }

  // PATCH /api/citas/{id}/cancelar (recepción y admin)
  cancelar(id: number) {
    this.errorSignal.set(null);
    this.http.patch<Cita>(`${this.apiUrl}/${id}/cancelar`, {}).subscribe({
      next: (actualizada) => this.reemplazar(actualizada),
      error: (error: HttpErrorResponse) => this.errorSignal.set(mensajeDeError(error))
    });
  }

  // Cambia en la lista solo la cita que el backend devolvió actualizada
  private reemplazar(actualizada: Cita) {
    this.listaCitas.update(actuales =>
      actuales.map(cita => (cita.id === actualizada.id ? actualizada : cita))
    );
  }
}