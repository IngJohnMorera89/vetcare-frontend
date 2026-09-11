import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  private authService = inject(AuthService);

  error = this.authService.error;

  crearCuenta(
    evento: SubmitEvent,
    inputUsername: HTMLInputElement,
    inputPassword: HTMLInputElement
  ) {
    evento.preventDefault();

    if (!inputUsername.value || !inputPassword.value) {
      return;
    }

    this.authService.registrar({
      username: inputUsername.value,
      password: inputPassword.value
    });
  }
}