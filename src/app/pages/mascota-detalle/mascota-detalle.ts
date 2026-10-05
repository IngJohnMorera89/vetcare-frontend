import { Component, Input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service';

@Component({
  selector: 'app-mascota-detalle',
  imports: [RouterLink],
  templateUrl: './mascota-detalle.html',
  styleUrl: './mascota-detalle.css'
})
export class MascotaDetalle {
  @Input() id = '';

  private mascotasService = inject(MascotasService);

  mascota = computed(() =>
    this.mascotasService.mascotas().find(m => m.id === Number(this.id))
  );

  esFavorito = computed(() =>
    this.mascotasService.esFavorito(Number(this.id))
  );

  alternarFavorito() {
    this.mascotasService.alternarFavorito(Number(this.id));
  }
}