import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Icono } from '../../components/icono/icono';
import { leerCampo } from '../../core/formularios';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Icono],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);

  error = this.authService.error;
  cargando = this.authService.cargando;
  mostrarClave = signal(false);

  ingresar(evento: SubmitEvent) {
    evento.preventDefault();
    const datos = new FormData(evento.target as HTMLFormElement);

    this.authService.iniciarSesion({
      username: leerCampo(datos, 'username'),
      password: leerCampo(datos, 'password')
    });
  }
}