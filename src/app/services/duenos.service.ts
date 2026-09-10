import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Dueno {
  id: number;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
}

export interface NuevoDueno {
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class DuenosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/duenos';

  private listaDuenos = signal<Dueno[]>([]);
  private cargandoSignal = signal<boolean>(true);
  private errorSignal = signal<string | null>(null);

  duenos = this.listaDuenos.asReadonly();
  cargando = this.cargandoSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    this.cargarDuenos();
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
      error: () => {
        this.errorSignal.set(
          'No pudimos conectarnos con el servidor de VetCare. Verifica que el backend esté corriendo en el puerto 8080.',
        );
        this.cargandoSignal.set(false);
      },
    });
  }

  // POST /api/duenos
  crearDueno(nuevo: NuevoDueno) {
    this.http.post<Dueno>(this.apiUrl, nuevo).subscribe({
      next: (creado) => {
        this.listaDuenos.update((actuales) => [...actuales, creado]);
      },
      error: () => {
        this.errorSignal.set(
          'No pudimos registrar el dueño. Revisa los datos (el documento y el email deben ser únicos).',
        );
      },
    });
  }
}
