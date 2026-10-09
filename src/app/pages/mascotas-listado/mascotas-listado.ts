import { RouterLink } from '@angular/router';
import { Component, inject, signal, computed } from '@angular/core';
import { MascotaCard } from '../../components/mascota-card/mascota-card';
import { Icono } from '../../components/icono/icono';
import { MascotasService } from '../../services/mascotas.service';
import { DuenosService } from '../../services/duenos.service';
import { AuthService } from '../../services/auth.service';
import { leerCampo } from '../../core/formularios';

// Las mismas especies que el backend reconoce para elegir la foto
const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Otro'];

@Component({
  selector: 'app-mascotas-listado',
  imports: [RouterLink, MascotaCard, Icono],
  templateUrl: './mascotas-listado.html',
  styleUrl: './mascotas-listado.css'
})
export class MascotasListado {
  private mascotasService = inject(MascotasService);
  private duenosService = inject(DuenosService);
  private authService = inject(AuthService);

  mascotas = this.mascotasService.mascotas;
  cargando = this.mascotasService.cargando;
  error = this.mascotasService.error;
  duenos = this.duenosService.duenos;

  especies = ESPECIES;
  filtrosEspecie = ['Todas', ...ESPECIES];
  puedeRegistrar = computed(() => this.authService.tieneRol('ADMIN', 'RECEPCIONISTA'));

  busqueda = signal('');
  especieFiltro = signal('Todas');

  mascotasFiltradas = computed(() => {
    const texto = this.busqueda().toLowerCase();
    const especie = this.especieFiltro();
    return this.mascotas().filter(m =>
      (m.nombre.toLowerCase().includes(texto) || m.dueno.toLowerCase().includes(texto)) &&
      (especie === 'Todas' || m.especie === especie)
    );
  });

  esFavorito(id: number) {
    return this.mascotasService.esFavorito(id);
  }

  alternarFavorito(id: number) {
    this.mascotasService.alternarFavorito(id);
  }

  registrarMascota(evento: SubmitEvent) {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const datos = new FormData(formulario);

    this.mascotasService.crearMascota({
      nombre: leerCampo(datos, 'nombre'),
      especie: leerCampo(datos, 'especie'),
      raza: leerCampo(datos, 'raza'),
      edad: Number(leerCampo(datos, 'edad')) || 0,
      duenoId: Number(leerCampo(datos, 'duenoId'))
    });

    formulario.reset();
  }
}