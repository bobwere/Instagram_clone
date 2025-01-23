import { TestBed } from '@automock/jest';
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const { unit, unitRef: _ } = TestBed.create(AuthService).compile();

    authService = unit;
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
