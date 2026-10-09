import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ConfirmacionService } from '../../services/confirmacion.service';

@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialogo-confirmacion.html',
  styleUrl: './dialogo-confirmacion.css'
})
export class DialogoConfirmacion {
  private confirmacionService = inject(ConfirmacionService);

  peticion = this.confirmacionService.peticion;

  // Referencia al elemento <dialog> real del HTML
  private dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    // Si hay una petición, se abre como modal; si no, se cierra
    effect(() => {
      const elemento = this.dialogo().nativeElement;
      if (this.peticion() && !elemento.open) {
        elemento.showModal();
      } else if (!this.peticion() && elemento.open) {
        elemento.close();
      }
    });
  }

  responder(respuesta: boolean) {
    this.confirmacionService.responder(respuesta);
  }
}