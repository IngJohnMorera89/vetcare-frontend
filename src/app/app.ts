import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MascotasService } from './services/mascotas.service';
import { AuthService, Rol } from './services/auth.service';
import { Icono, NombreIcono } from './components/icono/icono';
import { Notificaciones } from './components/notificaciones/notificaciones';
import { DialogoConfirmacion } from './components/dialogo-confirmacion/dialogo-confirmacion';
import { fechaLarga, hoyComoTexto } from './core/formato';

interface EnlaceMenu {
  ruta: string;
  texto: string;
  icono: NombreIcono;
  roles: Rol[];
}

const TODOS: Rol[] = ['ADMIN', 'RECEPCIONISTA', 'VETERINARIO'];

// El menú completo de la aplicación; cada rol ve solo sus enlaces
const MENU: EnlaceMenu[] = [
  { ruta: '/panel', texto: 'Panel', icono: 'panel', roles: ['ADMIN'] },
  { ruta: '/agenda', texto: 'Agenda', icono: 'agenda', roles: TODOS },
  { ruta: '/mascotas', texto: 'Pacientes', icono: 'mascotas', roles: TODOS },
  { ruta: '/duenos', texto: 'Dueños', icono: 'duenos', roles: ['ADMIN', 'RECEPCIONISTA'] },
  { ruta: '/personal', texto: 'Personal', icono: 'personal', roles: ['ADMIN'] }
];

const NOMBRES_DE_ROL = {
  ADMIN: 'Administración',
  RECEPCIONISTA: 'Recepción',
  VETERINARIO: 'Veterinario'
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icono, Notificaciones, DialogoConfirmacion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private mascotasService = inject(MascotasService);
  authService = inject(AuthService);

  totalFavoritos = this.mascotasService.totalFavoritos;
  menuAbierto = signal(false);
  hoy = fechaLarga(hoyComoTexto());

  // Solo los enlaces del rol actual; para el veterinario, "Agenda" se llama "Mi agenda"
  enlaces = computed(() =>
    MENU
      .filter(enlace => this.authService.tieneRol(...enlace.roles))
      .map(enlace =>
        enlace.ruta === '/agenda' && this.authService.rol() === 'VETERINARIO'
          ? { ...enlace, texto: 'Mi agenda' }
          : enlace
      )
  );

  etiquetaRol = computed(() => {
    const rol = this.authService.rol();
    return rol ? NOMBRES_DE_ROL[rol] : '';
  });

  // "Laura Gómez" -> "LG"
  iniciales = computed(() =>
    this.authService.nombre()
      .split(' ')
      .filter(palabra => palabra.length > 0)
      .slice(0, 2)
      .map(palabra => palabra[0].toUpperCase())
      .join('')
  );

  alternarMenu() {
    this.menuAbierto.update(abierto => !abierto);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }
}