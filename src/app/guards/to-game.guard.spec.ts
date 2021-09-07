import { TestBed } from '@angular/core/testing';

import { ToGameGuard } from './to-game.guard';

describe('ToGameGuard', () => {
  let guard: ToGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ToGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
