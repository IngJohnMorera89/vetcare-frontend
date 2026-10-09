import { Component, Input } from '@angular/core';

// Cada ícono es un trazo SVG de 24 x 24. Se dibuja con "currentColor":
// toma el color del texto que lo rodea, así un solo ícono sirve en cualquier lugar.
const TRAZOS = {
  panel: 'M3 20h18M6 16v-5M11 16V6M16 16v-8',
  agenda: 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3 10h18M8 3v4M16 3v4',
  mascotas: 'M8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM15.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 12c-2.5 0-5 3-5 5.5 0 1.4 1.1 2.5 2.5 2.5.9 0 1.6-.5 2.5-.5s1.6.5 2.5.5c1.4 0 2.5-1.1 2.5-2.5 0-2.5-2.5-5.5-5-5.5z',
  duenos: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6',
  personal: 'M4 6h16v14H4zM9 3h6v3H9zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17a4 4 0 0 1 8 0',
  salir: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  menu: 'M4 6h16M4 12h16M4 18h16',
  cerrar: 'M6 6l12 12M18 6L6 18',
  mas: 'M12 5v14M5 12h14',
  basura: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  buscar: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3',
  anterior: 'M15 6l-6 6 6 6',
  siguiente: 'M9 6l6 6-6 6',
  ojo: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  ojoCerrado: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 3l18 18',
  historia: 'M9 3h6v3H9zM9 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3M9 12h6M9 16h4',
  check: 'M5 12l5 5 9-10',
  alerta: 'M12 8v5M12 17h.01M10.3 3.9L2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'
};

export type NombreIcono = keyof typeof TRAZOS;

@Component({
  selector: 'app-icono',
  template: `
    <svg
      [attr.width]="tamano"
      [attr.height]="tamano"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true">
      <path [attr.d]="trazo"></path>
    </svg>
  `,
  styles: `:host { display: inline-flex; flex-shrink: 0; }`
})
export class Icono {
  @Input() nombre: NombreIcono = 'menu';
  @Input() tamano = 20;

  get trazo(): string {
    return TRAZOS[this.nombre];
  }
}