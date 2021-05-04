import { TestBed } from '@angular/core/testing';

import { GameUsersService } from './game-users.service';

describe('GameUsersService', () => {
  let service: GameUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
