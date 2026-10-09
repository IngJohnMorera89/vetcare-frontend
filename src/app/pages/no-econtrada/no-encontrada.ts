import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-no-encontrada',
  imports: [RouterLink],
  template: `
    <section class="no-encontrada">
      <p class="codigo">404</p>
      <h1 class="titulo-pagina">Esta página no existe</h1>
      <p class="subtitulo">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
      <a [routerLink]="authService.sesionActiva() ? authService.rutaInicial() : '/'" class="btn btn-primario">
        Volver a VetCare
      </a>
    </section>
  `,
  styles: `
    .no-encontrada {
      display: grid;
      justify-items: center;
      gap: var(--espacio-sm);
      padding: var(--espacio-xl) var(--espacio-md);
      text-align: center;
    }

    .codigo {
      font-size: 6rem;
      font-weight: 800;
      line-height: 1;
      color: var(--azul-claro);
      -webkit-text-stroke: 2px var(--azul-principal);
    }
  `
})
export class NoEncontrada {
  authService = inject(AuthService);
}