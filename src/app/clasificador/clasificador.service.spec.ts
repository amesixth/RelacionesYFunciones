import { TestBed } from '@angular/core/testing';

import { ClasificadorService } from './clasificador.service';

describe('ClasificadorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClasificadorService = TestBed.get(ClasificadorService);
    expect(service).toBeTruthy();
  });
});
