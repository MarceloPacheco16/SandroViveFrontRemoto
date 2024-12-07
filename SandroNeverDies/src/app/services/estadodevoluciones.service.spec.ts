import { TestBed } from '@angular/core/testing';

import { EstadodevolucionesService } from './estadodevoluciones.service';

describe('EstadodevolucionesService', () => {
  let service: EstadodevolucionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadodevolucionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
