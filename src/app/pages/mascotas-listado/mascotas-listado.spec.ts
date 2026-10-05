import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasListado } from './mascotas-listado';

describe('MascotasListado', () => {
  let component: MascotasListado;
  let fixture: ComponentFixture<MascotasListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasListado],
    }).compileComponents();

    fixture = TestBed.createComponent(MascotasListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
