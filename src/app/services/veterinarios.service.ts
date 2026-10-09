import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';
import { AuthService } from './auth.service';
import { NotificacionesService } from './notificaciones.service';

export interface Veterinario {
  id: number;
  nombre: string;
  especialidad: string | null;
  tarjetaProfesional: string;
}

export interface NuevoVeterinario {
  nombre: string;
  especialidad: string;
  tarjetaProfesional: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinariosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private notificaciones = inject(NotificacionesService);
  private apiUrl = `${API_URL}/veterinarios`;

  private listaVeterinarios = signal<Veterinario[]>([]);
  veterinarios = this.listaVeterinarios.asReadonly();

  constructor() {
    effect(() => {
      if (this.authService.usuario()) {
        this.http.get<Veterinario[]>(this.apiUrl)
          .subscribe(datos => this.listaVeterinarios.set(datos));
      } else {
        this.listaVeterinarios.set([]);
      }
    });
  }

  // POST /api/veterinarios (solo ADMIN)
  crearVeterinario(nuevo: NuevoVeterinario) {
    this.http.post<Veterinario>(this.apiUrl, nuevo).subscribe({
      next: (creado) => {
        this.listaVeterinarios.update(actuales => [...actuales, creado]);
        this.notificaciones.exito(`${creado.nombre} se unió al equipo médico.`);
      },
      error: (error: HttpErrorResponse) => this.notificaciones.error(mensajeDeError(error))
    });
  }
}