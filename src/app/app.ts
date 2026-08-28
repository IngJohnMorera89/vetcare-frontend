import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MascotasService } from './services/mascotasService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private mascotasService = inject(MascotasService);

  totalFavoritos = this.mascotasService.totalFavoritos;
}
