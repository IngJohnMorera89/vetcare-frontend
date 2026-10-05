import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';

export type Rol = 'ADMIN' | 'RECEPCIONISTA' | 'VETERINARIO';

export interface Credenciales {
  username: string;
  password: string;
}

interface RespuestaAuth {
  token: string;
}

// Lo que viaja dentro del payload del JWT que firma el backend
interface ContenidoToken {
  sub: string;
  rol: Rol;
  nombre: string;
  exp: number;
}

const CLAVE_TOKEN = 'vetcare_token';

// Lee el payload del JWT (la parte del medio). No verifica la firma:
// eso solo lo puede hacer el backend, que es quien conoce la clave secreta.
function leerToken(token: string): ContenidoToken | null {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), letra => letra.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${API_URL}/auth`;

  private tokenSignal = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private errorSignal = signal<string | null>(null);

  private contenido = computed(() => {
    const token = this.tokenSignal();
    return token ? leerToken(token) : null;
  });

  sesionActiva = computed(() => {
    const contenido = this.contenido();
    return contenido !== null && contenido.exp * 1000 > Date.now();
  });

  usuario = computed(() => (this.sesionActiva() ? this.contenido()!.sub : null));
  nombre = computed(() => (this.sesionActiva() ? this.contenido()!.nombre : ''));
  rol = computed(() => (this.sesionActiva() ? this.contenido()!.rol : null));

  token = this.tokenSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor() {
    // Si al abrir la app el token guardado ya venció, se limpia de una vez
    if (this.tokenSignal() && !this.sesionActiva()) {
      this.borrarToken();
    }
  }

  tieneRol(...roles: Rol[]): boolean {
    const rolActual = this.rol();
    return rolActual !== null && roles.includes(rolActual);
  }

  iniciarSesion(credenciales: Credenciales) {
    this.errorSignal.set(null);

    this.http.post<RespuestaAuth>(`${this.apiUrl}/login`, credenciales).subscribe({
      next: (respuesta) => {
        this.tokenSignal.set(respuesta.token);
        localStorage.setItem(CLAVE_TOKEN, respuesta.token);
        this.router.navigateByUrl('/agenda');
      },
      error: (error: HttpErrorResponse) => {
        this.errorSignal.set(
          error.status === 401 ? 'Usuario o contraseña incorrectos.' : mensajeDeError(error)
        );
      }
    });
  }

  cerrarSesion(redireccion: '/' | '/login' = '/') {
    this.borrarToken();
    this.router.navigateByUrl(redireccion);
  }

  private borrarToken() {
    this.tokenSignal.set(null);
    localStorage.removeItem(CLAVE_TOKEN);
  }
}