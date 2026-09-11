import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);

  error = this.authService.error;

  ingresar(
    evento: SubmitEvent,
    inputUsername: HTMLInputElement,
    inputPassword: HTMLInputElement
  ) {
    evento.preventDefault();

    if (!inputUsername.value || !inputPassword.value) {
      return;
    }

    this.authService.iniciarSesion({
      username: inputUsername.value,
      password: inputPassword.value
    });
  }
}