import { TestBed } from '@angular/core/testing';

import { CondivisoService } from './condiviso.service';

describe('CondivisoService', () => {
  let service: CondivisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CondivisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
