import { TestBed } from '@angular/core/testing';

import { MotivodevolucionesService } from './motivodevoluciones.service';

describe('MotivodevolucionesService', () => {
  let service: MotivodevolucionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotivodevolucionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
