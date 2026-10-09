import { Component, inject, signal, computed } from '@angular/core';
import { DuenosService, Dueno } from '../../services/duenos.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmacionService } from '../../services/confirmacion.service';
import { Icono } from '../../components/icono/icono';
import { leerCampo } from '../../core/formularios';

@Component({
  selector: 'app-duenos-listado',
  imports: [Icono],
  templateUrl: './duenos-listado.html',
  styleUrl: './duenos-listado.css'
})
export class DuenosListado {
  private duenosService = inject(DuenosService);
  private authService = inject(AuthService);
  private confirmacion = inject(ConfirmacionService);

  duenos = this.duenosService.duenos;
  cargando = this.duenosService.cargando;
  error = this.duenosService.error;

  esAdmin = computed(() => this.authService.rol() === 'ADMIN');
  busqueda = signal('');

  duenosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase();
    return this.duenos().filter(d =>
      `${d.nombre} ${d.apellido}`.toLowerCase().includes(texto) || d.documento.includes(texto)
    );
  });

  registrarDueno(evento: SubmitEvent) {
    evento.preventDefault();
    const formulario = evento.target as HTMLFormElement;
    const datos = new FormData(formulario);

    this.duenosService.crearDueno({
      nombre: leerCampo(datos, 'nombre'),
      apellido: leerCampo(datos, 'apellido'),
      documento: leerCampo(datos, 'documento'),
      telefono: leerCampo(datos, 'telefono'),
      email: leerCampo(datos, 'email')
    });

    formulario.reset();
  }

  async eliminar(dueno: Dueno) {
    const confirmado = await this.confirmacion.confirmar({
      titulo: `¿Eliminar a ${dueno.nombre} ${dueno.apellido}?`,
      mensaje: 'Solo se puede eliminar un dueño que no tenga mascotas registradas.',
      textoConfirmar: 'Sí, eliminar'
    });
    if (confirmado) {
      this.duenosService.eliminarDueno(dueno);
    }
  }
}