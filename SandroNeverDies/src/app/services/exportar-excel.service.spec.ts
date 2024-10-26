import { TestBed } from '@angular/core/testing';

import { ExportarExcelService } from './exportar-excel.service';

describe('ExcelExportService', () => {
  let service: ExportarExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportarExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
