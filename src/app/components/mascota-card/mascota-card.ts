import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mascota-card',
  imports: [],
  templateUrl: './mascota-card.html',
  styleUrl: './mascota-card.css',
})
export class MascotaCard {
  @Input() nombre = '';
  @Input() especie = '';
  @Input() edad = 0;
}
