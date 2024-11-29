import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudReclamoComponent } from './solicitud-reclamo.component';

describe('SolicitudReclamoComponent', () => {
  let component: SolicitudReclamoComponent;
  let fixture: ComponentFixture<SolicitudReclamoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudReclamoComponent]
    });
    fixture = TestBed.createComponent(SolicitudReclamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
