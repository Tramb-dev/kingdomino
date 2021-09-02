import { TestBed } from '@angular/core/testing';

import { DominoesService } from './dominoes.service';

describe('DominoesService', () => {
  let service: DominoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DominoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
