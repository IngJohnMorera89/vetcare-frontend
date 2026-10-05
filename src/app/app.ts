import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MascotasService } from './services/mascotas.service';
import { AuthService } from './services/auth.service';

const NOMBRES_DE_ROL = {
  ADMIN: 'Administración',
  RECEPCIONISTA: 'Recepción',
  VETERINARIO: 'Veterinario'
};

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

  etiquetaRol = computed(() => {
    const rol = this.authService.rol();
    return rol ? NOMBRES_DE_ROL[rol] : '';
  });

  puedeVerDuenos = computed(() => this.authService.tieneRol('ADMIN', 'RECEPCIONISTA'));
}