import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaCard } from './mascota-card';

describe('MascotaCard', () => {
  let component: MascotaCard;
  let fixture: ComponentFixture<MascotaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MascotaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
