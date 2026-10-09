import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitasService } from '../../services/citas.services';
import { MascotasService } from '../../services/mascotas.service';
import { DuenosService } from '../../services/duenos.service';
import { VeterinariosService } from '../../services/veterinarios.service';
import { hoyComoTexto, pesos, sumarDias } from '../../core/formato';

interface DiaIngresos {
  fecha: string;
  etiqueta: string;
  total: number;
  porcentaje: number;
}

interface FilaVeterinario {
  nombre: string;
  atendidas: number;
  pendientes: number;
  ingresos: number;
}

const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

@Component({
  selector: 'app-panel',
  imports: [RouterLink],
  templateUrl: './panel.html',
  styleUrl: './panel.css'
})
export class Panel {
  private citasService = inject(CitasService);
  private mascotasService = inject(MascotasService);
  private duenosService = inject(DuenosService);
  private veterinariosService = inject(VeterinariosService);

  cargando = this.citasService.cargando;
  hoy = hoyComoTexto();
  mesActual = this.hoy.slice(0, 7);
  pesos = pesos;

  private citas = this.citasService.citas;
  private atendidas = computed(() => this.citas().filter(c => c.estado === 'ATENDIDA'));
  private citasDelMes = computed(() => this.citas().filter(c => c.fecha.startsWith(this.mesActual)));

  // ---------- Indicadores (KPI) ----------
  citasHoy = computed(() => this.citas().filter(c => c.fecha === this.hoy));
  pendientesHoy = computed(() => this.citasHoy().filter(c => c.estado === 'PROGRAMADA'));

  ingresosMes = computed(() =>
    this.atendidas()
      .filter(c => c.fecha.startsWith(this.mesActual))
      .reduce((total, c) => total + (c.costo ?? 0), 0)
  );

  atencionesMes = computed(() =>
    this.citasDelMes().filter(c => c.estado === 'ATENDIDA').length
  );

  totalPacientes = computed(() => this.mascotasService.mascotas().length);
  totalDuenos = computed(() => this.duenosService.duenos().length);

  tasaCancelacion = computed(() => {
    const total = this.citasDelMes().length;
    const canceladas = this.citasDelMes().filter(c => c.estado === 'CANCELADA').length;
    return total === 0 ? 0 : Math.round((canceladas / total) * 100);
  });

  // ---------- Gráfica: ingresos de los últimos 7 días ----------
  ingresosSemana = computed<DiaIngresos[]>(() => {
    const dias = [6, 5, 4, 3, 2, 1, 0].map(atras => sumarDias(this.hoy, -atras));
    const totales = dias.map(fecha =>
      this.atendidas()
        .filter(c => c.fecha === fecha)
        .reduce((total, c) => total + (c.costo ?? 0), 0)
    );
    const maximo = Math.max(...totales, 1);

    return dias.map((fecha, i) => {
      const [anio, mes, dia] = fecha.split('-').map(Number);
      const diaSemana = new Date(anio, mes - 1, dia).getDay();
      return {
        fecha,
        etiqueta: fecha === this.hoy ? 'Hoy' : `${DIAS_CORTOS[diaSemana]} ${dia}`,
        total: totales[i],
        porcentaje: Math.round((totales[i] / maximo) * 100)
      };
    });
  });

  totalSemana = computed(() =>
    this.ingresosSemana().reduce((total, dia) => total + dia.total, 0)
  );

  // ---------- Tabla: rendimiento por veterinario en el mes ----------
  rendimiento = computed<FilaVeterinario[]>(() =>
    this.veterinariosService.veterinarios()
      .map(vet => {
        const suyas = this.citasDelMes().filter(c => c.veterinarioId === vet.id);
        const atendidas = suyas.filter(c => c.estado === 'ATENDIDA');
        return {
          nombre: vet.nombre,
          atendidas: atendidas.length,
          pendientes: suyas.filter(c => c.estado === 'PROGRAMADA').length,
          ingresos: atendidas.reduce((total, c) => total + (c.costo ?? 0), 0)
        };
      })
      .sort((a, b) => b.ingresos - a.ingresos)
  );
}