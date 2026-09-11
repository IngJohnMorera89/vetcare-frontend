import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MascotasService } from './services/mascotasService';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private mascotasService = inject(MascotasService);
  authService = inject(AuthService);

  totalFavoritos = this.mascotasService.totalFavoritos;
}