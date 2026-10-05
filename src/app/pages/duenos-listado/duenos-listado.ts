import { Component, inject } from '@angular/core';
import { DuenosService } from '../../services/duenos.service';

@Component({
  selector: 'app-duenos-listado',
  imports: [],
  templateUrl: './duenos-listado.html',
  styleUrl: './duenos-listado.css'
})
export class DuenosListado {
  private duenosService = inject(DuenosService);

  duenos = this.duenosService.duenos;
  cargando = this.duenosService.cargando;
  error = this.duenosService.error;

  registrarDueno(
    evento: SubmitEvent,
    inputNombre: HTMLInputElement,
    inputApellido: HTMLInputElement,
    inputDocumento: HTMLInputElement,
    inputTelefono: HTMLInputElement,
    inputEmail: HTMLInputElement
  ) {
    evento.preventDefault();

    if (!inputNombre.value || !inputApellido.value || !inputDocumento.value) {
      return;
    }

    this.duenosService.crearDueno({
      nombre: inputNombre.value,
      apellido: inputApellido.value,
      documento: inputDocumento.value,
      telefono: inputTelefono.value,
      email: inputEmail.value
    });

    (evento.target as HTMLFormElement).reset();
  }
}