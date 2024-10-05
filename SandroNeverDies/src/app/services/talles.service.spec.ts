import { TestBed } from '@angular/core/testing';

import { TallesService } from './talles.service';

describe('TallesService', () => {
  let service: TallesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TallesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
