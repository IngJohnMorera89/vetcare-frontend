import { Component, inject, signal, computed } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CitasService, Cita } from '../../services/citas.services';
import { MascotasService } from '../../services/mascotas.service';
import { VeterinariosService } from '../../services/veterinarios.service';

// Fecha de HOY en formato AAAA-MM-DD, según el reloj del computador (hora Colombia).
// No usamos toISOString(): esa da la fecha en UTC y después de las 7 p. m. ya es "mañana".
function hoyComoTexto(): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0
});

@Component({
  selector: 'app-agenda',
  imports: [],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css'
})
export class Agenda {
  private authService = inject(AuthService);
  private citasService = inject(CitasService);
  private mascotasService = inject(MascotasService);
  private veterinariosService = inject(VeterinariosService);

  citas = this.citasService.citas;
  cargando = this.citasService.cargando;
  error = this.citasService.error;
  mascotas = this.mascotasService.mascotas;
  veterinarios = this.veterinariosService.veterinarios;

  // ¿Quién está mirando la agenda? Cada rol ve y puede hacer cosas distintas
  esVeterinario = computed(() => this.authService.rol() === 'VETERINARIO');
  esAdmin = computed(() => this.authService.rol() === 'ADMIN');
  puedeGestionar = computed(() => this.authService.tieneRol('ADMIN', 'RECEPCIONISTA'));

  fechaSeleccionada = signal(hoyComoTexto());
  citaEnAtencion = signal<number | null>(null);

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

  hora(cita: Cita): string {
    return cita.hora.slice(0, 5);
  }

  pesos(valor: number): string {
    return formatoPesos.format(valor);
  }

  agendar(
    evento: SubmitEvent,
    selectMascota: HTMLSelectElement,
    selectVeterinario: HTMLSelectElement,
    inputFecha: HTMLInputElement,
    inputHora: HTMLInputElement,
    inputMotivo: HTMLInputElement
  ) {
    evento.preventDefault();

    if (!selectMascota.value || !selectVeterinario.value || !inputFecha.value
        || !inputHora.value || !inputMotivo.value) {
      return;
    }

    this.citasService.agendar({
      mascotaId: Number(selectMascota.value),
      veterinarioId: Number(selectVeterinario.value),
      fecha: inputFecha.value,
      hora: inputHora.value,
      motivo: inputMotivo.value
    });

    this.fechaSeleccionada.set(inputFecha.value);
    (evento.target as HTMLFormElement).reset();
  }

  cancelar(cita: Cita) {
    const confirmado = confirm(`¿Cancelar la cita de ${cita.mascotaNombre} a las ${this.hora(cita)}?`);
    if (confirmado) {
      this.citasService.cancelar(cita.id);
    }
  }

  atender(
    evento: SubmitEvent,
    cita: Cita,
    textareaNotas: HTMLTextAreaElement,
    inputCosto: HTMLInputElement
  ) {
    evento.preventDefault();

    if (!textareaNotas.value || !inputCosto.value) {
      return;
    }

    this.citasService.atender(cita.id, {
      notas: textareaNotas.value,
      costo: Number(inputCosto.value)
    });
    this.citaEnAtencion.set(null);
  }
}