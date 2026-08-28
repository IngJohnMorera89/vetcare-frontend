import { TestBed } from '@angular/core/testing';

import { MascotasService } from './mascotasService';

describe('Mascotas', () => {
  let service: MascotasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MascotasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
