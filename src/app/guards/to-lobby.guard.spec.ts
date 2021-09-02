import { TestBed } from '@angular/core/testing';

import { ToLobbyGuard } from './to-lobby.guard';

describe('ToLobbyGuard', () => {
  let guard: ToLobbyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ToLobbyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
