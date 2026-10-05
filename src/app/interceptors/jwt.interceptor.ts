import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../core/api';
import { AuthService } from '../services/auth.service';

const RUTA_AUTENTICACION = `${API_URL}/auth/`;

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  const esPeticionAlBackend = req.url.startsWith(API_URL);
  const esPeticionDeAutenticacion = req.url.startsWith(RUTA_AUTENTICACION);

  const debeAdjuntarToken = token && esPeticionAlBackend && !esPeticionDeAutenticacion;

  const peticion = debeAdjuntarToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const sesionRechazada =
        error.status === 401 && Boolean(token) && esPeticionAlBackend && !esPeticionDeAutenticacion;

      if (sesionRechazada) {
        authService.cerrarSesion('/login');
      }

      return throwError(() => error);
    })
  );
};