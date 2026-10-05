import { HttpErrorResponse } from '@angular/common/http';

// Traduce un error HTTP a un mensaje honesto para la persona que usa VetCare.
// El backend responde { codigo, mensaje, fecha }: si trae mensaje, lo usamos.
export function mensajeDeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No pudimos conectarnos con el servidor de VetCare. Verifica que el backend esté corriendo en el puerto 8080.';
  }
  if (error.status === 401) {
    return 'Tu sesión venció. Inicia sesión de nuevo.';
  }
  if (error.status === 403) {
    return 'Tu rol no tiene permiso para realizar esta acción.';
  }
  return error.error?.mensaje ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
}