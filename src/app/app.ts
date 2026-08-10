import { Component } from '@angular/core';
import { MascotaCard } from './components/mascota-card/mascota-card';

@Component({
  selector: 'app-root',
  imports: [MascotaCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected nombreClinica = 'VetCare';

  mascotas = [
    { nombre: 'Firulais', especie: 'Perro', edad: 3 },
    { nombre: 'Michi', especie: 'Gato', edad: 2 },
    { nombre: 'Nemo', especie: 'Pez', edad: 1 },
  ];
}
