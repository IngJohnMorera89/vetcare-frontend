import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Lo contrario de authGuard: las páginas públicas (inicio y login)
// no tienen sentido si ya hay sesión; se manda a la persona a su espacio.
export const invitadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.sesionActiva()
    ? router.createUrlTree([authService.rutaInicial()])
    : true;
};