import { RouterLink } from '@angular/router';
import { MascotaCard } from '../../components/mascota-card/mascota-card';
import { Component, inject, signal, computed } from '@angular/core';
import { MascotasService } from '../../services/mascotasService';
import { DuenosService } from '../../services/duenos.service';

@Component({
  selector: 'app-mascotas-listado',
  imports: [RouterLink, MascotaCard],
  templateUrl: './mascotas-listado.html',
  styleUrl: './mascotas-listado.css',
})
export class MascotasListado {
  private mascotasService = inject(MascotasService);
  private duenosService = inject(DuenosService);

  mascotas = this.mascotasService.mascotas;
  cargando = this.mascotasService.cargando;
  error = this.mascotasService.error;

  // Para el <select> del formulario: se llena con GET /api/duenos (mismo patrón de servicio)
  duenos = this.duenosService.duenos;

  busqueda = signal('');

  mascotasFiltradas = computed(() =>
    this.mascotas().filter((m) => m.nombre.toLowerCase().includes(this.busqueda().toLowerCase())),
  );

  esFavorito(id: number) {
    return this.mascotasService.esFavorito(id);
  }

  alternarFavorito(id: number) {
    this.mascotasService.alternarFavorito(id);
  }

  registrarMascota(
    evento: SubmitEvent,
    inputNombre: HTMLInputElement,
    inputEspecie: HTMLInputElement,
    inputRaza: HTMLInputElement,
    inputEdad: HTMLInputElement,
    selectDueno: HTMLSelectElement,
  ) {
    evento.preventDefault();

    if (!inputNombre.value || !inputEspecie.value || !selectDueno.value) {
      return;
    }

    this.mascotasService.crearMascota({
      nombre: inputNombre.value,
      especie: inputEspecie.value,
      raza: inputRaza.value,
      edad: Number(inputEdad.value) || 0,
      duenoId: Number(selectDueno.value),
    });

    (evento.target as HTMLFormElement).reset();
  }
}
