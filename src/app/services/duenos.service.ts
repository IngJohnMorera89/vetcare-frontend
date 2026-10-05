import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';
import { AuthService } from './auth.service';

export interface Dueno {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string | null;
  email: string | null;
}

export interface NuevoDueno {
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class DuenosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${API_URL}/duenos`;

  private listaDuenos = signal<Dueno[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  duenos = this.listaDuenos.asReadonly();
  cargando = this.cargandoSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    effect(() => {
      if (this.authService.usuario()) {
        this.cargarDuenos();
      } else {
        this.limpiar();
      }
    });
  }

  // GET /api/duenos
  cargarDuenos() {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Dueno[]>(this.apiUrl).subscribe({
      next: (datos) => {
        this.listaDuenos.set(datos);
        this.cargandoSignal.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorSignal.set(mensajeDeError(error));
        this.cargandoSignal.set(false);
      }
    });
  }

  // POST /api/duenos
  crearDueno(nuevo: NuevoDueno) {
    this.http.post<Dueno>(this.apiUrl, nuevo).subscribe({
      next: (creado) => {
        this.listaDuenos.update(actuales => [...actuales, creado]);
      },
      error: (error: HttpErrorResponse) => {
        this.errorSignal.set(mensajeDeError(error));
      }
    });
  }

  private limpiar() {
    this.listaDuenos.set([]);
    this.errorSignal.set(null);
    this.cargandoSignal.set(false);
  }
}