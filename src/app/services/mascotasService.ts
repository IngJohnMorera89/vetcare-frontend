import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
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
  providedIn: 'root',
})
export class MascotasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/mascotas';

  private listaMascotas = signal<Mascota[]>([]);
  private cargandoSignal = signal<boolean>(true);
  private errorSignal = signal<string | null>(null);

  mascotas = this.listaMascotas.asReadonly();
  cargando = this.cargandoSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  private idsFavoritos = signal<Set<number>>(new Set());
  totalFavoritos = computed(() => this.idsFavoritos().size);

  constructor() {
    this.cargarMascotas();
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
      error: () => {
        this.errorSignal.set(
          'No pudimos conectarnos con el servidor de VetCare. Verifica que el backend esté corriendo en el puerto 8080.',
        );
        this.cargandoSignal.set(false);
      },
    });
  }

  // POST /api/mascotas
  crearMascota(nueva: NuevaMascota) {
    this.http.post<Mascota>(this.apiUrl, nueva).subscribe({
      next: (creada) => {
        this.listaMascotas.update((actuales) => [...actuales, creada]);
      },
      error: () => {
        this.errorSignal.set(
          'No pudimos registrar la mascota. Revisa los datos e intenta de nuevo.',
        );
      },
    });
  }

  esFavorito(id: number): boolean {
    return this.idsFavoritos().has(id);
  }

  alternarFavorito(id: number) {
    this.idsFavoritos.update((actuales) => {
      const nuevos = new Set(actuales);
      if (nuevos.has(id)) {
        nuevos.delete(id);
      } else {
        nuevos.add(id);
      }
      return nuevos;
    });
  }
}
