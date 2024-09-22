import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmProductoComponent } from './abm-producto.component';

describe('AbmClienteComponent', () => {
  let component: AbmProductoComponent;
  let fixture: ComponentFixture<AbmProductoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmProductoComponent]
    });
    fixture = TestBed.createComponent(AbmProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
