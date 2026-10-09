import { Component, inject, computed, signal } from '@angular/core';
import { VeterinariosService } from '../../services/veterinarios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Rol } from '../../services/auth.service';
import { leerCampo } from '../../core/formularios';

const NOMBRES_DE_ROL: Record<Rol, string> = {
  ADMIN: 'Administración',
  RECEPCIONISTA: 'Recepción',
  VETERINARIO: 'Veterinario'
};

@Component({
  selector: 'app-personal',
  templateUrl: './personal.html',
  styleUrl: './personal.css'
})
export class Personal {
  private veterinariosService = inject(VeterinariosService);
  private usuariosService = inject(UsuariosService);

  veterinarios = this.veterinariosService.veterinarios;
  cuentas = this.usuariosService.cuentas;
  nombresDeRol = NOMBRES_DE_ROL;
  rolNuevaCuenta = signal<Rol>('RECEPCIONISTA');

  // Veterinarios que todavía no tienen cuenta: los únicos que se pueden ligar
  veterinariosSinCuenta = computed(() => {
    const ligados = new Set(this.cuentas().map(c => c.veterinarioId));
    return this.veterinarios().filter(v => !ligados.has(v.id));
  });

  // Para la tabla de veterinarios: el usuario con el que entra cada uno
  usuarioDe(veterinarioId: number): string | null {
    return this.cuentas().find(c => c.veterinarioId === veterinarioId)?.username ?? null;
  }

  cambiarRol(valor: string) {
    this.rolNuevaCuenta.set(valor as Rol);
  }

  crearVeterinario(evento: SubmitEvent) {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const datos = new FormData(formulario);

    this.veterinariosService.crearVeterinario({
      nombre: leerCampo(datos, 'nombre'),
      especialidad: leerCampo(datos, 'especialidad'),
      tarjetaProfesional: leerCampo(datos, 'tarjeta')
    });

    formulario.reset();
  }

  crearCuenta(evento: SubmitEvent) {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const datos = new FormData(formulario);
    const rol = leerCampo(datos, 'rol') as Rol;

    this.usuariosService.crearCuenta({
      nombre: leerCampo(datos, 'nombre'),
      username: leerCampo(datos, 'username'),
      password: leerCampo(datos, 'password'),
      rol,
      veterinarioId: rol === 'VETERINARIO' ? Number(leerCampo(datos, 'veterinarioId')) : null
    });

    formulario.reset();
    this.rolNuevaCuenta.set('RECEPCIONISTA');
  }
}