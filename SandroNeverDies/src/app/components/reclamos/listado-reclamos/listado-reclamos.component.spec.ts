import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoReclamosComponent } from './listado-reclamos.component';

describe('ListadoReclamosComponent', () => {
  let component: ListadoReclamosComponent;
  let fixture: ComponentFixture<ListadoReclamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListadoReclamosComponent]
    });
    fixture = TestBed.createComponent(ListadoReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
