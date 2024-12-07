import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenoresVentasComponent } from './menores-ventas.component';

describe('MenoresVentasComponent', () => {
  let component: MenoresVentasComponent;
  let fixture: ComponentFixture<MenoresVentasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenoresVentasComponent]
    });
    fixture = TestBed.createComponent(MenoresVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
