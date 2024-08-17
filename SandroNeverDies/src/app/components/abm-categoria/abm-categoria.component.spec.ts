import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCategoriaComponent } from './abm-categoria.component';

describe('AbmCategoriaComponent', () => {
  let component: AbmCategoriaComponent;
  let fixture: ComponentFixture<AbmCategoriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbmCategoriaComponent]
    });
    fixture = TestBed.createComponent(AbmCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
