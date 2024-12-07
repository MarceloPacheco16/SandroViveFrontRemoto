import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayoresVentasComponent } from './mayores-ventas.component';

describe('MayoresVentasComponent', () => {
  let component: MayoresVentasComponent;
  let fixture: ComponentFixture<MayoresVentasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MayoresVentasComponent]
    });
    fixture = TestBed.createComponent(MayoresVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
