import { Injectable, signal, computed, effect } from '@angular/core';

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  dueno: string;
  foto: string;
}

@Injectable({
  providedIn: 'root',
})
export class MascotasService {
  private listaMascotas = signal<Mascota[]>([
    {
      id: 1,
      nombre: 'Firulais',
      especie: 'Perro',
      edad: 4,
      dueno: 'Ana Torres',
      foto: 'https://placedog.net/600/400?id=1',
    },
    {
      id: 2,
      nombre: 'Michi',
      especie: 'Gato',
      edad: 2,
      dueno: 'Luis Pérez',
      foto: 'https://loremflickr.com/600/400/cat?lock=2',
    },
    {
      id: 3,
      nombre: 'Rocky',
      especie: 'Perro',
      edad: 6,
      dueno: 'María Gómez',
      foto: 'https://placedog.net/600/400?id=7',
    },
  ]);

  mascotas = this.listaMascotas.asReadonly();

  private idsFavoritos = signal<Set<number>>(new Set());

  totalFavoritos = computed(() => this.idsFavoritos().size);

  esFavorito(id: number): boolean {
    return this.idsFavoritos().has(id);
  }

  alternarFavorito(id: number) {
    this.idsFavoritos.update((actuales) => {
      const nuevos = new Set(actuales);
      if (nuevos.has(id)) {
        nuevos.delete(id);
      } else {
        nuevos.add(id);
      }
      return nuevos;
    });
  }

  constructor() {
    effect(() => {
      const idsActuales = [...this.idsFavoritos()];
      localStorage.setItem('vetcare-favoritos', JSON.stringify(idsActuales));
    });
  }
}
