import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mascota-detalle',
  imports: [RouterLink],
  templateUrl: './mascota-detalle.html',
  styleUrl: './mascota-detalle.css',
})
export class MascotaDetalle {
  @Input() id = '';

  private mascotas = [
    {
      id: 1,
      nombre: 'Firulais',
      especie: 'Perro',
      edad: 4,
      dueno: 'Ana Torres',
      foto: 'https://placedog.net/600/400?id=1',
    },
    {
      id: 2,
      nombre: 'Michi',
      especie: 'Gato',
      edad: 2,
      dueno: 'Luis Pérez',
      foto: 'https://loremflickr.com/600/400/cat?lock=2',
    },
    {
      id: 3,
      nombre: 'Rocky',
      especie: 'Perro',
      edad: 6,
      dueno: 'María Gómez',
      foto: 'https://placedog.net/600/400?id=7',
    },
  ];

  get mascota() {
    return this.mascotas.find((m) => m.id === Number(this.id));
  }
}
