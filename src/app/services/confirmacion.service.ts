import { Injectable, signal } from '@angular/core';

export interface PeticionConfirmacion {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
}

// Reemplaza al confirm() del navegador por un diálogo propio de VetCare.
// confirmar() devuelve una promesa: se resuelve en true o false cuando la persona responde.
@Injectable({
  providedIn: 'root'
})
export class ConfirmacionService {
  private peticionSignal = signal<PeticionConfirmacion | null>(null);
  private resolver: ((respuesta: boolean) => void) | null = null;

  peticion = this.peticionSignal.asReadonly();

  confirmar(peticion: PeticionConfirmacion): Promise<boolean> {
    this.peticionSignal.set(peticion);
    return new Promise<boolean>(resolver => {
      this.resolver = resolver;
    });
  }

  responder(respuesta: boolean) {
    this.resolver?.(respuesta);
    this.resolver = null;
    this.peticionSignal.set(null);
  }
}