import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotaCard } from '../../components/mascota-card/mascota-card';
import { MascotasService } from '../../services/mascotasService';

@Component({
  selector: 'app-mascotas-listado',
  imports: [RouterLink, MascotaCard],
  templateUrl: './mascotas-listado.html',
  styleUrl: './mascotas-listado.css',
})
export class MascotasListado {
  private mascotasService = inject(MascotasService);

  mascotas = this.mascotasService.mascotas;

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
}
