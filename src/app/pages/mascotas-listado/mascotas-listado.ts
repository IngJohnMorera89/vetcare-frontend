import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotaCard } from '../../components/mascota-card/mascota-card';

@Component({
  selector: 'app-mascotas-listado',
  imports: [RouterLink, MascotaCard],
  templateUrl: './mascotas-listado.html',
  styleUrl: './mascotas-listado.css',
})
export class MascotasListado {
  mascotas = [
    {
      id: 1,
      nombre: 'Firulais',
      especie: 'Perro',
      edad: 4,
      foto: 'https://placedog.net/400/300?id=1',
    },
    {
      id: 2,
      nombre: 'Michi',
      especie: 'Gato',
      edad: 2,
      foto: 'https://loremflickr.com/400/300/cat?lock=2',
    },
    {
      id: 3,
      nombre: 'Rocky',
      especie: 'Perro',
      edad: 6,
      foto: 'https://placedog.net/400/300?id=7',
    },
  ];
}
