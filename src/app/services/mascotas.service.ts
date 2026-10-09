import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';
import { AuthService } from './auth.service';
import { NotificacionesService } from './notificaciones.service';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string | null;
  edad: number;
  duenoId: number;
  dueno: string;
  foto: string;
}

export interface NuevaMascota {
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  duenoId: number;
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private notificaciones = inject(NotificacionesService);
  private apiUrl = `${API_URL}/mascotas`;

  private listaMascotas = signal<Mascota[]>([]);
  private cargandoSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  mascotas = this.listaMascotas.asReadonly();
  cargando = this.cargandoSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  private idsFavoritos = signal<Set<number>>(new Set());
  totalFavoritos = computed(() => this.idsFavoritos().size);

  constructor() {
    // Los datos siguen a la sesión: entra alguien -> se cargan; sale -> se limpian
    effect(() => {
      if (this.authService.usuario()) {
        this.cargarMascotas();
      } else {
        this.limpiar();
      }
    });
  }

  // GET /api/mascotas
  cargarMascotas() {
    this.cargandoSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Mascota[]>(this.apiUrl).subscribe({
      next: (datos) => {
        this.listaMascotas.set(datos);
        this.cargandoSignal.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorSignal.set(mensajeDeError(error));
        this.cargandoSignal.set(false);
      }
    });
  }

  // POST /api/mascotas
  crearMascota(nueva: NuevaMascota) {
    this.http.post<Mascota>(this.apiUrl, nueva).subscribe({
      next: (creada) => {
        this.listaMascotas.update(actuales => [...actuales, creada]);
        this.notificaciones.exito(`${creada.nombre} ya es paciente de VetCare.`);
      },
      error: (error: HttpErrorResponse) => this.notificaciones.error(mensajeDeError(error))
    });
  }

  esFavorito(id: number): boolean {
    return this.idsFavoritos().has(id);
  }

  alternarFavorito(id: number) {
    this.idsFavoritos.update(actuales => {
      const nuevos = new Set(actuales);
      if (nuevos.has(id)) {
        nuevos.delete(id);
      } else {
        nuevos.add(id);
      }
      return nuevos;
    });
  }

  // Al cerrar sesión no puede quedar nada del usuario anterior en memoria
  private limpiar() {
    this.listaMascotas.set([]);
    this.idsFavoritos.set(new Set());
    this.errorSignal.set(null);
    this.cargandoSignal.set(false);
  }
}