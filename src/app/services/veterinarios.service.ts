import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/api';
import { AuthService } from './auth.service';

export interface Veterinario {
  id: number;
  nombre: string;
  especialidad: string | null;
  tarjetaProfesional: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinariosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private listaVeterinarios = signal<Veterinario[]>([]);
  veterinarios = this.listaVeterinarios.asReadonly();

  constructor() {
    effect(() => {
      if (this.authService.usuario()) {
        this.http.get<Veterinario[]>(`${API_URL}/veterinarios`)
          .subscribe(datos => this.listaVeterinarios.set(datos));
      } else {
        this.listaVeterinarios.set([]);
      }
    });
  }
}