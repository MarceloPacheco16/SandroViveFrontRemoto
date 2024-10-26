import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPorInformeComponent } from './ventas-por-informe.component';

describe('VentasPorInformeComponent', () => {
  let component: VentasPorInformeComponent;
  let fixture: ComponentFixture<VentasPorInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentasPorInformeComponent]
    });
    fixture = TestBed.createComponent(VentasPorInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
