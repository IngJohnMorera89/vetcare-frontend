import { Injectable, signal, inject, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from '../core/api';
import { mensajeDeError } from '../core/errores';
import { AuthService, Rol } from './auth.service';
import { NotificacionesService } from './notificaciones.service';

export interface CuentaUsuario {
  id: number;
  username: string;
  nombre: string | null;
  rol: Rol;
  veterinarioId: number | null;
}

export interface NuevaCuenta {
  username: string;
  password: string;
  nombre: string;
  rol: Rol;
  veterinarioId: number | null;
}

// Cuentas del personal: solo la administración las ve y las crea
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private notificaciones = inject(NotificacionesService);
  private apiUrl = `${API_URL}/usuarios`;

  private listaCuentas = signal<CuentaUsuario[]>([]);
  cuentas = this.listaCuentas.asReadonly();

  constructor() {
    effect(() => {
      // Para otro rol, GET /api/usuarios responde 403: ni se intenta
      if (this.authService.usuario() && this.authService.tieneRol('ADMIN')) {
        this.http.get<CuentaUsuario[]>(this.apiUrl)
          .subscribe(datos => this.listaCuentas.set(datos));
      } else {
        this.listaCuentas.set([]);
      }
    });
  }

  // POST /api/usuarios
  crearCuenta(nueva: NuevaCuenta) {
    this.http.post<CuentaUsuario>(this.apiUrl, nueva).subscribe({
      next: (creada) => {
        this.listaCuentas.update(actuales => [...actuales, creada]);
        this.notificaciones.exito(`Cuenta "${creada.username}" creada. Ya puede iniciar sesión.`);
      },
      error: (error: HttpErrorResponse) => this.notificaciones.error(mensajeDeError(error))
    });
  }
}