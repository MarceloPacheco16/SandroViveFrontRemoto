import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmClienteComponent } from './abm-cliente.component';

describe('AbmClienteComponent', () => {
  let component: AbmClienteComponent;
  let fixture: ComponentFixture<AbmClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmClienteComponent]
    });
    fixture = TestBed.createComponent(AbmClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
