import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-mascota-card',
  templateUrl: './mascota-card.html',
  styleUrl: './mascota-card.css'
})
export class MascotaCard {
  @Input() nombre = '';
  @Input() especie = '';
  @Input() edad = 0;
  @Input() foto = '';
  @Input() esFavorito = false;

  favoritoCambiado = output<void>();

  alClicFavorito(evento: Event) {
    evento.stopPropagation();
    evento.preventDefault();
    this.favoritoCambiado.emit();
  }
}