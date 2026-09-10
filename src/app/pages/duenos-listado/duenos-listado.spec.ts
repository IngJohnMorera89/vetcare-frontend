import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuenosListado } from './duenos-listado';

describe('DuenosListado', () => {
  let component: DuenosListado;
  let fixture: ComponentFixture<DuenosListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuenosListado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuenosListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
