import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CitasService, Cita } from '../../services/citas.services';
import { MascotasService } from '../../services/mascotas.service';
import { VeterinariosService } from '../../services/veterinarios.service';
import { ConfirmacionService } from '../../services/confirmacion.service';
import { Icono } from '../../components/icono/icono';
import { leerCampo } from '../../core/formularios';
import { fechaLarga, hoyComoTexto, pesos, sumarDias } from '../../core/formato';

@Component({
  selector: 'app-agenda',
  imports: [RouterLink, Icono],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda {
  private authService = inject(AuthService);
  private citasService = inject(CitasService);
  private mascotasService = inject(MascotasService);
  private veterinariosService = inject(VeterinariosService);
  private confirmacion = inject(ConfirmacionService);

  citas = this.citasService.citas;
  cargando = this.citasService.cargando;
  error = this.citasService.error;
  mascotas = this.mascotasService.mascotas;
  veterinarios = this.veterinariosService.veterinarios;

  esVeterinario = computed(() => this.authService.rol() === 'VETERINARIO');
  esAdmin = computed(() => this.authService.rol() === 'ADMIN');
  puedeGestionar = computed(() => this.authService.tieneRol('ADMIN', 'RECEPCIONISTA'));

  hoy = hoyComoTexto();
  fechaSeleccionada = signal(this.hoy);
  citaEnAtencion = signal<number | null>(null);

  tituloDia = computed(() =>
    this.fechaSeleccionada() === this.hoy ? 'Hoy' : fechaLarga(this.fechaSeleccionada())
  );

  citasDelDia = computed(() =>
    this.citas()
      .filter(cita => cita.fecha === this.fechaSeleccionada())
      .sort((a, b) => a.hora.localeCompare(b.hora))
  );

  pendientes = computed(() =>
    this.citasDelDia().filter(cita => cita.estado === 'PROGRAMADA').length
  );

  atendidas = computed(() =>
    this.citasDelDia().filter(cita => cita.estado === 'ATENDIDA').length
  );

  ingresosDelDia = computed(() =>
    this.citasDelDia()
      .filter(cita => cita.estado === 'ATENDIDA')
      .reduce((total, cita) => total + (cita.costo ?? 0), 0)
  );

  pesos = pesos;

  hora(cita: Cita): string {
    return cita.hora.slice(0, 5);
  }

  moverDia(dias: number) {
    this.fechaSeleccionada.set(sumarDias(this.fechaSeleccionada(), dias));
  }

  agendar(evento: SubmitEvent) {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const datos = new FormData(formulario);
    const fecha = leerCampo(datos, 'fecha');

    this.citasService.agendar({
      mascotaId: Number(leerCampo(datos, 'mascotaId')),
      veterinarioId: Number(leerCampo(datos, 'veterinarioId')),
      fecha,
      hora: leerCampo(datos, 'hora'),
      motivo: leerCampo(datos, 'motivo')
    });

    this.fechaSeleccionada.set(fecha);
    formulario.reset();
  }

  async cancelar(cita: Cita) {
    const confirmado = await this.confirmacion.confirmar({
      titulo: '¿Cancelar esta cita?',
      mensaje: `La cita de ${cita.mascotaNombre} a las ${this.hora(cita)} quedará cancelada. Esta acción no se puede deshacer.`,
      textoConfirmar: 'Sí, cancelar cita'
    });
    if (confirmado) {
      this.citasService.cancelar(cita.id);
    }
  }

  atender(evento: SubmitEvent, cita: Cita) {
    evento.preventDefault();
    const datos = new FormData(evento.target as HTMLFormElement);

    this.citasService.atender(cita.id, {
      notas: leerCampo(datos, 'notas'),
      costo: Number(leerCampo(datos, 'costo'))
    });
    this.citaEnAtencion.set(null);
  }
}