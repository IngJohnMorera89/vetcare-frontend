import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface Credenciales {
  username: string;
  password: string;
}

interface RespuestaAuth {
  token: string;
}

interface NuevoUsuario {
  username: string;
  password: string;
  rol: 'USER' | 'ADMIN';
}

const CLAVE_TOKEN = 'vetcare_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  private tokenSignal = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private errorSignal = signal<string | null>(null);

  sesionActiva = computed(() => this.tokenSignal() !== null);
  error = this.errorSignal.asReadonly();

  iniciarSesion(credenciales: Credenciales) {
    this.errorSignal.set(null);

    this.http.post<RespuestaAuth>(`${this.apiUrl}/login`, credenciales).subscribe({
      next: (respuesta) => {
        this.tokenSignal.set(respuesta.token);
        localStorage.setItem(CLAVE_TOKEN, respuesta.token);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.errorSignal.set('Usuario o contraseña incorrectos.');
      }
    });
  }

  registrar(credenciales: Credenciales) {
    this.errorSignal.set(null);

    const nuevoUsuario: NuevoUsuario = { ...credenciales, rol: 'USER' };

    this.http.post<RespuestaAuth>(`${this.apiUrl}/registro`, nuevoUsuario).subscribe({
      next: (respuesta) => {
        this.tokenSignal.set(respuesta.token);
        localStorage.setItem(CLAVE_TOKEN, respuesta.token);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.errorSignal.set('No se pudo registrar. ¿Ese usuario ya existe?');
      }
    });
  }

  cerrarSesion() {
    this.tokenSignal.set(null);
    localStorage.removeItem(CLAVE_TOKEN);
    this.router.navigateByUrl('/');
  }
}