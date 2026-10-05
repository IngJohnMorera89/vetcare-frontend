import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from '../services/auth.service';

// Una "fábrica" de guards: recibe los roles permitidos y devuelve el guard listo.
// Uso en las rutas: canActivate: [authGuard, rolGuard('ADMIN', 'RECEPCIONISTA')]
export function rolGuard(...rolesPermitidos: Rol[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.tieneRol(...rolesPermitidos)
      ? true
      : router.createUrlTree(['/agenda']);
  };
}