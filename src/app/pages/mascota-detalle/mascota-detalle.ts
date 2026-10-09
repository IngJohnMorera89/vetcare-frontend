import { Component, Input, inject, computed, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MascotasService } from '../../services/mascotas.service';
import { CitasService, Cita } from '../../services/citas.services';
import { Icono } from '../../components/icono/icono';
import { fechaLarga, pesos } from '../../core/formato';

@Component({
  selector: 'app-mascota-detalle',
  imports: [RouterLink, Icono],
  templateUrl: './mascota-detalle.html',
  styleUrl: './mascota-detalle.css'
})
export class MascotaDetalle {
  private mascotasService = inject(MascotasService);
  private citasService = inject(CitasService);

  // El id llega desde la URL (/mascotas/:id) como texto; lo guardamos como número en un Signal
  idMascota = signal(0);

  @Input() set id(valor: string) {
    this.idMascota.set(Number(valor));
  }

  cargandoMascotas = this.mascotasService.cargando;
  historia = signal<Cita[]>([]);
  cargandoHistoria = signal(true);

  mascota = computed(() =>
    this.mascotasService.mascotas().find(m => m.id === this.idMascota())
  );

  esFavorito = computed(() => this.mascotasService.esFavorito(this.idMascota()));

  ultimaVisita = computed(() =>
    this.historia().find(cita => cita.estado === 'ATENDIDA')
  );

  fechaLarga = fechaLarga;
  pesos = pesos;

  constructor() {
    // Cada vez que cambia el id de la URL, se pide la historia clínica de ese paciente
    effect(() => {
      const id = this.idMascota();
      if (!id) {
        return;
      }
      this.cargandoHistoria.set(true);
      this.citasService.historiaDe(id).subscribe({
        next: (citas) => {
          this.historia.set(citas);
          this.cargandoHistoria.set(false);
        },
        error: () => {
          this.historia.set([]);
          this.cargandoHistoria.set(false);
        }
      });
    });
  }

  alternarFavorito() {
    this.mascotasService.alternarFavorito(this.idMascota());
  }
}