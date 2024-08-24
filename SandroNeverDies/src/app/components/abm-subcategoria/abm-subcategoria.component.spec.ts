import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmSubcategoriaComponent } from './abm-subcategoria.component';

describe('AbmSubcategoriaComponent', () => {
  let component: AbmSubcategoriaComponent;
  let fixture: ComponentFixture<AbmSubcategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmSubcategoriaComponent]
    });
    fixture = TestBed.createComponent(AbmSubcategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
