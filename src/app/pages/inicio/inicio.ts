import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icono, NombreIcono } from '../../components/icono/icono';

interface Beneficio {
  icono: NombreIcono;
  titulo: string;
  texto: string;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Icono],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {
  anio = new Date().getFullYear();

  beneficios: Beneficio[] = [
    {
      icono: 'agenda',
      titulo: 'Recepción sin papeles',
      texto: 'Agenda del día por hora y veterinario. Agendar o cancelar toma segundos.'
    },
    {
      icono: 'historia',
      titulo: 'Historia clínica al instante',
      texto: 'Cada veterinario ve sus citas, registra el diagnóstico y el cobro en la misma pantalla.'
    },
    {
      icono: 'panel',
      titulo: 'Números claros',
      texto: 'La administración ve ingresos, citas y pacientes en un solo panel.'
    }
  ];
}